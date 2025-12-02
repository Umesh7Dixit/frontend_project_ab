"use client";

import { useEffect, useState } from "react";
import KPICards from "./components/KPICards";
import RequestHeader from "./components/Header";
import Filters from "./components/Filters";
import DynamicTable from "../my-projects/components/DynamicTable";
import { AllRequestsTableCol } from "./utils";
import axios from "@/lib/axios/axios";
import { userId } from "@/lib/jwt";
import { formatDate } from "../my-projects/utils";

type RequestStats = {
  raised: number;
  pending: number;
  resolved: number;
  you: number;
  team: number;
};

const initialStats: RequestStats = {
  raised: 0,
  pending: 0,
  resolved: 0,
  you: 0,
  team: 0,
};

const RequestsPage = () => {
  const [stats, setStats] = useState<RequestStats>(initialStats);
  const [tableData, setTableData] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  async function fetchRequests(p_user_id: number, p_status_filter: string) {
    try {
      const res = await axios.post("/get_user_project_requests", {
        p_user_id,
        p_status_filter,
      });
      const summary = res.data?.data?.summary;
      const requests = res.data?.data?.requests || [];

      setStats({
        raised: summary.total_related_requests,
        pending: summary.total_open_requests,
        resolved: summary.total_closed_requests,
        you: summary.total_user_requests,
        team: summary.total_team_requests,
      });

      setTableData(
        requests.map((r: any) => ({
          requestId: r.task_id,
          title: r.title,
          dateCreated: formatDate(r.created_at),
          lastActivity: formatDate(r.last_activity),
          projectName: r.project_name,
          projectId: r.task_id,
          createdBy: r.created_by,
          agentName: r.assigned_to,
          role: "Auditor",
          status: r.task_status,
        }))
      );
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  }

  useEffect(() => {
    if (!userId) {
      console.error("Invalid user token.");
      return;
    }
    fetchRequests(userId, statusFilter);
  }, [statusFilter]);
  
  useEffect(() => {
    setTableData(prev => {
      const sorted = [...prev].sort((a, b) => {
        const dateA = new Date(a.lastActivity).getTime();
        const dateB = new Date(b.lastActivity).getTime();
        return sortBy === "newest" ? dateB - dateA : dateA - dateB;
      });
      return sorted;
    });
  }, [sortBy]);

  const kpiData = [
    { label: "Total Requests Raised", value: stats.raised },
    { label: "Pending Requests", value: stats.pending },
    { label: "Resolved Requests", value: stats.resolved },
    { label: "Requests Raised by you", value: stats.you },
    { label: "Requests Raised by team", value: stats.team },
  ];

  return (
    <div className="flex flex-col gap-4">
      <RequestHeader title="All Requests" button={true} />
      <KPICards kpiData={kpiData} />
      <Filters
        status={statusFilter}
        onStatusChange={setStatusFilter}
        sortBy={sortBy}
        count={tableData.length}
        onSortChange={setSortBy}
      />

      <DynamicTable
        title="Requests"
        columns={AllRequestsTableCol}
        data={tableData}
        onDownload={(_row) => { }}
        onRowClick={(row) => `/requests/${row.requestId}`}
      />
    </div>
  );
};

export default RequestsPage;
