"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";

interface ExportButtonProps {
  filters: { [key: string]: string };
}

export function ExportButton({ filters }: ExportButtonProps) {
  const buildUrl = (format: string) => {
    const params = new URLSearchParams();
    params.set("format", format);
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value);
    }
    return `/api/v1/admin/reports/export?${params.toString()}`;
  };

  const handleExport = (format: string) => {
    window.open(buildUrl(format), "_blank");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")}>
          Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>
          Export JSON (Claude Code)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
