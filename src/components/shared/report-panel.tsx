"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Camera, Paperclip, X, Eye, Pencil } from "lucide-react";
import { ScreenshotAnnotator } from "@/components/shared/screenshot-annotator";
import { BUG_REPORT_CATEGORIES, BUG_REPORT_PRIORITIES } from "@/types/bug-report";
import { collectMetadata } from "@/lib/bug-report/collect-metadata";

const MAX_ATTACHMENTS = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const formSchema = z.object({
  submitter_name: z.string().min(1, "Your name is required"),
  category: z.string().min(1, "Category is required"),
  priority: z.string(),
  title: z.string().min(1, "Title is required").max(120, "Title too long"),
  description: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AttachmentFile {
  file: File;
  preview: string;
}

interface ReportPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialScreenshot: string | null;
  captureError?: string | null;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ReportPanel({ open, onOpenChange, initialScreenshot, captureError }: ReportPanelProps) {
  const [includeScreenshot, setIncludeScreenshot] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [annotatorOpen, setAnnotatorOpen] = useState(false);
  const [annotatedScreenshot, setAnnotatedScreenshot] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      submitter_name: "",
      priority: "medium",
      category: "",
      title: "",
      description: "",
    },
  });

  const category = watch("category");
  const priority = watch("priority");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remaining = MAX_ATTACHMENTS - attachments.length;
    if (remaining <= 0) {
      toast.error(`Maximum ${MAX_ATTACHMENTS} attachments allowed`);
      return;
    }

    const newFiles: AttachmentFile[] = [];
    for (let i = 0; i < Math.min(files.length, remaining); i++) {
      const file = files[i];
      if (!file) continue;
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 5MB limit`);
        continue;
      }
      newFiles.push({ file, preview: URL.createObjectURL(file) });
    }

    setAttachments((prev) => [...prev, ...newFiles]);
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const item = prev[index];
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const metadata = collectMetadata();

      // Convert attachments to base64
      const attachmentData: string[] = [];
      for (const att of attachments) {
        const base64 = await fileToBase64(att.file);
        attachmentData.push(base64);
      }

      const res = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          screenshot: includeScreenshot ? (annotatedScreenshot ?? initialScreenshot) : null,
          attachments: attachmentData.length > 0 ? attachmentData : null,
          page_url: window.location.href,
          metadata,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to submit");
      }

      toast.success("Report submitted successfully. Thank you for your feedback!");
      reset();
      attachments.forEach((a) => URL.revokeObjectURL(a.preview));
      setAttachments([]);
      setAnnotatedScreenshot(null);
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to submit report"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const currentScreenshot = annotatedScreenshot ?? initialScreenshot;

  return (
    <>
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[400px] overflow-y-auto"
        data-report-widget
      >
        <SheetHeader>
          <SheetTitle>Report an Issue</SheetTitle>
          <SheetDescription>
            Help us improve by reporting bugs, missing content, or suggestions.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 pb-6">
          {/* Your Name */}
          <div className="space-y-2">
            <Label>
              Your Name <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("submitter_name")}
              placeholder="e.g. Artyom, Daria, Paolo..."
            />
            {errors.submitter_name && (
              <p className="text-sm text-red-500">{errors.submitter_name.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              value={category}
              onValueChange={(v) => setValue("category", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {BUG_REPORT_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category.message}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label>Priority</Label>
            <Select
              value={priority}
              onValueChange={(v) => setValue("priority", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BUG_REPORT_PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label>
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("title")}
              placeholder="Brief description of the issue..."
              maxLength={120}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              {...register("description")}
              placeholder="Steps to reproduce, expected vs actual behavior..."
              rows={3}
              maxLength={1000}
            />
          </div>

          {/* Screenshot toggle + preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                Include screenshot
              </Label>
              <Switch
                checked={includeScreenshot}
                onCheckedChange={setIncludeScreenshot}
              />
            </div>

            {includeScreenshot && (
              <div className="rounded-md border bg-muted/50 p-2">
                {(annotatedScreenshot || initialScreenshot) ? (
                  <>
                    <img
                      src={annotatedScreenshot ?? initialScreenshot!}
                      alt="Screenshot preview"
                      className="w-full rounded object-cover"
                      style={{ maxHeight: 120 }}
                    />
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      This is the full page screenshot — click Preview to see it in full size, or Annotate to highlight the issue.
                    </p>
                    <div className="flex gap-2 mt-1.5">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setPreviewOpen(true)}
                      >
                        <Eye className="h-3.5 w-3.5 me-1.5" />
                        Preview
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setAnnotatorOpen(true)}
                      >
                        <Pencil className="h-3.5 w-3.5 me-1.5" />
                        Annotate
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col h-16 items-center justify-center text-sm text-muted-foreground">
                    <span>Screenshot not available</span>
                    {captureError && (
                      <span className="text-[10px] text-red-400 mt-1 max-w-full truncate px-2">
                        Error: {captureError}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* File attachments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Attachments
              </Label>
              <span className="text-xs text-muted-foreground">
                {attachments.length}/{MAX_ATTACHMENTS}
              </span>
            </div>

            {/* Thumbnails */}
            {attachments.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {attachments.map((att, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={att.preview}
                      alt={`Attachment ${i + 1}`}
                      className="h-16 w-16 rounded-md border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttachment(i)}
                      className="absolute -top-1.5 -end-1.5 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {attachments.length < MAX_ATTACHMENTS && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Paperclip className="h-3.5 w-3.5 me-1.5" />
                  Add images (max 5MB each)
                </Button>
              </>
            )}
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </form>
      </SheetContent>
    </Sheet>

    {/* Screenshot preview lightbox */}
    {currentScreenshot && (
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-2">
          <DialogTitle className="sr-only">Screenshot Preview</DialogTitle>
          <div className="overflow-auto max-h-[85vh]">
            <img
              src={currentScreenshot}
              alt="Screenshot full view"
              className="w-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    )}

    {/* Screenshot annotator */}
    {currentScreenshot && (
      <ScreenshotAnnotator
        open={annotatorOpen}
        onOpenChange={setAnnotatorOpen}
        screenshotUrl={currentScreenshot}
        onSave={(dataUrl) => {
          setAnnotatedScreenshot(dataUrl);
          setAnnotatorOpen(false);
        }}
      />
    )}
    </>
  );
}
