"use client";

import { useState, useCallback, lazy, Suspense, useEffect } from "react";
import { Bug } from "lucide-react";
import { initConsoleInterceptor } from "@/lib/bug-report/console-interceptor";

const ReportPanel = lazy(() =>
  import("./report-panel").then((m) => ({ default: m.ReportPanel }))
);

/**
 * Check if a URL is cross-origin relative to the current page.
 */
function isCrossOrigin(src: string): boolean {
  if (!src) return false;
  if (src.startsWith("data:") || src.startsWith("blob:")) return false;
  try {
    const url = new URL(src, window.location.origin);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Sanitize the DOM for screenshot capture:
 * - Hide cross-origin <img> elements (replace with grey placeholder)
 * - Neutralize cross-origin CSS background-image
 * Returns a restore function.
 */
function sanitizeDomForCapture(): () => void {
  const hiddenImgs: { img: HTMLImageElement; display: string; placeholder: HTMLDivElement }[] = [];
  const hiddenBgs: { el: HTMLElement; bg: string }[] = [];

  // 1. Hide cross-origin <img> elements
  document.querySelectorAll("img").forEach((img) => {
    const src = img.src || img.currentSrc;
    if (!isCrossOrigin(src)) return;

    const rect = img.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const placeholder = document.createElement("div");
    placeholder.style.cssText = `width:${rect.width}px;height:${rect.height}px;background:#e2e8f0;display:inline-block;border-radius:${window.getComputedStyle(img).borderRadius}`;

    const originalDisplay = img.style.display;
    img.style.display = "none";
    img.parentNode?.insertBefore(placeholder, img);

    hiddenImgs.push({ img, display: originalDisplay, placeholder });
  });

  // 2. Neutralize cross-origin CSS background-image on visible elements
  document.querySelectorAll("[style*='background'], [class]").forEach((el) => {
    const htmlEl = el as HTMLElement;
    const rect = htmlEl.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    if (rect.width === 0 || rect.height === 0) return;

    const bg = window.getComputedStyle(htmlEl).backgroundImage;
    if (!bg || bg === "none") return;
    const urlMatch = bg.match(/url\(["']?(https?:\/\/.*?)["']?\)/);
    if (urlMatch && urlMatch[1] && isCrossOrigin(urlMatch[1])) {
      hiddenBgs.push({ el: htmlEl, bg: htmlEl.style.backgroundImage });
      htmlEl.style.backgroundImage = "none";
    }
  });

  return () => {
    for (const { img, display, placeholder } of hiddenImgs) {
      img.style.display = display;
      placeholder.remove();
    }
    for (const { el, bg } of hiddenBgs) {
      el.style.backgroundImage = bg;
    }
  };
}

/**
 * Capture a screenshot using html-to-image (SVG foreignObject approach).
 * Unlike html2canvas, this lets the browser render CSS natively,
 * so modern color functions like lab() and oklch() work.
 */
async function captureScreenshot(): Promise<{ dataUrl: string | null; error: string | null }> {
  let restore: (() => void) | null = null;

  try {
    // Sanitize cross-origin content
    restore = sanitizeDomForCapture();

    // Dynamic import to keep the bundle small
    const { toPng } = await import("html-to-image");

    // Race against a timeout
    const capturePromise = toPng(document.body, {
      pixelRatio: 0.5,
      quality: 0.8,
      skipFonts: true, // Skip font embedding for speed
      filter: (node: HTMLElement) => {
        if (!node.tagName) return true; // text nodes, etc.
        // Skip the report widget button
        if (node.hasAttribute?.("data-report-widget")) return false;
        // Skip iframes (Google Maps, embeds — cross-origin)
        const tag = node.tagName;
        if (tag === "IFRAME" || tag === "CANVAS" || tag === "VIDEO" || tag === "OBJECT" || tag === "EMBED") return false;
        // Skip noscript/script
        if (tag === "NOSCRIPT" || tag === "SCRIPT") return false;
        return true;
      },
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Capture timed out after 15s")), 15000)
    );

    const dataUrl = await Promise.race([capturePromise, timeoutPromise]);

    if (!dataUrl || dataUrl.length < 100) {
      return { dataUrl: null, error: `Capture returned ${dataUrl?.length || 0} chars` };
    }

    return { dataUrl, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { dataUrl: null, error: msg };
  } finally {
    if (restore) restore();
  }
}

export function ReportWidget() {
  const [open, setOpen] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    initConsoleInterceptor();
  }, []);

  const handleClick = useCallback(async () => {
    setCapturing(true);

    const { dataUrl, error } = await captureScreenshot();

    setScreenshot(dataUrl);
    setCaptureError(error);
    setCapturing(false);
    setOpen(true);
  }, []);

  const handleClose = useCallback((value: boolean) => {
    setOpen(value);
    if (!value) {
      setScreenshot(null);
      setCaptureError(null);
    }
  }, []);

  return (
    <>
      <button
        data-report-widget
        onClick={handleClick}
        disabled={capturing}
        className="fixed end-6 bottom-[88px] z-50 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg transition-all duration-300 hover:bg-slate-700 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-70"
        aria-label="Report a bug or give feedback"
      >
        {capturing ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <Bug className="h-5 w-5" />
        )}
      </button>

      {open && (
        <Suspense fallback={null}>
          <ReportPanel
            open={open}
            onOpenChange={handleClose}
            initialScreenshot={screenshot}
            captureError={captureError}
          />
        </Suspense>
      )}
    </>
  );
}
