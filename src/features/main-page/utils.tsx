import {
  CheckCircle2,
  FolderKanban,
  PlayCircle,
  Share2,
  UserCircle,
} from "lucide-react";
import { EmissionDataType } from "../projects/data-entry/utils";
import axios from "@/lib/axios/axios";
import { getProjectId } from "@/lib/jwt";

// ============== Types =================
export interface ProjectOverviewProps {
  id: number;
  name: string;
  downloadUrl: string;
  overallProgress: number;
  owner: string;
  createdAt: string;
  lastActivity: string;
  scopes: { name: string; progress: number }[];
  actionRequired?: string;
  updatedAt?: string;
}


export interface KPIGridProps {
}

export interface ProjectDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    name: string;
    owner: string;
    createdAt: string;
    lastActivity: string;
    overallProgress: number;
    scopes: { name: string; progress: number }[];
  };
}

export interface Comment {
  id: number;
  projectId: number;
  author: string;
  text: string;
  date: string;
}

// ============= Helper ==================
export const StatusText = (progress: number) => {
  if (progress <= 33) {
    return "Uploaded";
  }
  if (progress <= 66) {
    return "Verification In Progress";
  }
  if (progress > 66) {
    return "Verification Completed";
  }
};

export const ActionValue = (action: string) => {
  if (!action) return;
  if (action === "Data Needed") {
    return "Data Needed";
  }
  if (action === "activity") {
    return "Activity";
  }
  if (action === "Clarification needed" || action === "Clarfication needed") {
    return "Clarification Needed";
  }
  if (action === "Review Needed") {
    return "Review Needed";
  }
  if (action === "data required") {
    return "Data Required";
  }
};

// ============= Mock Data ===============
export const ProjectOverviewData: Record<
  "CBAM" | "GHG",
  ProjectOverviewProps[]
> = {
  CBAM: [
    {
      id: 1,
      name: "CBAM Alphaaa",
      downloadUrl: "",
      overallProgress: 100,
      owner: "James Doe",
      createdAt: "2024-08-01",
      lastActivity: "2024-09-05",
      actionRequired: "data-needed",
      updatedAt: "2024-09-05",
      scopes: [
        { name: "Scope 1", progress: 100 },
        { name: "Scope 2", progress: 100 },
        { name: "Scope 3", progress: 100 },
      ],
    },
    {
      id: 2,
      name: "Carbon Beta",
      downloadUrl: "",
      overallProgress: 65,
      owner: "Sarah Lee",
      createdAt: "2024-07-10",
      lastActivity: "2024-09-01",
      actionRequired: "clarification-needed",
      updatedAt: "2024-09-01",
      scopes: [
        { name: "Scope 1", progress: 100 },
        { name: "Scope 2", progress: 100 },
        { name: "Scope 3", progress: 0 },
      ],
    },
    {
      id: 3,
      name: "Border Gamma",
      downloadUrl: "",
      overallProgress: 75,
      owner: "Alex Kim",
      createdAt: "2024-06-18",
      lastActivity: "2024-08-22",
      actionRequired: "review-needed",
      updatedAt: "2024-08-22",
      scopes: [
        { name: "Scope 1", progress: 100 },
        { name: "Scope 2", progress: 100 },
        { name: "Scope 3", progress: 75 },
      ],
    },
    {
      id: 4,
      name: "Adjustment Delta",
      downloadUrl: "",
      overallProgress: 30,
      owner: "Emma Brown",
      createdAt: "2024-05-12",
      lastActivity: "2024-07-30",
      actionRequired: "data-needed",
      updatedAt: "2024-07-30",
      scopes: [
        { name: "Scope 1", progress: 75 },
        { name: "Scope 2", progress: 0 },
        { name: "Scope 3", progress: 0 },
      ],
    },
    {
      id: 5,
      name: "Border Zeta",
      downloadUrl: "",
      overallProgress: 60,
      owner: "Olivia Davis",
      createdAt: "2024-03-05",
      lastActivity: "2024-05-10",
      updatedAt: "2024-05-10",
      scopes: [
        { name: "Scope 1", progress: 100 },
        { name: "Scope 2", progress: 75 },
        { name: "Scope 3", progress: 0 },
      ],
    },
    {
      id: 6,
      name: "Adjustment Theta",
      downloadUrl: "",
      overallProgress: 90,
      owner: "Daniel White",
      createdAt: "2024-02-20",
      lastActivity: "2024-04-25",
      updatedAt: "2024-04-25",
      scopes: [
        { name: "Scope 1", progress: 75 },
        { name: "Scope 2", progress: 75 },
        { name: "Scope 3", progress: 75 },
      ],
    },
  ],
  GHG: [
    {
      id: 1,
      name: "Emission Alpha",
      downloadUrl: "",
      overallProgress: 0,
      owner: "Daniel White",
      createdAt: "2024-08-03",
      lastActivity: "2024-09-02",
      updatedAt: "2024-09-02",
      scopes: [
        { name: "Scope 1", progress: 0 },
        { name: "Scope 2", progress: 0 },
        { name: "Scope 3", progress: 0 },
      ],
    },
    {
      id: 2,
      name: "GHG Beta",
      downloadUrl: "",
      overallProgress: 85,
      owner: "Sophia Green",
      createdAt: "2024-07-15",
      lastActivity: "2024-08-29",
      updatedAt: "2024-08-29",
      scopes: [
        { name: "Scope 1", progress: 100 },
        { name: "Scope 2", progress: 100 },
        { name: "Scope 3", progress: 75 },
      ],
    },
    {
      id: 3,
      name: "Climate Gamma",
      downloadUrl: "",
      overallProgress: 70,
      owner: "John Carter",
      createdAt: "2024-06-22",
      lastActivity: "2024-08-14",
      updatedAt: "2024-08-14",
      scopes: [
        { name: "Scope 1", progress: 100 },
        { name: "Scope 2", progress: 25 },
        { name: "Scope 3", progress: 0 },
      ],
    },
    {
      id: 4,
      name: "Carbon Delta",
      downloadUrl: "",
      overallProgress: 100,
      owner: "Olivia Brown",
      createdAt: "2024-05-20",
      lastActivity: "2024-07-28",
      updatedAt: "2024-07-28",
      scopes: [
        { name: "Scope 1", progress: 100 },
        { name: "Scope 2", progress: 100 },
        { name: "Scope 3", progress: 100 },
      ],
    },
    {
      id: 5,
      name: "GHG Epsilon",
      downloadUrl: "",
      overallProgress: 50,
      owner: "Michael Johnson",
      createdAt: "2024-04-10",
      lastActivity: "2024-06-18",
      updatedAt: "2024-06-18",
      scopes: [
        { name: "Scope 1", progress: 75 },
        { name: "Scope 2", progress: 75 },
        { name: "Scope 3", progress: 75 },
      ],
    },
    {
      id: 6,
      name: "Climate Zeta",
      downloadUrl: "",
      overallProgress: 80,
      owner: "Olivia Davis",
      createdAt: "2024-03-15",
      lastActivity: "2024-05-22",
      updatedAt: "2024-05-22",
      scopes: [
        { name: "Scope 1", progress: 75 },
        { name: "Scope 2", progress: 75 },
        { name: "Scope 3", progress: 75 },
      ],
    },
  ],
};

export const kpiData = {
  CBAM: [
    { label: "Total CBAM Projects", value: "394" },
    { label: "Ongoing Projects", value: "150" },
    { label: "Owned Projects", value: "250" },
    { label: "Completed Projects", value: "130" },
    { label: "Shared Projects", value: "110" },
  ],
  GHG: [
    { label: "Total GHG Projects", value: "287" },
    { label: "Ongoing Projects", value: "95" },
    { label: "Owned Projects", value: "180" },
    { label: "Completed Projects", value: "85" },
    { label: "Shared Projects", value: "75" },
  ],
};

export const KPI_Icons: Record<string, React.ReactNode> = {
  "Total CBAM Projects": <FolderKanban className="text-[#2b5f5d]" />,
  "Total GHG Projects": <FolderKanban className="text-[#2b5f5d]" />,
  "Total ALL Projects": <FolderKanban className="text-[#2b5f5d]" />,
  "Ongoing Projects": <PlayCircle className="text-[#51b575]" />,
  "Owned Projects": <UserCircle className="text-[#2b5f5d]" size={22} />,
  "Completed Projects": <CheckCircle2 className="text-blue-600" size={22} />,
  "Shared Projects": <Share2 className="text-amber-600" size={20} />,
};

export const ProjectComments: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      projectId: 1,
      author: "Emma Brown",
      text: "Need clarification on Scope 2 methodology.",
      date: "2024-09-02",
    },
    {
      id: 2,
      projectId: 1,
      author: "James Doe",
      text: "Uploaded missing transport data for June.",
      date: "2024-08-28",
    },
    {
      id: 3,
      projectId: 1,
      author: "System",
      text: "Last process was completed successfully.",
      date: "2024-08-15",
    },
    {
      id: 4,
      projectId: 1,
      author: "Emma Brown",
      text: "Still waiting for confirmation from the transport team.",
      date: "2024-08-10",
    },
    {
      id: 5,
      projectId: 1,
      author: "James Doe",
      text: "Scope 1 values were approved last month.",
      date: "2024-07-25",
    },
  ],

  2: [
    {
      id: 1,
      projectId: 2,
      author: "Sarah Lee",
      text: "Data for July pending approval.",
      date: "2024-08-25",
    },
    {
      id: 2,
      projectId: 2,
      author: "System",
      text: "Scope 2 clarification completed.",
      date: "2024-08-18",
    },
    {
      id: 3,
      projectId: 2,
      author: "Reviewer",
      text: "Final review scheduled next week.",
      date: "2024-08-10",
    },
  ],

  3: [
    {
      id: 1,
      projectId: 3,
      author: "Alex Kim",
      text: "Can you confirm Scope 1 data source?",
      date: "2024-08-20",
    },
    {
      id: 2,
      projectId: 3,
      author: "System",
      text: "Previous review was accepted.",
      date: "2024-08-05",
    },
    {
      id: 3,
      projectId: 3,
      author: "Auditor",
      text: "Ensure methodology aligns with ISO standards.",
      date: "2024-07-28",
    },
    {
      id: 4,
      projectId: 3,
      author: "Alex Kim",
      text: "Shared updated documentation with methodology details.",
      date: "2024-07-22",
    },
  ],
};

export const buildBatchPayload = (emissionData: EmissionDataType[]) => {
  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };

  const batch: any[] = [];

  emissionData.forEach((row) => {
    if (!row.monthly_data) return;

    Object.entries(row.monthly_data).forEach(([month, obj]: any) => {
      const quantity = obj?.quantity;
      if (!quantity && quantity !== 0) return;

      const clean = month.replace(/\u00A0/g, " ").trim();
      const [mon, yr] = clean.split(" ");
      const year = yr.length === 2 ? `20${yr}` : yr;
      const mm = months[mon];
      if (!mm) return;

      batch.push({
        subcategory_id: row.subcategory_id,
        entry_date: `${year}-${mm}-01`,
        quantity,
      });
    });
  });

  return batch;
};

export const upsertBatch = (userId: number, batch: any[]) => {
  return axios.post("/upsert_activity_data_batch", {
    p_project_id: getProjectId(),
    p_user_id: userId,
    p_data_batch: JSON.stringify(batch),
  });
};

export const transformTemplatesToRows = (templates: any[]) => {
  return templates.map((item) => {
    const row: Record<string, any> = {
      project_activity_id: item.project_activity_id,
      main_category: item.main_category,
      sub_category: item.sub_category,
      activity: item.activity,
      selection_1: item.selection_1,
      selection_2: item.selection_2,
      unit: item.unit,
    };

    const months = item.monthly_data;
    for (const month in months) {
      const safeMonth = month.replace(" ", "\u00A0"); 
      row[safeMonth] = months[month]?.quantity ?? "";
    }

    return row;
  });
};
