import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { rateLimit } from "@/lib/api/rate-limit";

const reportSchema = z.object({
  category: z.enum([
    "missing_content",
    "wrong_content",
    "broken_feature",
    "bug",
    "ui_ux",
    "feature_request",
    "other",
  ]),
  priority: z
    .enum(["low", "medium", "high", "critical"])
    .optional()
    .default("medium"),
  title: z.string().min(1).max(120),
  description: z.string().max(2000).optional().nullable(),
  screenshot: z.string().optional().nullable(),
  attachments: z.array(z.string()).max(3).optional().nullable(),
  page_url: z.string().optional().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
  submitter_name: z.string().optional().nullable(),
  submitter_email: z.string().email().optional().nullable(),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
  const rl = rateLimit(ip, { limit: 5, windowMs: 60_000 });
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    const body = await request.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any;

    // Try to get current user
    let userId: string | null = null;
    const userName: string | null = data.submitter_name || null;
    let userEmail: string | null = data.submitter_email || null;
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
        userEmail = userEmail || user.email || null;
      }
    } catch (err) {
      // Not logged in — continue as anonymous
      console.error("[reports] Auth check failed (continuing as anonymous):", err);
    }

    // Upload screenshot if provided
    let screenshotUrl: string | null = null;
    let screenshotPath: string | null = null;

    if (data.screenshot) {
      const base64Data = data.screenshot.replace(
        /^data:image\/\w+;base64,/,
        ""
      );
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `screenshots/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;

      const { error: uploadError } = await admin.storage
        .from("reports")
        .upload(filename, buffer, {
          contentType: "image/png",
          upsert: false,
        });

      if (!uploadError) {
        screenshotPath = filename;
        const {
          data: { publicUrl },
        } = admin.storage.from("reports").getPublicUrl(filename);
        screenshotUrl = publicUrl;
      }
    }

    // Upload attachments if provided
    const attachmentUrls: string[] = [];
    if (data.attachments && data.attachments.length > 0) {
      for (let i = 0; i < data.attachments.length; i++) {
        const attachment = data.attachments[i];
        if (!attachment) continue;
        const base64Data = attachment.replace(
          /^data:image\/\w+;base64,/,
          ""
        );
        const buffer = Buffer.from(base64Data, "base64");
        const ext = attachment.match(/^data:image\/(\w+);/)?.[1] || "png";
        const filename = `attachments/${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}.${ext}`;

        const { error: uploadError } = await admin.storage
          .from("reports")
          .upload(filename, buffer, {
            contentType: `image/${ext}`,
            upsert: false,
          });

        if (!uploadError) {
          const {
            data: { publicUrl },
          } = admin.storage.from("reports").getPublicUrl(filename);
          attachmentUrls.push(publicUrl);
        }
      }
    }

    const { data: report, error } = await admin
      .from("bug_reports")
      .insert({
        category: data.category,
        priority: data.priority,
        title: data.title,
        description: data.description || null,
        screenshot_storage_path: screenshotPath,
        screenshot_url: screenshotUrl,
        attachment_urls: attachmentUrls,
        page_url: data.page_url || null,
        metadata: (data.metadata as Record<string, unknown>) || null,
        submitted_by: userId,
        submitter_name: userName,
        submitter_email: userEmail,
        status: "new",
      })
      .select("id")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ id: report.id }, { status: 201 });
  } catch (err) {
    console.error("Report submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
