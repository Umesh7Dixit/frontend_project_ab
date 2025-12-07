import LayoutWrapper from "@/components/layout/sidebar";
import GHGDashboard from "@/features/projects/ghg-dashboard";

export const metadata = {
  title: "GHG Dashboard",
  description: "GHG Dashboard",
};

const GHGDashboardPage = () => {
  return (
    <LayoutWrapper>
      <GHGDashboard main={true} />
    </LayoutWrapper>
  );
};

export default GHGDashboardPage;
