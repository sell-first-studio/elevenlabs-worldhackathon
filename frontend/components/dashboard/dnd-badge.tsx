import { DNDReason, DND_REASONS } from "@/lib/types";
import { Palmtree, Heart, Star, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface DNDBadgeProps {
  reason: DNDReason;
  size?: "sm" | "md";
  showLabel?: boolean;
}

const iconMap = {
  leave: Palmtree,
  sensitive: Heart,
  new_hire: Star,
  manual: Shield,
};

const colorMap = {
  leave: "bg-blue-100 text-blue-700 border-blue-200",
  sensitive: "bg-pink-100 text-pink-700 border-pink-200",
  new_hire: "bg-yellow-100 text-yellow-700 border-yellow-200",
  manual: "bg-gray-100 text-gray-700 border-gray-200",
};

export function DNDBadge({ reason, size = "md", showLabel = true }: DNDBadgeProps) {
  const Icon = iconMap[reason];
  const config = DND_REASONS[reason];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        colorMap[reason],
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm"
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} />
      {showLabel && config.label}
    </span>
  );
}

// Compact version for table rows
export function DNDBadgeCompact({ reason }: { reason: DNDReason }) {
  return <DNDBadge reason={reason} size="sm" showLabel={true} />;
}

// Icon-only version for dense displays
export function DNDIcon({ reason, className }: { reason: DNDReason; className?: string }) {
  const Icon = iconMap[reason];
  const config = DND_REASONS[reason];

  return (
    <span title={config.label}>
      <Icon className={cn("h-4 w-4", colorMap[reason].split(" ")[1], className)} />
    </span>
  );
}
