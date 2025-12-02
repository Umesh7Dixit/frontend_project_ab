import LayoutWrapper from "@/components/layout/sidebar";
import DashboardGrid from "@/features/projects/new-project/modules/DashboardGrid";

export const metadata = {
  title: "Select Module",
  description: "Choose a module below to get started",
};

export default function DashboardPage() {
  return (
    <LayoutWrapper>
      <section className="space-y-8">
        <DashboardGrid />
      </section>
    </LayoutWrapper>
  );
}
