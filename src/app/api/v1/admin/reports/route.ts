import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ADMIN_ROLES = ["super_admin", "admin", "manager", "operator"];
const PAGE_SIZE = 20;

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

export async function GET(request: NextRequest) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const assignee = searchParams.get("assignee");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") === "asc" ? true : false;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    let query = supabase.from("bug_reports").select("*", { count: "exact" });

    if (status) query = query.eq("status", status);
    if (category) query = query.eq("category", category);
    if (priority) query = query.eq("priority", priority);
    if (assignee) query = query.eq("assignee", assignee);
    if (dateFrom) query = query.gte("created_at", dateFrom);
    if (dateTo) query = query.lte("created_at", dateTo + "T23:59:59Z");

    if (search) {
      const sanitized = search.replace(/[.,()%\\|&\-/]/g, "");
      if (sanitized) {
        query = query.or(
          `title.ilike.%${sanitized}%,description.ilike.%${sanitized}%,submitter_email.ilike.%${sanitized}%,submitter_name.ilike.%${sanitized}%`
        );
      }
    }

    const validSortCols = [
      "created_at",
      "updated_at",
      "priority",
      "status",
      "category",
      "title",
    ];
    const sortCol = validSortCols.includes(sort) ? sort : "created_at";

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    query = query.order(sortCol, { ascending: order }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch status counts (unfiltered) for metric boxes
    const { data: allReports } = await supabase
      .from("bug_reports")
      .select("status");

    const statusCounts: Record<string, number> = {};
    if (allReports) {
      for (const r of allReports) {
        statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
      }
    }

    return NextResponse.json({
      data: data || [],
      total: count || 0,
      totalPages: Math.ceil((count || 0) / PAGE_SIZE),
      page,
      statusCounts,
    });
  } catch (err) {
    console.error("Failed to fetch reports:", err);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    const body = await request.json();
    const { ids, status } = body;

    if (
      !Array.isArray(ids) ||
      ids.length === 0 ||
      typeof status !== "string"
    ) {
      return NextResponse.json(
        { error: "ids (array) and status (string) required" },
        { status: 400 }
      );
    }

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
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    const updateData: Record<string, unknown> = { status };
    if (status === "resolved") {
      updateData.resolved_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("bug_reports")
      .update(updateData)
      .in("id", ids);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, updated: ids.length });
  } catch (err) {
    console.error("Failed to update reports:", err);
    return NextResponse.json(
      { error: "Failed to update reports" },
      { status: 500 }
    );
  }
}
