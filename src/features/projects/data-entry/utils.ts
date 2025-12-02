// ---------- Types ----------
export type EntryRow = {
  id: string;
  fuel: string;
  description?: string;
  unit: string;
  values: Record<string, number>; // period values (month/quarter)
};

export type ProjectMock = {
  projectId: number;
  scope: "scope-1" | "scope-2" | "scope-3";
  frequency: "monthly" | "quarterly";
  categories: string[];
  periodLabels: string[];
  entries: EntryRow[];
  meta?: {
    entryCount?: number;
    lastUpdatedAt?: string;
    features?: {
      allowBulkUpload?: boolean;
      allowExport?: boolean;
    };
  };
};

type MonthlyData = {
  quantity: number | null;
};
export type EmissionDataType = {
  project_activity_id: number;
  main_category: string;
  ef?: number;
  ef_source?: string;
  sub_category: string;
  activity: string;
  selection_1: string;
  selection_2: string;
  unit: string;
  subcategory_id?: number;
  monthly_data: Record<string, MonthlyData>;
};


export type DataCollectionFetchParams = {
  p_project_id: number;
  p_scope_name: string;
  p_page_size: number;
  p_page_number: number;
};
// ---------- Helpers ----------
function makeValues(labels: string[]) {
  return Object.fromEntries(labels.map((l) => [l, 0]));
}

export function getCellAnomaly(value: number) {
  if (value >= 120) return "bg-red-200/70 hover:bg-red-200/70";
  if (value >= 80) return "bg-yellow-200/70 hover:bg-yellow-200/70";
  return "";
}

// ---------- Mock Data ----------
export function getMockProjectData(projectId: number): ProjectMock {
  const frequency: ProjectMock["frequency"] = "monthly"; // change to "quarterly" to test
  const monthlyLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const quarterlyLabels = ["Q1", "Q2", "Q3", "Q4"];

  const periodLabels =
    frequency === "monthly" ? monthlyLabels : quarterlyLabels;

  const categories = [
    "Stationary Combustion",
    "Liquid Fuels",
    "Purchased Electricity",
    "Fugitive Emissions",
    "Mobile Combustion",
  ];

  const entries: EntryRow[] = [
    {
      id: "e-1",
      fuel: "Natural Gas",
      description: "Selection 1 > Selection 2",
      unit: "m³",
      values: { ...makeValues(periodLabels), Jan: 120, Feb: 90 },
    },
    {
      id: "e-2",
      fuel: "Diesel",
      description: "Selection 1 > Selection 2",
      unit: "L",
      values: { ...makeValues(periodLabels), Jan: 50, Feb: 60 },
    },
    {
      id: "e-3",
      fuel: "Petrol",
      description: "Selection 1 > Selection 2",
      unit: "L",
      values: { ...makeValues(periodLabels), Jan: 80, Feb: 90 },
    },
  ];

  return {
    projectId,
    scope: "scope-1",
    frequency,
    categories,
    periodLabels,
    entries,
    meta: {
      entryCount: entries.length,
      lastUpdatedAt: new Date().toISOString(),
      features: { allowBulkUpload: true, allowExport: true },
    },
  };
}

export const SUBCATEGORIES: Record<string, string[]> = {
  "Stationary Combustion": ["Submain 1", "Submain 2", "Submain 3"],
  "Liquid Fuels": ["Submain A", "Submain B"],
  "Purchased Electricity": ["Submain X", "Submain Y", "Submain Z"],
  "Fugitive Emissions": ["Submain Alpha", "Submain Beta"],
  "Mobile Combustion": ["Submain P", "Submain Q", "Submain R"],
};
