// ============ Types =================
export type CategoryNode = {
  id: number;
  name: string;
  children?: any;
  requiresForm?: boolean;
};

export type SubTab = {
  id: string;
  label: string;
  key?: string;
};

// ============ Helpers =================
// flatten tree → array
export function flattenNodes(nodes: CategoryNode[]): CategoryNode[] {
  const list: CategoryNode[] = [];
  const walk = (arr: CategoryNode[]) => {
    arr.forEach((n) => {
      list.push(n);
      if (n.children) walk(n.children);
    });
  };
  walk(nodes);
  return list;
}

// find a node by id
export function findNodeById(
  nodes: CategoryNode[],
  id: number
): CategoryNode | undefined {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNodeById(n.children, id);
      if (found) return found;
    }
  }
}

// ============ Utils =================
export const toggleSelect = (id: number, setSelectedIds: any) => {
  setSelectedIds((prev: Set<number>) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  });
};

export const removeSelected = (id: number, setSelectedIds: any) => {
  setSelectedIds((prev: Set<number>) => {
    const next = new Set(prev);
    next.delete(id);
    return next;
  });
};

export function filterNodes(
  nodes: CategoryNode[],
  query: string
): CategoryNode[] {
  if (!query.trim()) return nodes;
  return nodes
    .map((node) => {
      if (
        (node.name || (node as any).category || "")
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        (node.children && filterNodes(node.children, query).length > 0)
      ) {
        return {
          ...node,
          children: node.children ? filterNodes(node.children, query) : [],
        };
      }
      return null;
    })
    .filter(Boolean) as CategoryNode[];
}

// Generic label resolver for dynamic trees
export function getNodeLabel(node: any): string {
  return (node?.name ?? node?.category ?? "").toString();
}

// =========== Mock Data ================
export const dataCollectionNodes: CategoryNode[] = [
  {
    id: 1,
    name: "Scope 1 - Direct Emissions",
    children: [
      { id: 11, category: "Agriculture" },
      { id: 12, category: "Energy" },
    ],
  },
  {
    id: 2,
    name: "Scope 2 - Indirect Emissions",
    children: [
      { id: 21, category: "Purchased Electricity" },
      { id: 22, category: "Purchased Steam" },
    ],
  },
  {
    id: 3,
    name: "Scope 3 - Upstream Activities",
    children: [
      { id: 31, category: "Purchased Goods and Services" },
      { id: 32, category: "Capital Goods" },
    ],
  },
];

// ========= Mock SubTabs ==========
export const scopeSubTabs: Record<ScopeKey, SubTab[]> = {
  scope1: [
    { id: "tab1", label: "Fuels" },
    { id: "tab2", label: "Processes" },
    { id: "tab3", label: "Transport" },
  ],
  scope2: [
    { id: "tab1", label: "Electricity" },
    { id: "tab2", label: "Steam / Heat" },
  ],
  scope3: [
    { id: "tab1", label: "Purchased Goods", key: "scope3-tab1" },
    { id: "tab2", label: "Capital Goods", key: "scope3-tab2" },
    { id: "tab3", label: "Employee Travel", key: "scope3-tab3" },
  ],
};

export const scope3SubTabs = {
  "scope3-tab1": [
    { id: "tab1", label: "Materials Used" },
    { id: "tab2", label: "Spare parts" },
  ],
  "scope3-tab2": [],
  "scope3-tab3": [
    { id: "tab1", label: "WTT Fuel" },
    { id: "tab2", label: "WTT Electricity" },
    { id: "tab3", label: "WTT Heat & Steam" },
    { id: "tab4", label: "WTT Bio-energy" },
  ],
};

export type ScopeKey = "scope1" | "scope2" | "scope3";

export const scopeTrees: Record<string, CategoryNode[]> = {
  // ============ Scope 1 ============
  "scope1-tab1": [
    {
      id: 101,
      name: "Gaseous Fuels",
      children: [
        {
          id: 1011,
          category: "Butane",
          children: [
            { id: 10111, name: "Butane-1" },
            { id: 10112, name: "Butane-2" },
          ],
        },
        { id: 1012, category: "CNG" },
        { id: 1014, category: "LPG" },
      ],
    },
    {
      id: 102,
      name: "Liquid Fuels",
      children: [
        { id: 1021, category: "Aviation Spirit" },
        { id: 1022, category: "Aviation Turbine Fuel" },
        { id: 1023, category: "Petrol" },
        {
          id: 1024,
          category: "Station Fuel",
          children: [
            { id: 10241, name: "Diesel" },
            { id: 10242, name: "Petrol" },
            { id: 10243, name: "CNG" },
          ],
        },
      ],
    },
    {
      id: 103,
      name: "Solid Fuels",
      children: [
        { id: 1031, category: "Coal" },
        { id: 1032, category: "Coke" },
      ],
    },
  ],
  "scope1-tab2": [
    {
      id: 201,
      name: "Industrial Processes",
      children: [
        { id: 2011, category: "Cement Production" },
        { id: 2012, category: "Steel Manufacturing" },
      ],
    },
  ],
  "scope1-tab3": [
    {
      id: 301,
      name: "Company Vehicles",
      children: [
        { id: 3011, category: "Diesel Cars" },
        { id: 3012, category: "Petrol Cars" },
      ],
    },
  ],

  // ============ Scope 2 ============
  "scope2-tab1": [
    {
      id: 401,
      name: "Purchased Electricity",
      children: [
        { id: 4011, category: "Grid Electricity" },
        { id: 4012, category: "Renewable Electricity" },
      ],
    },
  ],
  "scope2-tab2": [
    {
      id: 501,
      name: "Purchased Steam",
      children: [
        { id: 5011, category: "District Heating" },
        { id: 5012, category: "Industrial Steam" },
      ],
    },
  ],

  // ============ Scope 3 ============
  "scope3-tab1": [
    {
      id: 601,
      name: "Materials Used",
      children: [
        {
          id: 6011,
          category: "Metals",
          children: [{ id: 60111, name: "Copper", requiresForm: true }],
        },
        { id: 6012, category: "Plastics" },
        {
          id: 6013,
          category: "Chemicals",
          children: [
            { id: 60131, name: "Acids", requiresForm: true },
            { id: 60132, name: "Solvents" },
          ],
        },
      ],
    },
    {
      id: 602,
      name: "Spare Parts",
      children: [
        { id: 6021, category: "Engines" },
        { id: 6022, category: "Electrical Components" },
      ],
    },
  ],

  // ====== scope3-tab2 (direct tree) ======
  "scope3-tab2": [
    {
      id: 701,
      name: "Capital Goods",
      children: [
        { id: 7011, category: "Machinery" },
        { id: 7012, category: "Buildings" },
      ],
    },
  ],

  // ====== scope3-tab3 ======
  "scope3-tab3": [
    {
      id: 801,
      name: "WTT Fuel",
      children: [
        { id: 8011, category: "Petrol", requiresForm: true },
        { id: 8012, category: "Diesel" },
      ],
    },
    {
      id: 802,
      name: "WTT Electricity",
      children: [
        { id: 8021, category: "Coal-based" },
        { id: 8022, category: "Solar" },
      ],
    },
    {
      id: 803,
      name: "WTT Heat & Steam",
      children: [
        { id: 8031, category: "District Heating" },
        { id: 8032, category: "Industrial Steam" },
      ],
    },
    {
      id: 804,
      name: "WTT Bio-energy",
      children: [
        { id: 8041, category: "Biogas", requiresForm: true },
        { id: 8042, category: "Biodiesel" },
      ],
    },
  ],
};
