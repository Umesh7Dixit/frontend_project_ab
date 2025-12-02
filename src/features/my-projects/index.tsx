"use client";
import React, { useEffect, useState } from "react";
import MyProjectsHeader from "./components/Header";
import {
  ALLProjectsTableColDataVar1,
  ALLProjectsTableColDataVar2,
  formatDate,
  getProjectStats,
  MyProjectProps,
  ProjectApiResponse,
  ProjectRow,
  projectStats,
  ProjectStatsType,
} from "./utils";
import KPICards from "./components/KPICards";
import { MY_PROJECTS } from "@/lib/constants";
import Filters from "./components/Filters";
import axios from "@/lib/axios/axios";
import { userId } from "@/lib/jwt";
import { ProjectTable } from "./ProjectTable";

const MyProjectsDashboard = ({ currentPage }: MyProjectProps) => {
  const [openProjects, setOpenProjects] = useState<ProjectRow[]>([]);
  const [completedProjects, setCompletedProjects] = useState<ProjectRow[]>([]);
  const [stats, setStats] = useState<ProjectStatsType>(projectStats);

  async function fetchData(p_user_id: number, p_view_type: string) {
    try {
      const res = await axios.post("/get_project_portfolio_list", { p_user_id, p_view_type });
      const apiProjects: ProjectApiResponse[] = res.data?.data?.templates ?? [];
      return apiProjects.map(item => ({
        name: item.project_name,
        id: item.project_id,
        created: formatDate(item.date_created),
        activity: formatDate(item.last_activity_date),
        facility_name: item.facility_name,
        org_name: item.organization_name,
        owner: item.owner_name,
        auditor: item.auditor_name,
        role: item.user_role,
        completion: item.completion_percentage,
      })) as ProjectRow[];
    } catch (error) {
      console.error("Error fetching project data:", error);
      return [];
    }
  }

  useEffect(() => {
    if (!userId) {
      console.error("Invalid user token.");
      return;
    }
    getProjectStats(userId).then(setStats);
    fetchData(userId, "Open").then(setOpenProjects);
    fetchData(userId, "Completed").then(setCompletedProjects);
  }, [])

  // TODO: No need to fetch again
  const kpiData = [
    { label: "Total Projects", value: stats.total },
    { label: "On Going Projects", value: stats.onGoing },
    { label: "Completed Projects", value: stats.completed },
    { label: "Owned Projects", value: stats.owned },
    { label: "Shared Projects", value: stats.shared },
  ];
  return (
    <div className="flex flex-col gap-4">
      <MyProjectsHeader currentPage={currentPage} />
      {currentPage === MY_PROJECTS.ALL_PROJECTS_KEY && (
        <>
          <KPICards kpiData={kpiData} />
          <ProjectTable
            columns={ALLProjectsTableColDataVar1}
            title="Open Projects"
            compact={true}
            data={openProjects}

          />
          <ProjectTable
            columns={ALLProjectsTableColDataVar2}
            title="Recently Completed Projects"
            compact={true}
            data={completedProjects}
          />
        </>
      )}

      {currentPage === MY_PROJECTS.COMPLETED_PROJECTS_KEY && (
        <>
          <Filters />
          <ProjectTable
            columns={ALLProjectsTableColDataVar2}
            title="Recently Completed Projects"
            compact={false}
            data={completedProjects}
          />
        </>
      )}

      {currentPage === MY_PROJECTS.LIVE_PROJECTS_KEY && (
        <>
          <Filters />
          <ProjectTable
            columns={ALLProjectsTableColDataVar1}
            title="Recently created projects"
            compact={false}
            data={openProjects}
          />
        </>
      )}
    </div>
  );
};

export default MyProjectsDashboard;
