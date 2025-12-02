import axios from "@/lib/axios/axios";

export interface MyProjectProps {
  currentPage: string;
}
export interface ProjectApiResponse {
  project_id: number;
  project_name: string;
  date_created: string;
  last_activity_date: string;
  organization_name: string;
  facility_name: string;
  owner_name: string;
  auditor_name: string;
  status: string;
  user_role: string;
  completion_percentage: number;
  can_download_report: boolean;
}
export type ProjectStatsType = {
  total: number;
  onGoing: number;
  completed: number;
  owned: number;
  shared: number;
};
export type APIResponse = {
  owned_projects: number;
  shared_projects: number;
  total_projects: number;
  open_projects: number;
  completed_projects: number;
};
export const projectStats: ProjectStatsType = {
  total: 0,
  onGoing: 0,
  completed: 0,
  owned: 0,
  shared: 0,
};
export interface ProjectRow {
  id: number;
  name: string;
  created: string;
  activity: string;
  facility_name: string;
  org_name: string;
  owner: string;
  auditor: string;
  role: string;
  completion: number;
}
export type Column = {
  key: string;
  label: string;
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
  icon?: boolean;
};
export type DynamicTableProps = {
  title?: string;
  columns: Column[];
  compact?: boolean;
  sortKey?: string;
  data: Record<string, any>[];
  onRowClick?: (row: Record<string, any>) => string | void;
  onDownload?: (row: Record<string, any>) => void;
};

export const getStatusBadgeStyles = (status: string) => {
  const s = String(status).toLowerCase();

  if (["completed", "success", "approved", "active", "paid"].includes(s))
    return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100";

  if (["pending", "processing", "in_progress", "waiting"].includes(s))
    return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";

  if (["failed", "rejected", "error", "canceled"].includes(s))
    return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";

  if (["warning", "hold", "review"].includes(s))
    return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100";

  return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200";
};
export const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toISOString().split("T")[0];
};

// Mock data
export const ALLProjectsTableColDataVar1 = [
  { key: "name", label: "Name" },
  { key: "id", label: "Project ID" },
  { key: "created", label: "Date created" },
  { key: "activity", label: "Last activity" },
  { key: "facility_name", label: "Facility name" },
  { key: "org_name", label: "Organization name" },
  { key: "owner", label: "Owner" },
  { key: "auditor", label: "Main auditor" },
  { key: "role", label: "Role" },
  { key: "completion", label: "Completion (%)" },
];

export const ALLProjectsTableColDataVar2 = [
  { key: "name", label: "Name" },
  { key: "id", label: "Project ID" },
  { key: "created", label: "Date created" },
  { key: "activity", label: "Last activity" },
  { key: "facility_name", label: "Facility name" },
  { key: "org_name", label: "Organization name" },
  { key: "owner", label: "Owner" },
  { key: "auditor", label: "Main auditor" },
  { key: "role", label: "Role" },
  { key: "report", label: "Download Report", icon: true },
];

export const TableRowDataVar1 = [
  {
    name: "Loft Insulation",
    id: "P1",
    created: "2024-01-02",
    activity: "2024-01-15",
    category: "Energy",
    unit: "Unit 1",
    owner: "John",
    auditor: "Jane",
    role: "Manager",
    completion: 80,
  },
  {
    name: "Floor Insulation",
    id: "P2",
    created: "2024-02-03",
    activity: "2024-02-10",
    category: "Energy",
    unit: "Unit 2",
    owner: "Jane",
    auditor: "John",
    role: "Auditor",
    completion: 60,
  },
  {
    name: "Roof Insulation",
    id: "P3",
    created: "2024-03-05",
    activity: "2024-03-12",
    category: "Energy",
    unit: "Unit 3",
    owner: "John",
    auditor: "Jane",
    role: "Manager",
    completion: 90,
  },
  {
    name: "Wall Insulation",
    id: "P4",
    created: "2024-04-07",
    activity: "2024-04-15",
    category: "Energy",
    unit: "Unit 4",
    owner: "Jane",
    auditor: "John",
    role: "Auditor",
    completion: 70,
  },
  {
    name: "Ceiling Insulation",
    id: "P5",
    created: "2024-05-09",
    activity: "2024-05-17",
    category: "Energy",
    unit: "Unit 5",
    owner: "John",
    auditor: "Jane",
    role: "Manager",
    completion: 85,
  },
];

export const TableRowDataVar2 = TableRowDataVar1.map((row) => ({
  ...row,
  report: true,
}));

export async function getProjectStats(p_user_id: number) {
  try {
    const res = await axios.post("/project/get_project_portfolio_stats", {
      p_user_id,
    });
    const data: APIResponse = res.data?.data?.stats;
    return {
      total: data.total_projects,
      onGoing: data.open_projects,
      completed: data.completed_projects,
      owned: data.owned_projects,
      shared: data.shared_projects,
    };
  } catch (err) {
    console.error("Error fetching request stats:", err);
    throw err;
  }
}