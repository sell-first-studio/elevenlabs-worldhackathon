"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function UserAvatar() {
  try {
    const { isLoaded, isSignedIn } = useAuth();
    if (isLoaded && isSignedIn) {
      return (
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-9 w-9"
            }
          }}
        />
      );
    }
  } catch {
    // Clerk not initialized
  }

  // Fallback avatar when Clerk is not available
  return (
    <Avatar className="h-9 w-9">
      <AvatarFallback className="bg-gray-100">
        <User className="h-5 w-5 text-gray-500" />
      </AvatarFallback>
    </Avatar>
  );
}

export function DashboardHeader({ title, description, action }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-8">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="text-sm text-gray-500">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        {action}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-500" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <UserAvatar />
      </div>
    </header>
  );
}
