import { Sidebar } from "@/components/dashboard";
import { CampaignProvider } from "@/contexts/campaign-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CampaignProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="pl-64">
          {children}
        </div>
      </div>
    </CampaignProvider>
  );
}
