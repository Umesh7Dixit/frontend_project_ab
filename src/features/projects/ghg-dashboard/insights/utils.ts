export const TAB_ITEMS = [
    { id: 0, label: "Insights" },
    { id: 1, label: "Compare" },
    { id: 2, label: "Decarbonization" },
] as const;

export type TabId = (typeof TAB_ITEMS)[number]["id"];

export const YEAR_OPTIONS = ["2025", "2024", "2023"] as const;
export type Year = (typeof YEAR_OPTIONS)[number];

export const UNIT_OPTIONS = ["All", "tCO2e", "kgCO2e", "MtCO2e"] as const;
export type Unit = (typeof UNIT_OPTIONS)[number];

export type KPIProps = {
    title: string;
    subtitle: string;
    value: string;
    unit: string;
};

export const SCOPE_COLORS = {
  scope1: "#3B82F6", // Blue
  scope2: "#F59E0B", // Amber
  scope3: "#4F46E5", // Amber
  scope3Upstream: "#4F46E5", // Indigo
  scope3Downstream: "#10B981", // Emerald
  total: "#2A5B59", // Dark Green
};


export const KPI_MOCK_DATA: KPIProps[] = [
    { title: "Total", subtitle: "Scope 1, 2 & 3", value: "3,786", unit: "tCO₂e" },
    { title: "Scope 1", subtitle: "", value: "103", unit: "tCO₂e" },
    { title: "Scope 2", subtitle: "", value: "432", unit: "tCO₂e" },
    {
        title: "Scope 3 (Upstream)",
        subtitle: "",
        value: "2,265",
        unit: "tCO₂e",
    },
    {
        title: "Scope 3 (Downstream)",
        subtitle: "",
        value: "985",
        unit: "tCO₂e",
    },
];

export const GHG_BREAKDOWN_MOCK_DATA = [
    { category: "Power", scope: "scope1", value: 439 },
    { category: "Water", scope: "scope1", value: 250 },
    { category: "Steam", scope: "scope1", value: 1200 },
    { category: "", scope: "total", value: 1889 },

    { category: "Goods", scope: "scope2", value: 1200 },
    { category: "Assets", scope: "scope2", value: 900 },
    { category: "Travel", scope: "scope2", value: 750 },
    { category: "Commute", scope: "scope2", value: 5362 },
    { category: "Energy", scope: "scope2", value: 1200 },
    { category: "Waste", scope: "scope2", value: 8571 },
    { category: "", scope: "total", value: 17983 },

    { category: "Fuel", scope: "scope3Upstream", value: 4000 },
    { category: "Leaks", scope: "scope3Upstream", value: 2000 },
    { category: "Fleet", scope: "scope3Upstream", value: 9065 },
    { category: "", scope: "total", value: 15065 },

    { category: "Shipping", scope: "scope3Downstream", value: 7000 },
    { category: "Usage", scope: "scope3Downstream", value: 6000 },
    { category: "Facilities", scope: "scope3Downstream", value: 14231 },
    { category: "", scope: "total", value: 27231 },
];
