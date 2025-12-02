// ============== Types ===================
export interface PreviewPageProps {
  templateID: number;
}
export interface RowData {
  id: number;
  frequency: string;
  unit: string;
  main_category: string;
  subcategory_id?: number | null;
  main_category_id?: number | null;
  sub_category: string;
  activity: string;
  selection_1: string;
  main_category_label?: string;
  selection_2: string;
  ef: string;
  efSource: string;
  scope?: string;
}

export interface EditableRowProps {
  row: RowData;
  setInfoDrawerOpen: (open: boolean) => void;
  setSelectedRow: (row: RowData) => void;
  setDeleteModalOpen: (open: boolean) => void;
  onUpdateRow?: (id: number, updated: any) => void;
  selectedRowIds: (string | number)[];
  setSelectedRowIds: React.Dispatch<React.SetStateAction<(string | number)[]>>;
  mode: "edit" | "preview";
}

export interface DropdownOption {
  label: string;
  unit_name?: string;
  unit_id?: number;
  value: any;
}


export interface PreviewFooterProps {
  onEditUse?: () => void;
  mode: string;
  currentScopeIndex: number;
  selectedScopes: number[];
  setCurrentScopeIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedRowIds: (string | number)[];
  templateID: number;
  currentPage: number;
  totalPages: number;
  onDuplicate?: () => void;
  goToPage: (page: number) => void;
}

export interface PreviewInfoDrawerProps {
  open: boolean;
  onClose: () => void;
  data: {
    activity: string;
    section: string;
    unit: string;
    main_category: string;
    sub_category: string;
    ef: string;
    efSource: string;
  } | null;
}

export interface PreviewTableProps {
  setInfoDrawerOpen: (open: boolean) => void;
  setSelectedRow: (row: any) => void;
  setDeleteModalOpen: (open: boolean) => void;
  onUpdateRow?: (row: any) => void;
  selectedRowIds: (string | number)[];
  setSelectedRowIds: React.Dispatch<React.SetStateAction<(string | number)[]>>;
  mode: "edit" | "preview";
  filteredRows: RowData[];
}

// ============== Dropdown Options ===================
export const frequencyOptions: DropdownOption[] = [
  { label: "Monthly", value: "Monthly" },
  { label: "Quarterly", value: "Quarterly" },
];

// ============== Column Names ===================
export const previewTableColumns = [
  { key: "checkbox", label: "" },
  { key: "info", label: "Info", align: "center" },
  { key: "activity", label: "Activity" },
  { key: "selection1", label: "Selection 1" },
  { key: "selection2", label: "Selection 2" },
  { key: "frequency", label: "Monthly/Quarterly" },
  { key: "unit", label: "Unit" },
  { key: "category", label: "Category" },
  { key: "subCategory", label: "Sub Category" },
  { key: "ef", label: "EF" },
  { key: "efSource", label: "EF Source" },
  { key: "actions", label: "Actions" },
];

// ============== Helper Class ====================
export const headerCellClass =
  "sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm font-semibold px-4 py-3 text-xs";

// =============== Table Dropdown Items ==============
export const Units = ["Liters", "kWh", "kWh/m2", "kWh/m2a"];
export const Frequency = ["Monthly", "Quarterly"];
export const Categories = ["Energy", "Transport", "Waste"];
export const SubCategories = ["Diesel", "Electricity", "Gas"];
export const EFSource = ["GHG Protocol", "DEFRA"];
export const Activity = [
  "Fuel Combustion",
  "Electricity Usage",
  "Purchased Electricity",
];
export const Sections = ["Selection 1", "Selection 2", "Selection 3"];

// ================= Mock Data ===================
export const previewTableRows = [
  {
    activity: "Fuel Combustion",
    selection1: "Selection 1",
    selection2: "Selection 2",
    frequency: "Monthly",
    unit: "Liters",
    category: "Energy",
    subCategory: "Diesel",
    ef: "2.68",
    efSource: "IPCC 2006",
    id: 1,
  },
  {
    activity: "Electricity Usage",
    selection1: "Selection 2",
    selection2: "Selection 2",
    frequency: "Quarterly",
    unit: "kWh",
    category: "Energy",
    subCategory: "Electricity",
    ef: "0.92",
    efSource: "EPA 2021",
    id: 2,
  },
  {
    activity: "Purchased Electricity",
    selection1: "Selection 3",
    selection2: "Selection 2",
    frequency: "Monthly",
    unit: "kWh",
    category: "Energy",
    subCategory: "Electricity",
    ef: "0.92",
    efSource: "EPA 2021",
    id: 3,
  },
];
