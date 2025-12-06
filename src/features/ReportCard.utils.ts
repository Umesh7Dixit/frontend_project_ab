import axios from "@/lib/axios/axios";
interface TemplateItem {
  project_name: string;
  reporting_period_start: string;
  reporting_period_end: string;
  scope_name: string;
  main_category: string;
  total_quantity: string;
  unit_name: string;
  total_carbon_emission: string;
}
interface Res {
  data: {
    templates: TemplateItem[];
  };
}
interface PdfRow {
  label: string;
  value: number | null;
  bold?: boolean;
  grayBg?: boolean;
}
interface GeneratePdfPayload {
  reportingPeriod: string;
  criteria: string;
  otherSources: string;
  rows: PdfRow[];
}

export async function downloadReport(project_id: number): Promise<void> {
  try {
    const { data } = await axios.post<Res>("/get_project_category_scope_totals", {
    // const { data } = await axios.post<Res>("/get_project_category_totals", {
      project_id,
    });
    const templates = data?.data?.templates ?? [];

    if (templates.length === 0) {
      throw new Error("No template data returned from API.");
    }

    const { reporting_period_start, reporting_period_end } = templates[0];
    const reportingPeriod = [
      new Date(reporting_period_start),
      new Date(reporting_period_end),
    ]
      .map((date) =>
        date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      )
      .join(" to ");

    const criteria = "IJM GHG Procedure/1.1 – ISO 14064-1:2018";
    const otherSources = "N/A";

    const rows: GeneratePdfPayload["rows"] = templates.map((t) => {
      const value = Number(t.total_carbon_emission);
      return {
        label: `${t.scope_name} – ${t.main_category}`.slice(0, 120),
        value: Number.isFinite(value) ? value : null,
        bold: false,
        grayBg: false,
      };
    });

    const payload: GeneratePdfPayload = {
      reportingPeriod,
      criteria,
      otherSources,
      rows,
    };

    const pdfResponse = await axios.post<Blob>("/generate_pdf", payload, {
      responseType: "blob",
    });

    const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `GHG-Emissions-Report-${Date.now()}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error generating PDF report:", error);
  }
}
