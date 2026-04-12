export interface BugReportMetadata {
  viewport: { width: number; height: number };
  screenResolution: { width: number; height: number };
  browser: string;
  browserVersion: string;
  os: string;
  userAgent: string;
  locale: string;
  referrer: string;
  scrollPosition: { x: number; y: number };
  pageLoadTime: number | null;
  timestampUtc: string;
  timestampLocal: string;
  timezone: string;
  consoleErrors: string[];
}

export interface BugReport {
  id: number;
  category: string;
  priority: string;
  title: string;
  description: string | null;
  screenshot_storage_path: string | null;
  screenshot_url: string | null;
  annotated_screenshot_storage_path: string | null;
  annotated_screenshot_url: string | null;
  attachment_urls: string[];
  page_url: string | null;
  metadata: BugReportMetadata | null;
  submitted_by: string | null;
  submitter_name: string | null;
  submitter_email: string | null;
  status: string;
  assignee: string | null;
  admin_notes: string | null;
  resolution_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

export const BUG_REPORT_CATEGORIES = [
  { value: "missing_content", label: "Missing Content" },
  { value: "wrong_content", label: "Wrong Content" },
  { value: "broken_feature", label: "Broken Feature" },
  { value: "bug", label: "Bug" },
  { value: "ui_ux", label: "UI/UX Issue" },
  { value: "feature_request", label: "Feature Request" },
  { value: "other", label: "Other" },
] as const;

export const BUG_REPORT_PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
] as const;

export const BUG_REPORT_STATUSES = [
  { value: "new", label: "New" },
  { value: "triaged", label: "On-Hold" },
  { value: "accepted", label: "Accepted" },
  { value: "in_progress", label: "Refused" },
  { value: "resolved", label: "Resolved" },
  { value: "wont_fix", label: "Won't Fix" },
  { value: "duplicate", label: "Duplicate" },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  triaged: "bg-purple-100 text-purple-800",
  accepted: "bg-indigo-100 text-indigo-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  resolved: "bg-green-100 text-green-800",
  wont_fix: "bg-slate-100 text-slate-800",
  duplicate: "bg-orange-100 text-orange-800",
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export const CATEGORY_COLORS: Record<string, string> = {
  missing_content: "bg-amber-100 text-amber-800",
  wrong_content: "bg-rose-100 text-rose-800",
  broken_feature: "bg-red-100 text-red-800",
  bug: "bg-red-100 text-red-800",
  ui_ux: "bg-violet-100 text-violet-800",
  feature_request: "bg-emerald-100 text-emerald-800",
  other: "bg-gray-100 text-gray-800",
};
