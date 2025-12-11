import { OrganizationProfile } from "@clerk/nextjs";
import { DashboardHeader } from "@/components/dashboard/header";

export default function MembersPage() {
  return (
    <>
      <DashboardHeader
        title="Team Members"
        description="Manage organization members, invitations, and verified domains"
      />
      <main className="p-8">
        <OrganizationProfile
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border border-gray-200 rounded-xl",
              navbar: "border-r border-gray-200",
              pageScrollBox: "p-0",
            },
          }}
          routing="hash"
        />
      </main>
    </>
  );
}
