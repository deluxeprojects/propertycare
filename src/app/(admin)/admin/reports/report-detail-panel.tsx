"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Loader2,
  Download,
  Eye,
  Pencil,
  ChevronDown,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  BUG_REPORT_STATUSES,
  STATUS_COLORS,
  PRIORITY_COLORS,
  CATEGORY_COLORS,
  BUG_REPORT_CATEGORIES,
  BUG_REPORT_PRIORITIES,
} from "@/types/bug-report";
import type { BugReport, BugReportMetadata } from "@/types/bug-report";
import { ScreenshotAnnotator } from "@/components/shared/screenshot-annotator";

interface ReportDetailPanelProps {
  report: BugReport | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}

export function ReportDetailPanel({
  report,
  open,
  onOpenChange,
  onSaved,
}: ReportDetailPanelProps) {
  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [annotatorOpen, setAnnotatorOpen] = useState(false);
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [localAnnotatedUrl, setLocalAnnotatedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (report) {
      setStatus(report.status);
      setAssignee(report.assignee || "");
      setAdminNotes(report.admin_notes || "");
      setLocalAnnotatedUrl(null);
    }
  }, [report]);

  const handleSave = async () => {
    if (!report) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/v1/admin/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          assignee: assignee || null,
          admin_notes: adminNotes || null,
        }),
      });
      if (!res.ok) throw new Error();
      toast.success("Report updated");
      onSaved();
    } catch {
      toast.error("Failed to update report");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!report || !confirm("Delete this report permanently?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/v1/admin/reports/${report.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Report deleted");
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error("Failed to delete report");
    } finally {
      setDeleting(false);
    }
  };

  const handleAnnotationSaved = async (dataUrl: string) => {
    if (!report) return;
    // Immediately show the annotation locally
    setLocalAnnotatedUrl(dataUrl);
    setAnnotatorOpen(false);
    try {
      const res = await fetch(`/api/v1/admin/reports/${report.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annotated_screenshot: dataUrl }),
      });
      if (!res.ok) throw new Error();
      toast.success("Annotated screenshot saved");
      onSaved();
    } catch {
      toast.error("Failed to save annotation");
    }
  };

  if (!report) return null;

  const meta = report.metadata as BugReportMetadata | null;
  const categoryLabel =
    BUG_REPORT_CATEGORIES.find((c) => c.value === report.category)?.label ||
    report.category;
  const priorityLabel =
    BUG_REPORT_PRIORITIES.find((p) => p.value === report.priority)?.label ||
    report.priority;
  const screenshotSrc =
    localAnnotatedUrl || report.annotated_screenshot_url || report.screenshot_url;
  const annotatorSrc =
    localAnnotatedUrl || report.screenshot_url;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="font-mono text-sm text-muted-foreground">
                #{report.id}
              </span>
              {report.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className={STATUS_COLORS[report.status] || ""}
              >
                {BUG_REPORT_STATUSES.find((s) => s.value === report.status)
                  ?.label || report.status}
              </Badge>
              <Badge
                variant="secondary"
                className={PRIORITY_COLORS[report.priority] || ""}
              >
                {priorityLabel}
              </Badge>
              <Badge
                variant="secondary"
                className={CATEGORY_COLORS[report.category] || ""}
              >
                {categoryLabel}
              </Badge>
            </div>

            {/* Description */}
            {report.description && (
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Description
                </Label>
                <p className="mt-1 text-sm whitespace-pre-wrap">
                  {report.description}
                </p>
              </div>
            )}

            {/* Page URL + Submitter side by side */}
            <div className="grid grid-cols-2 gap-4">
              {report.page_url && (
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                    Page URL
                  </Label>
                  <a
                    href={report.page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    {(() => { try { return new URL(report.page_url).pathname; } catch { return report.page_url; } })()}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Submitted By
                </Label>
                <p className="mt-1 text-sm">
                  {report.submitter_name || "Anonymous"}
                  {report.submitter_email && (
                    <span className="text-muted-foreground">
                      {" "}
                      ({report.submitter_email})
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Screenshot */}
            {screenshotSrc && (
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Screenshot
                  {(localAnnotatedUrl || report.annotated_screenshot_url) && " (Annotated)"}
                </Label>
                <div className="mt-2 space-y-2">
                  <img
                    src={screenshotSrc}
                    alt="Report screenshot"
                    className="rounded-md border cursor-pointer object-cover"
                    style={{ maxHeight: 180, width: "100%" }}
                    onClick={() => setLightboxOpen(true)}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = screenshotSrc;
                        a.download = `report-${report.id}-screenshot.png`;
                        a.click();
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                    {(report.screenshot_url || localAnnotatedUrl) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAnnotatorOpen(true)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        Annotate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Attachments */}
            {report.attachment_urls && report.attachment_urls.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Attachments ({report.attachment_urls.length})
                </Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {report.attachment_urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={url}
                        alt={`Attachment ${i + 1}`}
                        className="h-20 w-20 rounded-md border object-cover hover:opacity-80 transition-opacity"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            {meta && (
              <Collapsible open={metadataOpen} onOpenChange={setMetadataOpen}>
                <CollapsibleTrigger asChild>
                  <button className="flex w-full items-center justify-between text-xs text-muted-foreground uppercase tracking-wide hover:text-foreground">
                    Metadata
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${metadataOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="rounded-md border bg-muted/50 p-3 text-xs space-y-1">
                    <MetaRow label="Viewport" value={meta.viewport ? `${meta.viewport.width}x${meta.viewport.height}` : "-"} />
                    <MetaRow label="Screen" value={meta.screenResolution ? `${meta.screenResolution.width}x${meta.screenResolution.height}` : "-"} />
                    <MetaRow label="Browser" value={`${meta.browser} ${meta.browserVersion}`} />
                    <MetaRow label="OS" value={meta.os} />
                    <MetaRow label="Locale" value={meta.locale} />
                    <MetaRow label="Timezone" value={meta.timezone} />
                    <MetaRow label="Page Load" value={meta.pageLoadTime ? `${meta.pageLoadTime}ms` : "-"} />
                    <MetaRow label="Scroll" value={meta.scrollPosition ? `${meta.scrollPosition.x}, ${meta.scrollPosition.y}` : "-"} />
                    <MetaRow label="Referrer" value={meta.referrer || "-"} />
                    <MetaRow label="Time (UTC)" value={meta.timestampUtc} />
                    {meta.consoleErrors && meta.consoleErrors.length > 0 && (
                      <div className="pt-2 border-t mt-2">
                        <span className="font-medium text-red-600">
                          Console Errors ({meta.consoleErrors.length}):
                        </span>
                        <ul className="mt-1 space-y-1">
                          {meta.consoleErrors.map((err, i) => (
                            <li
                              key={i}
                              className="text-red-600 bg-red-50 rounded px-2 py-1 break-all"
                            >
                              {err}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Resolution Notes (AI-generated) */}
            {report.resolution_notes && (
              <div className="border-t pt-4">
                <Label className="text-xs text-muted-foreground uppercase tracking-wide">
                  Resolution Notes
                </Label>
                <div className="mt-2 rounded-md border bg-green-50 p-3 text-sm text-green-900 whitespace-pre-wrap">
                  {report.resolution_notes}
                </div>
              </div>
            )}

            {/* Admin controls */}
            <div className="space-y-3 border-t pt-4">
              <h3 className="text-sm font-semibold">Admin Controls</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BUG_REPORT_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Assignee</Label>
                  <Input
                    value={assignee}
                    onChange={(e) => setAssignee(e.target.value)}
                    placeholder="Assign to..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Admin Notes</Label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal notes..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-muted-foreground space-y-1 border-t pt-3">
              <p>Created: {new Date(report.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(report.updated_at).toLocaleString()}</p>
              {report.resolved_at && (
                <p>
                  Resolved: {new Date(report.resolved_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Screenshot lightbox — full-size */}
      {screenshotSrc && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] p-2">
            <DialogTitle className="sr-only">Screenshot Preview</DialogTitle>
            <div className="overflow-auto max-h-[90vh]">
              <img
                src={screenshotSrc}
                alt="Screenshot full view"
                className="w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Annotator — full-size */}
      {annotatorSrc && (
        <ScreenshotAnnotator
          open={annotatorOpen}
          onOpenChange={setAnnotatorOpen}
          screenshotUrl={annotatorSrc}
          onSave={handleAnnotationSaved}
        />
      )}
    </>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono">{value}</span>
    </div>
  );
}
