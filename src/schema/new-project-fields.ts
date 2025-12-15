import * as z from "zod";
// import type { FormSchema } from "./new-project-fields";

export type FieldType =
  | "input"
  | "select"
  | "textarea"
  | "phone"
  | "email"
  | "userSearch"
  | "reportingPeriodFrom"
  | "reportingPeriodTo"
  | "table"
  | "date";

export type FieldOption = {
  label: string;
  value: string;
};

// export type TableColumn = {
//   label: string;
//   key: string;
//   // inputType?: "text" | "number" | "readonly";
//   inputType?: "text" | "number" | "readonly" | "select";
//   options?: Array<{ label: string; value: string }>;
// };

export interface TableColumn {
  label: string;
  key: string;
  inputType?: "text" | "number" | "readonly" | "select";
  options?: Array<{ label: string; value: string }>;
}

export type Field =
  | {
      name: keyof FormSchema;
      label: string;
      placeholder?: string;
      type: Exclude<FieldType, "table"> | "diagram";
      options?: FieldOption[];
      cols?: number;
      helper?: string;
      readOnly?: boolean;
    }
  | {
      name: keyof FormSchema;
      label: string;
      type: "table";
      cols?: number;
      placeholder?: string;
      helper?: string;
      columns: TableColumn[];
      rows?: (string | Record<string, unknown>)[];
    };

export type Section = {
  id: string;
  title: string;
  subtitle?: string;
  fields: Field[];
};

/**
 * Zod schema for the whole form based on the old JSX fields
 * (keeps fields optional so you can decide required fields later)
 */
export const formSchema = z.object({
  // Basic Details
  industry: z.string().min(1, "Please select an industry"),
  orgName: z.string().min(1, "Organization name is required"),
  facility: z.string().min(1, "Facility name is required"),
  facilityId: z.string().min(1, "Facility ID is required"),
  projectName: z.string(),
  projectDescription: z.string(),

  // Base Year Recalculation / Methodology Section
  baseYearRecalculationPolicy: z
    .string()
    .min(10, "Please provide a detailed description (min 10 characters)")
    .optional(),
  recalculationContext: z.string().optional(),
  methodologiesUsed: z.string().optional(),
  methodologyReferences: z.string().optional(),
  facilitiesExcluded: z.string().optional(),
  contractualProvisionInfo: z.string().optional(),
  externalAssurance: z.string().optional(),
  inventoryQuality: z.string().optional(),
  ghgSequestration: z.string().optional(),

  // Ownership & Scope
  responsible: z.string().min(1, "Responsible party is required"),
  user: z.string().min(1, "Intended user is required"),
  use: z
    .string()
    .min(10, "Please provide a detailed description (min 10 characters)"),
  boundary: z
    .enum(["operational", "financial", "equity"] as const)
    .refine((val) => !!val, { message: "Please select a boundary type" }),

  // Reporting & Permissions
  protocol: z.enum(["ghg", "iso", "custom"] as const),
  reportingDateFrom: z.string().min(1, "Start date is required"),
  reportingDateTo: z.string().min(1, "End date is required"),
  baseYear: z
    .string()
    .min(4, "Please enter a valid 4-digit year")
    .max(4, "Please enter a valid 4-digit year")
    .refine((val) => !isNaN(Number(val)), "Year must be a number"),
  accessGivenUsers: z
    .string()
    .min(1, "Please specify access for at least one user"),

  // Base Year Emissions (TABLE)
  baseYearEmissions: z
    .array(
      z.object({
        scope: z.string().optional(),
        total: z.string().optional(),
        co2: z.string().optional(),
        ch4: z.string().optional(),
        n2o: z.string().optional(),
        hfcs: z.string().optional(),
        pfcs: z.string().optional(),
        sf6: z.string().optional(),
      })
    )
    .optional(),

  // Organizational Boundaries (TABLE)
  organizationalBoundaries: z
    .array(
      z.object({
        entity: z.string().optional(),
        equityShare: z.string().optional(),
        financialControl: z.string().optional(),
        operationalControl: z.string().optional(),
      })
    )
    .optional(),

  // Organizational Diagram field (uploads / description)
  organizationalDiagram: z.string().optional(),
});

/** Type for the form (inferred from schema) */
export type FormSchema = z.infer<typeof formSchema>;

/**
 * Sections & fields replaced with the exact fields from your old JSX
 */
export const sections: Section[] = [
  {
    id: "basic",
    title: "Basic Details",
    subtitle: "Basic details from old Basic Details component",
    fields: [
      {
        name: "industry",
        label: "Industry",
        placeholder: "Select industry",
        type: "select",
        options: [
          { label: "Manufacturing & Heavy Industry", value: "manufacturing" },
          { label: "Energy & Utilities", value: "energy" },
          { label: "Transportation & Logistics", value: "transport" },
          { label: "Construction & Real Estate", value: "construction" },
          { label: "Retail & Consumer Goods", value: "retail" },
          { label: "Mining & Metals", value: "mining" },
          { label: "Agriculture & Food Processing", value: "agriculture" },
          { label: "Finance & Banking", value: "finance" },
          { label: "Healthcare & Pharma", value: "healthcare" },
          { label: "IT & Telecom", value: "it" },
        ],
        cols: 1,
      },
      {
        name: "orgName",
        label: "Organization Name",
        placeholder: "Organization name",
        type: "input",
        readOnly: true,
        cols: 1,
      },
      {
        name: "facility",
        label: "Facility",
        placeholder: "Enter facility name",
        type: "input",
        readOnly: true,
        cols: 1,
      },
      {
        name: "facilityId",
        label: "Facility ID",
        placeholder: "Enter facility ID",
        type: "input",
        readOnly: true,
        cols: 1,
      },
      {
        name: "projectName",
        label: "Project Name",
        placeholder: "Enter Project Name",
        type: "input",
        cols: 1,
      },
      {
        name: "projectDescription",
        label: "Project Description",
        placeholder: "Enter Project Description",
        type: "input",
        cols: 1,
      },
    ],
  },
  {
    id: "ownershipScope",
    title: "Ownership & Scope",
    subtitle: "Fields from Ownership Scope component",
    fields: [
      {
        name: "responsible",
        label: "Responsible Party",
        placeholder: "Enter responsible person/party",
        type: "input",
        cols: 1,
      },
      {
        name: "user",
        label: "Intended User",
        placeholder: "Enter intended user",
        type: "input",
        cols: 1,
      },
      {
        name: "use",
        label: "Intended Use of Inventory",
        placeholder: "Describe the intended use of inventory...",
        type: "textarea",
        cols: 1,
      },
      {
        name: "boundary",
        label: "Organizational Boundary",
        placeholder: "Select boundary",
        type: "select",
        options: [
          { label: "Operational Control", value: "operational" },
          { label: "Financial Control", value: "financial" },
          { label: "Equity Share", value: "equity" },
        ],
        cols: 1,
      },
    ],
  },
  {
    id: "emissionsReporting",
    title: "Emissions Reporting",
    subtitle: "Fields for Emissions Reporting & Additional Information",
    fields: [
      {
        name: "baseYearRecalculationPolicy",
        label: "Policy for Base Year Recalculation",
        placeholder: "Describe policy for recalculating base year emissions...",
        type: "textarea",
        cols: 1,
      },
      {
        name: "recalculationContext",
        label: "Context for Significant Emissions Changes",
        placeholder: "Provide context for changes triggering recalculation...",
        type: "textarea",
        cols: 1,
      },
      {
        name: "methodologiesUsed",
        label: "Methodologies Used (Non-GHG Protocol)",
        placeholder: "Describe methodologies other than GHG Protocol...",
        type: "textarea",
        cols: 1,
      },
      {
        name: "methodologyReferences",
        label: "Links / References for Methodologies",
        placeholder: "Provide references or links...",
        type: "input",
        cols: 1,
      },
      {
        name: "facilitiesExcluded",
        label: "Excluded Facilities or Sources",
        placeholder:
          "Have any facilities/operations been excluded? If yes, specify...",
        type: "textarea",
        cols: 1,
      },
      {
        name: "contractualProvisionInfo",
        label: "Contractual Provisions Related to GHG Risks",
        placeholder: "Provide information related to contractual provisions...",
        type: "textarea",
        cols: 1,
      },
      {
        name: "externalAssurance",
        label: "External Assurance / Verification Statement",
        placeholder:
          "Provide details of external assurance or upload statement...",
        type: "textarea",
        cols: 1,
      },
      {
        name: "inventoryQuality",
        label: "Quality of Inventory & Uncertainty",
        placeholder:
          "Describe causes/magnitude of uncertainties and quality improvement policies...",
        type: "textarea",
        cols: 1,
      },
      {
        name: "ghgSequestration",
        label: "GHG Sequestration",
        placeholder: "Provide information on any GHG sequestration...",
        type: "textarea",
        cols: 2,
      },
      {
        name: "baseYearEmissions",
        label: "Base Year Emissions",
        type: "table",
        cols: 2,
        columns: [
          { label: "Scope", key: "scope", inputType: "readonly" },
          { label: "TOTAL (mtCO2e)", key: "total", inputType: "number" },
          { label: "CO2 (mt)", key: "co2", inputType: "number" },
          { label: "CH4 (mt)", key: "ch4", inputType: "number" },
          { label: "N2O (mt)", key: "n2o", inputType: "number" },
          { label: "HFCs (mt)", key: "hfcs", inputType: "number" },
          { label: "PFCs (mt)", key: "pfcs", inputType: "number" },
          { label: "SF6 (mt)", key: "sf6", inputType: "number" },
        ],
        rows: ["Scope 1", "Scope 2", "Scope 3 (Optional)"],
      },


      // {
      //   name: "organizationalBoundaries",
      //   label: "Organizational Boundaries – Legal Entities / Facilities",
      //   type: "table",
      //   cols: 2,   
      //   columns: [
      //     { label: "Entity / Facility Name", key: "entity", inputType: "text" },
      //     { label: "% Equity Share", key: "equityShare", inputType: "number" },
      //     {
      //       label: "Financial Control (Yes/No)",
      //       key: "financialControl",
      //       inputType: "text",
      //     },
      //     {
      //       label: "Operational Control (Yes/No)",
      //       key: "operationalControl",
      //       inputType: "text",
      //     },
      //   ],
      //   rows: ["Row 1", "Row 2", "Row 3"],
      // },


      // Update the organizationalBoundaries field in your sections array

{
  name: "organizationalBoundaries",
  label: "Organizational Boundaries – Legal Entities / Facilities",
  type: "table",
  cols: 2,   
  columns: [
    { label: "Entity / Facility Name", key: "entity", inputType: "text" },
    { label: "% Equity Share", key: "equityShare", inputType: "number" },
    {
      label: "Financial Control (Yes/No)",
      key: "financialControl",
      inputType: "select",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ]
    },
    {
      label: "Operational Control (Yes/No)",
      key: "operationalControl",
      inputType: "select",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" }
      ]
    },
  ],
  rows: ["Row 1", "Row 2", "Row 3"],
},

      {
        name: "organizationalDiagram",
        label: "Organizational Diagram (if parent does not report emissions)",
        placeholder: "Upload or describe organizational diagram...",
        type: "diagram",
        cols: 2,
      },
    ],
  },
  {
    id: "reportingPermissions",
    title: "Reporting & Permissions",
    subtitle: "Fields from Reporting Permissions component",
    fields: [
      {
        name: "protocol",
        label: "Reporting Protocol",
        placeholder: "Select protocol",
        type: "select",
        options: [
          { label: "GHG Protocol", value: "ghg" },
          { label: "ISO 14064", value: "iso" },
          { label: "Custom Protocol", value: "custom" },
        ],
        cols: 1,
      },
      {
        name: "baseYear",
        label: "Base Year",
        placeholder: "Pick a date or year",
        type: "input",
        cols: 1,
      },
      {
        name: "reportingDateFrom",
        label: "Reporting Period (From)",
        placeholder: "Start Period (MM-YYYY)",
        type: "reportingPeriodFrom",
        helper: "Pick the start of reporting period",
        cols: 1,
      },
      {
        name: "reportingDateTo",
        label: "Reporting Period (To)",
        placeholder: "End Period (MM-YYYY)",
        type: "reportingPeriodTo",
        helper: "Pick the end of reporting period",
        cols: 1,
      },
      {
        name: "accessGivenUsers",
        label: "Access Given to Users",
        placeholder: "Search and select users...",
        type: "userSearch",
        helper: "Search by name and select one or more users",
        cols: 1,
      },
    ],
  },
];
