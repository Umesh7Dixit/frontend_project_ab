import * as z from "zod";

export type FieldType =
  | "input"
  | "select"
  | "file"
  | "textarea"
  | "phone"
  | "email";

export type FieldOption = {
  label: string;
  value: string;
};

export type Field = {
  name: string; // form field key
  label: string;
  placeholder?: string;
  type: FieldType;
  options?: FieldOption[]; // for select
  cols?: number; // layout hint (1 or 2)
  accept?: string; // for file input
  helper?: string;
};

export type Section = {
  id: string;
  title: string;
  subtitle?: string;
  fields: Field[];
};

/**
 * Zod schema for the whole form
 * - Not wired into the form yet (you asked to keep it ready but unused)
 * - Reasonable defaults: required where sensible, emails validated, files typed as File | undefined
 */

export const formSchema = z.object({
  p_facility_name: z.string().min(1),
  p_org_id: z.string().min(1),
  p_gst_number: z.string().min(1, "GST Number is required"),

  p_admin_name: z.string().min(1),
  p_admin_email: z.string().email().optional(),
  p_admin_phone: z.string().optional(),

  p_address_line1: z.string().min(1),
  p_country: z.string().optional(),
  p_state: z.string().optional(),
  p_city: z.string().optional(),
  p_postal_code: z.string().optional(),
  p_logo_url: z.instanceof(File).optional(),
  p_id_document: z.instanceof(File).optional(),
  p_tax_document: z.instanceof(File).optional(),
});

/** Type for the form (inferred from schema) */
export type FormSchema = z.infer<typeof formSchema>;

/**
 * Sections & fields (same as before) — unchanged structure
 */

export const sections: Section[] = [
  {
    id: "basic",
    title: "Basic Information",
    subtitle: "Essential details about Facility",
    fields: [
      {
        name: "p_logo_url",
        label: "Upload Logo",
        placeholder: "Upload logo",
        type: "file",
        accept: "image/*",
        cols: 2,
      },
      {
        name: "p_facility_name",
        label: "Facility Name",
        placeholder: "Acme Corporation",
        type: "input",
        cols: 2,
      },
      {
        name: "p_org_id",
        label: "Organization",
        placeholder: "Select organization",
        type: "select",
        options: [],
        cols: 1,
      },
      {
        name: "p_gst_number",
        label: "Registration Number",
        placeholder: "CIN / GST / Business Reg. No.",
        type: "input",
        cols: 2,
        helper: "Used for verification",
      },
    ],
  },

  {
    id: "admin",
    title: "Administrator",
    subtitle: "Primary contact for administrative access",
    fields: [
      {
        name: "p_admin_name",
        label: "Admin Full Name",
        placeholder: "Jane Doe",
        type: "input",
        cols: 2,
      },
      {
        name: "p_admin_email",
        label: "Admin Email",
        placeholder: "admin@company.com",
        type: "email",
        cols: 1,
      },
      {
        name: "p_admin_phone",
        label: "Admin Phone",
        placeholder: "+91 98765 43210",
        type: "phone",
        cols: 1,
      },
    ],
  },

  {
    id: "location",
    title: "Location & Contact",
    subtitle: "Head office address and official contact details",
    fields: [
      {
        name: "p_address_line1",
        label: "Head Office Address",
        placeholder: "Street, Building, Landmark",
        type: "textarea",
        cols: 2,
      },
      {
        name: "p_country",
        label: "Country",
        placeholder: "Select country",
        type: "select",
        options: [
          { label: "India", value: "IN" },
          { label: "United States", value: "US" },
          { label: "United Kingdom", value: "GB" },
          { label: "Australia", value: "AU" },
        ],
        cols: 1,
      },
      {
        name: "p_state",
        label: "State / Province",
        placeholder: "Karnataka",
        type: "input",
        cols: 1,
      },
      {
        name: "p_city",
        label: "City",
        placeholder: "Mangalore",
        type: "input",
        cols: 1,
      },
      {
        name: "p_postal_code",
        label: "Zip / Postal Code",
        placeholder: "560001",
        type: "input",
        cols: 1,
      },
    ],
  },

  {
    id: "uploads",
    title: "Upload Documents",
    subtitle: "Upload required documents for verification (PDF, JPG, PNG)",
    fields: [
      {
        name: "p_id_document",
        label: "ID Document",
        placeholder: "Upload business registration or ID",
        type: "file",
        accept: ".pdf,image/*",
        cols: 1,
        helper: "PDF, JPG, PNG — up to 10MB",
      },
      {
        name: "p_tax_document",
        label: "Tax / GST Document",
        placeholder: "Upload tax proof",
        type: "file",
        accept: ".pdf,image/*",
        cols: 1,
        helper: "PDF, JPG, PNG — up to 10MB",
      },
    ],
  },
];
