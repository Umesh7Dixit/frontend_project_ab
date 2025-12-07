import LayoutWrapper from "@/components/layout/sidebar";
import React from "react";
import GHGDashboard from "@/features/projects/ghg-dashboard";

export const metadata = {
  title: "Project Dashboard",
  description: "Project Dashboard",
};

const ProjectDashboard = async () => {

  return (
    <LayoutWrapper>
      <GHGDashboard />
    </LayoutWrapper>
  );
};

export default ProjectDashboard;
