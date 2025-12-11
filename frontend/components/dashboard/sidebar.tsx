"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  GraduationCap,
  Gift,
  Settings,
  Shield,
  ShieldOff,
  Users,
} from "lucide-react";

// Base navigation (all members)
const baseNavigation = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Target },
  { name: "Training", href: "/dashboard/training", icon: GraduationCap },
  { name: "Rewards", href: "/dashboard/rewards", icon: Gift },
  { name: "Do Not Disturb", href: "/dashboard/dnd", icon: ShieldOff },
];

// Admin-only navigation
const adminNavigation = [
  { name: "Members", href: "/dashboard/members", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();
  const { organization } = useOrganization();
  const { has } = useAuth();

  // Check permissions for admin items
  const canManageOrg = has?.({ permission: "org:manage" });

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      {/* Logo and Org Name */}
      <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <div className="flex flex-col min-w-0">
          <span className="text-xl font-semibold text-gray-900">VishGuard</span>
          {organization && (
            <span className="text-xs text-gray-500 truncate">
              {organization.name}
            </span>
          )}
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-4">
        {/* Base navigation items */}
        {baseNavigation.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-gray-400")} />
              {item.name}
            </Link>
          );
        })}

        {/* Admin section */}
        {canManageOrg && (
          <>
            <div className="my-2 border-t border-gray-200" />
            <span className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">
              Admin
            </span>
            {adminNavigation.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-gray-400")} />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
      </nav>

      {/* Settings at bottom - only for users with manage permission */}
      {canManageOrg && (
        <div className="absolute bottom-4 left-4 right-4">
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === "/dashboard/settings"
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Settings className={cn("h-5 w-5", pathname === "/dashboard/settings" ? "text-blue-600" : "text-gray-400")} />
            Settings
          </Link>
        </div>
      )}
    </aside>
  );
}
