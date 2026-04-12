import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ADMIN_ROLES = ["super_admin", "admin", "manager", "operator"];

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (!profile || !ADMIN_ROLES.includes(profile.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const { data, error } = await supabase
      .from("bug_reports")
      .select("*")
      .eq("id", parseInt(id))
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ error: "Report not found" }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Failed to fetch report:", err);
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    const body = await request.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const updateData: Record<string, unknown> = {};

    if (body.status !== undefined) {
      const validStatuses = [
        "new",
        "triaged",
        "accepted",
        "in_progress",
        "resolved",
        "wont_fix",
        "duplicate",
        "closed",
      ];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }
      updateData.status = body.status;
      if (body.status === "resolved" || body.status === "closed") {
        updateData.resolved_at = new Date().toISOString();
      }
    }

    if (body.assignee !== undefined) updateData.assignee = body.assignee;
    if (body.admin_notes !== undefined) updateData.admin_notes = body.admin_notes;
    if (body.resolution_notes !== undefined)
      updateData.resolution_notes = body.resolution_notes;

    // Handle annotated screenshot upload
    if (body.annotated_screenshot) {
      const base64Data = body.annotated_screenshot.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `annotated/${Date.now()}-${id}.png`;

      const { error: uploadError } = await supabase.storage
        .from("reports")
        .upload(filename, buffer, {
          contentType: "image/png",
          upsert: true,
        });

      if (!uploadError) {
        updateData.annotated_screenshot_storage_path = filename;
        const {
          data: { publicUrl },
        } = supabase.storage.from("reports").getPublicUrl(filename);
        updateData.annotated_screenshot_url = publicUrl;
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("bug_reports")
      .update(updateData)
      .eq("id", parseInt(id))
      .select("*")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error("Failed to update report:", err);
    return NextResponse.json(
      { error: "Failed to update report" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    const { id } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    // Get the report first to find screenshot paths
    const { data: report } = await supabase
      .from("bug_reports")
      .select("screenshot_storage_path, annotated_screenshot_storage_path")
      .eq("id", parseInt(id))
      .single();

    // Delete screenshots from storage
    if (report) {
      const paths: string[] = [];
      if (report.screenshot_storage_path)
        paths.push(report.screenshot_storage_path);
      if (report.annotated_screenshot_storage_path)
        paths.push(report.annotated_screenshot_storage_path);
      if (paths.length > 0) {
        await supabase.storage.from("reports").remove(paths);
      }
    }

    const { error } = await supabase
      .from("bug_reports")
      .delete()
      .eq("id", parseInt(id));

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete report:", err);
    return NextResponse.json(
      { error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
