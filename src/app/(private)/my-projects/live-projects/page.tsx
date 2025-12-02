import LayoutWrapper from "@/components/layout/sidebar";
import MyProjectsDashboard from "@/features/my-projects";
import { MY_PROJECTS } from "@/lib/constants";
import React from "react";

export const metadata = {
  title: "Live Projects",
  description: "Live Projects",
};

const LiveProjects = () => {
  return (
    <LayoutWrapper>
      <MyProjectsDashboard currentPage={MY_PROJECTS.LIVE_PROJECTS_KEY} />
    </LayoutWrapper>
  );
};

export default LiveProjects;
