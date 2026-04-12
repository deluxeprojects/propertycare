"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
  Search,
  X,
  Bug,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Inbox,
} from "lucide-react";
import {
  BUG_REPORT_STATUSES,
  BUG_REPORT_CATEGORIES,
  BUG_REPORT_PRIORITIES,
  STATUS_COLORS,
  PRIORITY_COLORS,
  CATEGORY_COLORS,
} from "@/types/bug-report";
import type { BugReport } from "@/types/bug-report";
import { ReportDetailPanel } from "./report-detail-panel";
import { ExportButton } from "./export-button";

interface Filters {
  search: string;
  status: string;
  category: string;
  priority: string;
  assignee: string;
  date_from: string;
  date_to: string;
}

interface ListResponse {
  data: BugReport[];
  total: number;
  totalPages: number;
  page: number;
  statusCounts?: Record<string, number>;
}

export function ReportsClient() {
  const [reports, setReports] = useState<BugReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("created_at");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [selected, setSelected] = useState<number[]>([]);
  const [detailReport, setDetailReport] = useState<BugReport | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState("");
  const [bulkLoading, setBulkLoading] = useState(false);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});

  const [filters, setFilters] = useState<Filters>({
    search: "",
    status: "",
    category: "",
    priority: "",
    assignee: "",
    date_from: "",
    date_to: "",
  });

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("sort", sort);
      params.set("order", order);
      if (filters.search) params.set("search", filters.search);
      if (filters.status) params.set("status", filters.status);
      if (filters.category) params.set("category", filters.category);
      if (filters.priority) params.set("priority", filters.priority);
      if (filters.assignee) params.set("assignee", filters.assignee);
      if (filters.date_from) params.set("date_from", filters.date_from);
      if (filters.date_to) params.set("date_to", filters.date_to);

      const res = await fetch(`/api/v1/admin/reports?${params.toString()}`);
      const json: ListResponse = await res.json();
      setReports(json.data);
      setTotal(json.total);
      setTotalPages(json.totalPages);
      if (json.statusCounts) setStatusCounts(json.statusCounts);
    } catch {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  }, [page, sort, order, filters]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleSort = (col: string) => {
    if (sort === col) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSort(col);
      setOrder("desc");
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    if (selected.length === reports.length) {
      setSelected([]);
    } else {
      setSelected(reports.map((r) => r.id));
    }
  };

  const handleBulkUpdate = async () => {
    if (!bulkStatus || selected.length === 0) return;
    setBulkLoading(true);
    try {
      const res = await fetch("/api/v1/admin/reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected, status: bulkStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Updated ${selected.length} report(s)`);
      setSelected([]);
      setBulkStatus("");
      fetchReports();
    } catch {
      toast.error("Failed to update reports");
    } finally {
      setBulkLoading(false);
    }
  };

  const openDetail = (report: BugReport) => {
    setDetailReport(report);
    setDetailOpen(true);
  };

  const handleDetailSaved = () => {
    fetchReports();
  };

  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      category: "",
      priority: "",
      assignee: "",
      date_from: "",
      date_to: "",
    });
    setPage(1);
  };

  const hasFilters = Object.values(filters).some((v) => v !== "");

  const categoryLabel = (val: string) =>
    BUG_REPORT_CATEGORIES.find((c) => c.value === val)?.label || val;
  const statusLabel = (val: string) =>
    BUG_REPORT_STATUSES.find((s) => s.value === val)?.label || val;
  const priorityLabel = (val: string) =>
    BUG_REPORT_PRIORITIES.find((p) => p.value === val)?.label || val;

  const totalReports = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const openCount = (statusCounts["new"] || 0) + (statusCounts["accepted"] || 0);
  const onHoldCount = statusCounts["triaged"] || 0;
  const refusedCount = statusCounts["in_progress"] || 0;
  const resolvedCount = (statusCounts["resolved"] || 0) + (statusCounts["closed"] || 0);
  const closedCount = (statusCounts["wont_fix"] || 0) + (statusCounts["duplicate"] || 0);

  const metrics = [
    { label: "Total", value: totalReports, icon: Bug, color: "text-slate-600", bg: "bg-slate-50" },
    { label: "Open", value: openCount, icon: Inbox, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "On-Hold", value: onHoldCount, icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Resolved", value: resolvedCount, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
    { label: "Refused", value: refusedCount, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Closed", value: closedCount, icon: XCircle, color: "text-slate-500", bg: "bg-slate-50" },
  ];

  return (
    <div className="space-y-4">
      {/* Metric boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m) => (
          <Card key={m.label} className="py-0">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${m.bg} flex items-center justify-center shrink-0`}>
                <m.icon className={`h-4.5 w-4.5 ${m.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{m.value}</p>
                <p className="text-xs text-slate-500">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title, description, email..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={filters.status}
          onValueChange={(v) => updateFilter("status", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {BUG_REPORT_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.category}
          onValueChange={(v) => updateFilter("category", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {BUG_REPORT_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priority}
          onValueChange={(v) => updateFilter("priority", v === "all" ? "" : v)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            {BUG_REPORT_PRIORITIES.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filters.date_from}
          onChange={(e) => updateFilter("date_from", e.target.value)}
          className="w-[150px]"
          placeholder="From date"
        />
        <Input
          type="date"
          value={filters.date_to}
          onChange={(e) => updateFilter("date_to", e.target.value)}
          className="w-[150px]"
          placeholder="To date"
        />

        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}

        <ExportButton filters={{ ...filters }} />
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 rounded-lg border bg-muted/50 p-3">
          <span className="text-sm font-medium">
            {selected.length} selected
          </span>
          <Select value={bulkStatus} onValueChange={setBulkStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Set status..." />
            </SelectTrigger>
            <SelectContent>
              {BUG_REPORT_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={handleBulkUpdate}
            disabled={!bulkStatus || bulkLoading}
          >
            {bulkLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Apply"
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelected([])}
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={
                    reports.length > 0 && selected.length === reports.length
                  }
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("status")}
                >
                  Status <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("priority")}
                >
                  Priority <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("category")}
                >
                  Category <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("title")}
                >
                  Title <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead>Page</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("created_at")}
                >
                  Created <ArrowUpDown className="h-3 w-3" />
                </button>
              </TableHead>
              <TableHead>Assignee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : reports.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-12 text-muted-foreground"
                >
                  No reports found
                </TableCell>
              </TableRow>
            ) : (
              reports.map((report) => (
                <TableRow
                  key={report.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => openDetail(report)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selected.includes(report.id)}
                      onCheckedChange={() => toggleSelect(report.id)}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    #{report.id}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={STATUS_COLORS[report.status] || ""}
                    >
                      {statusLabel(report.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={PRIORITY_COLORS[report.priority] || ""}
                    >
                      {priorityLabel(report.priority)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={CATEGORY_COLORS[report.category] || ""}
                    >
                      {categoryLabel(report.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate font-medium">
                    {report.title}
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.submitter_name || report.submitter_email || "Anonymous"}
                  </TableCell>
                  <TableCell className="max-w-[120px] truncate text-xs text-muted-foreground">
                    {report.page_url
                      ? (() => { try { return new URL(report.page_url).pathname; } catch { return report.page_url; } })()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(report.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {report.assignee || "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} report{total !== 1 ? "s" : ""} total
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page} of {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Detail panel */}
      <ReportDetailPanel
        report={detailReport}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onSaved={handleDetailSaved}
      />
    </div>
  );
}
