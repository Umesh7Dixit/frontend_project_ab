import LayoutWrapper from "@/components/layout/sidebar";
import MyProjectsDashboard from "@/features/my-projects";
import { MY_PROJECTS } from "@/lib/constants";

export const metadata = {
  title: "All Projects",
  description: "All Projects",
};

const AllProjects = () => {
  return (
    <LayoutWrapper>
      <MyProjectsDashboard currentPage={MY_PROJECTS.ALL_PROJECTS_KEY} />
    </LayoutWrapper>
  );
};

export default AllProjects;
