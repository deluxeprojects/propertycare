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

export async function GET(request: NextRequest) {
  const authError = await checkAdmin();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const priority = searchParams.get("priority");
    const assignee = searchParams.get("assignee");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("date_from");
    const dateTo = searchParams.get("date_to");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = createAdminClient() as any;

    let query = supabase.from("bug_reports").select("*");

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
          `title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`
        );
      }
    }

    // For JSON (Claude Code format), only export accepted/in_progress
    if (format === "json") {
      query = query.in("status", ["accepted", "in_progress"]);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const reports = (data || []) as Array<Record<string, unknown>>;

    if (format === "json") {
      const exported = reports.map((r) => ({
        id: r.id,
        status: r.status,
        category: r.category,
        priority: r.priority,
        title: r.title,
        description: r.description,
        page_url: r.page_url,
        submitter_name: r.submitter_name,
        assignee: r.assignee,
        admin_notes: r.admin_notes,
        screenshot_url: r.screenshot_url,
        annotated_screenshot_url: r.annotated_screenshot_url,
        attachment_urls: r.attachment_urls,
        metadata: r.metadata,
        created_at: r.created_at,
      }));

      return new NextResponse(JSON.stringify(exported, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="bug-reports-${new Date().toISOString().slice(0, 10)}.json"`,
        },
      });
    }

    // CSV format
    const headers = [
      "id",
      "status",
      "category",
      "priority",
      "title",
      "description",
      "page_url",
      "screenshot_url",
      "annotated_screenshot_url",
      "submitter_name",
      "submitter_email",
      "assignee",
      "admin_notes",
      "viewport",
      "browser",
      "os",
      "created_at",
      "updated_at",
      "resolved_at",
    ];

    const csvRows = [headers.join(",")];

    for (const r of reports) {
      const meta = (r.metadata || {}) as Record<string, unknown>;
      const viewport = meta.viewport
        ? `${(meta.viewport as Record<string, number>).width}x${(meta.viewport as Record<string, number>).height}`
        : "";
      const row = [
        r.id,
        r.status,
        r.category,
        r.priority,
        escapeCsv(String(r.title || "")),
        escapeCsv(String(r.description || "")),
        escapeCsv(String(r.page_url || "")),
        escapeCsv(String(r.screenshot_url || "")),
        escapeCsv(String(r.annotated_screenshot_url || "")),
        escapeCsv(String(r.submitter_name || "")),
        escapeCsv(String(r.submitter_email || "")),
        escapeCsv(String(r.assignee || "")),
        escapeCsv(String(r.admin_notes || "")),
        viewport,
        escapeCsv((meta.browser as string) || ""),
        escapeCsv((meta.os as string) || ""),
        r.created_at,
        r.updated_at,
        r.resolved_at || "",
      ];
      csvRows.push(row.join(","));
    }

    return new NextResponse(csvRows.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="bug-reports-${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (err) {
    console.error("Failed to export reports:", err);
    return NextResponse.json(
      { error: "Failed to export reports" },
      { status: 500 }
    );
  }
}

function escapeCsv(value: string): string {
  if (
    value.includes(",") ||
    value.includes('"') ||
    value.includes("\n")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
