import LayoutWrapper from "@/components/layout/sidebar";
import CarbonTrackerDashboard from "@/features/carbon-accounting/dashboard/CarbonTrackerDashboard";

export default async function GHGDashboardPage() {

  return (
    <LayoutWrapper>
      <CarbonTrackerDashboard />
    </LayoutWrapper>
  );
}
