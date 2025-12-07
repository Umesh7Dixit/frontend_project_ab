import LayoutWrapper from "@/components/layout/sidebar";
import GHGDashboard from "@/features/projects/ghg-dashboard";

export const metadata = {
  title: "GHG Dashboard",
  description: "GHG Dashboard",
};

const GHGDashboardPage = () => {
  // const mainDashboard
  return (
    <LayoutWrapper>
      <GHGDashboard />
    </LayoutWrapper>
  );
};

export default GHGDashboardPage;
