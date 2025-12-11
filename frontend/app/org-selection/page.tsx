"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOrganizationList, useOrganization } from "@clerk/nextjs";
import { OrganizationSwitcher } from "@clerk/nextjs";
import { Shield, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function OrgSelectionPage() {
  const router = useRouter();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { userMemberships, setActive, isLoaded: membershipLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  // Redirect to dashboard if user already has an active org
  useEffect(() => {
    if (orgLoaded && organization) {
      router.push("/dashboard");
    }
  }, [orgLoaded, organization, router]);

  // Auto-select if user has exactly one organization
  useEffect(() => {
    if (membershipLoaded && userMemberships?.data?.length === 1 && !organization && setActive) {
      const orgId = userMemberships.data[0].organization.id;
      setActive({ organization: orgId });
    }
  }, [membershipLoaded, userMemberships, organization, setActive]);

  if (!orgLoaded || !membershipLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  const hasOrgs = userMemberships?.data && userMemberships.data.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle>Select Your Organization</CardTitle>
          <CardDescription>
            Choose an organization to continue to VishGuard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {hasOrgs ? (
            <>
              <OrganizationSwitcher
                hidePersonal
                afterSelectOrganizationUrl="/dashboard"
                afterCreateOrganizationUrl="/dashboard"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    organizationSwitcherTrigger: "w-full justify-between border border-gray-200 rounded-lg px-4 py-3",
                  },
                }}
              />
              <p className="text-sm text-gray-500 text-center">
                Click above to select or accept an organization invitation
              </p>
            </>
          ) : (
            <div className="text-center space-y-4 py-4">
              <Building2 className="h-12 w-12 mx-auto text-gray-300" />
              <div className="space-y-2">
                <p className="text-gray-600">
                  You don&apos;t have access to any organizations yet.
                </p>
                <p className="text-sm text-gray-500">
                  Please contact your administrator to receive an invitation,
                  or sign up with your work email to automatically join your organization.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
