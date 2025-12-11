"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function Providers({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // If no valid Clerk key, render children without auth
  if (!publishableKey || publishableKey.startsWith('pk_test_placeholder')) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={publishableKey}
      afterSignInUrl="/org-selection"
      afterSignUpUrl="/org-selection"
    >
      {children}
    </ClerkProvider>
  );
}
