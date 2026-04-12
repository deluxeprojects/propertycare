import type { BugReportMetadata } from "@/types/bug-report";
import { getConsoleErrors } from "./console-interceptor";

function parseBrowser(ua: string): { browser: string; version: string } {
  const browsers: [RegExp, string][] = [
    [/Edg\/([\d.]+)/, "Edge"],
    [/OPR\/([\d.]+)/, "Opera"],
    [/Chrome\/([\d.]+)/, "Chrome"],
    [/Safari\/([\d.]+)/, "Safari"],
    [/Firefox\/([\d.]+)/, "Firefox"],
  ];

  for (const [regex, name] of browsers) {
    const match = ua.match(regex);
    if (match) return { browser: name as string, version: match[1] || "" };
  }
  return { browser: "Unknown", version: "" };
}

function parseOS(ua: string): string {
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac OS")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown";
}

export function collectMetadata(): BugReportMetadata {
  const ua = navigator.userAgent;
  const { browser, version } = parseBrowser(ua);
  const now = new Date();

  let pageLoadTime: number | null = null;
  try {
    const nav = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    if (nav) {
      pageLoadTime = Math.round(nav.loadEventEnd - nav.startTime);
    }
  } catch {
    // Performance API not available
  }

  return {
    viewport: { width: window.innerWidth, height: window.innerHeight },
    screenResolution: {
      width: window.screen.width,
      height: window.screen.height,
    },
    browser,
    browserVersion: version,
    os: parseOS(ua),
    userAgent: ua,
    locale: document.documentElement.lang || "en",
    referrer: document.referrer,
    scrollPosition: { x: window.scrollX, y: window.scrollY },
    pageLoadTime,
    timestampUtc: now.toISOString(),
    timestampLocal: now.toLocaleString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    consoleErrors: getConsoleErrors(),
  };
}
