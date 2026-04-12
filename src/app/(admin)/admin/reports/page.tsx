import { ReportsClient } from "./reports-client";

export const metadata = {
  title: "Bug Reports | Admin",
};

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Bug Reports & Feedback</h1>
        <p className="text-muted-foreground">
          Manage, triage, and resolve user-submitted bug reports and feedback.
        </p>
      </div>
      <ReportsClient />
    </div>
  );
}
