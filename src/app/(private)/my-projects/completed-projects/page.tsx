import LayoutWrapper from "@/components/layout/sidebar";
import MyProjectsDashboard from "@/features/my-projects";
import { MY_PROJECTS } from "@/lib/constants";
import React from "react";

export const metadata = {
  title: "Completed Projects",
  description: "Completed Projects",
};

const CompletedProjects = () => {
  return (
    <LayoutWrapper>
      <MyProjectsDashboard currentPage={MY_PROJECTS.COMPLETED_PROJECTS_KEY} />
    </LayoutWrapper>
  );
};

export default CompletedProjects;
