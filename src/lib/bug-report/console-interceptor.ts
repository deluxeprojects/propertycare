const MAX_ERRORS = 10;
let errors: string[] = [];
let initialized = false;

export function initConsoleInterceptor() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const message = args
      .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
      .join(" ");
    errors.push(message.slice(0, 500));
    if (errors.length > MAX_ERRORS) {
      errors = errors.slice(-MAX_ERRORS);
    }
    originalError.apply(console, args);
  };
}

export function getConsoleErrors(): string[] {
  return [...errors];
}
