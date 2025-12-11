"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, ShieldOff, Clock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DNDBadge } from "@/components/dashboard/dnd-badge";
import { Employee, DNDEntry } from "@/lib/types";
import { getExclusionSummary } from "@/lib/dnd";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ExclusionWarningProps {
  employees: Employee[];
  dndList: DNDEntry[];
  safeHoursBlockedIds: Set<string>;
  className?: string;
}

export function ExclusionWarning({
  employees,
  dndList,
  safeHoursBlockedIds,
  className,
}: ExclusionWarningProps) {
  const [expanded, setExpanded] = useState(false);

  const summary = getExclusionSummary(employees, dndList, safeHoursBlockedIds);

  if (summary.totalExcluded === 0) {
    return null;
  }

  const eligibleCount = employees.length - summary.totalExcluded;

  return (
    <div
      className={cn(
        "rounded-lg border border-amber-200 bg-amber-50 overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <div className="font-medium text-amber-900">
              {summary.totalExcluded} employee{summary.totalExcluded !== 1 ? "s" : ""}{" "}
              will be excluded
            </div>
            <div className="text-sm text-amber-700">
              {eligibleCount} of {employees.length} employees eligible for this
              campaign
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
        >
          {expanded ? (
            <>
              Hide Details
              <ChevronUp className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              View Details
              <ChevronDown className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>

      {/* Expanded Details */}
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-amber-200 space-y-3">
          {/* Breakdown by reason */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {summary.dndCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <ShieldOff className="h-4 w-4 text-amber-600" />
                <span className="text-amber-800">
                  <strong>{summary.dndCount}</strong> on DND list
                </span>
              </div>
            )}
            {summary.safeHoursCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-amber-800">
                  <strong>{summary.safeHoursCount}</strong> outside safe hours
                </span>
              </div>
            )}
          </div>

          {/* DND Reason breakdown */}
          {summary.dndCount > 0 && (
            <div className="flex flex-wrap gap-2">
              {summary.byReason.leave > 0 && (
                <div className="flex items-center gap-1.5">
                  <DNDBadge reason="leave" size="sm" />
                  <span className="text-xs text-amber-700">
                    ({summary.byReason.leave})
                  </span>
                </div>
              )}
              {summary.byReason.sensitive > 0 && (
                <div className="flex items-center gap-1.5">
                  <DNDBadge reason="sensitive" size="sm" />
                  <span className="text-xs text-amber-700">
                    ({summary.byReason.sensitive})
                  </span>
                </div>
              )}
              {summary.byReason.new_hire > 0 && (
                <div className="flex items-center gap-1.5">
                  <DNDBadge reason="new_hire" size="sm" />
                  <span className="text-xs text-amber-700">
                    ({summary.byReason.new_hire})
                  </span>
                </div>
              )}
              {summary.byReason.manual > 0 && (
                <div className="flex items-center gap-1.5">
                  <DNDBadge reason="manual" size="sm" />
                  <span className="text-xs text-amber-700">
                    ({summary.byReason.manual})
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Action links */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href="/dashboard/dnd"
              className="text-sm text-amber-700 hover:text-amber-900 underline"
            >
              Manage DND List
            </Link>
            <Link
              href="/dashboard/settings"
              className="text-sm text-amber-700 hover:text-amber-900 underline"
            >
              Configure Safe Hours
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for inline display
export function ExclusionWarningCompact({
  totalExcluded,
  totalEmployees,
}: {
  totalExcluded: number;
  totalEmployees: number;
}) {
  if (totalExcluded === 0) return null;

  return (
    <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md">
      <Info className="h-4 w-4" />
      <span>
        {totalExcluded} of {totalEmployees} employees will be excluded
      </span>
    </div>
  );
}
