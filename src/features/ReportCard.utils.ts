import axios from "@/lib/axios/axios";
import { toast } from "sonner";
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


export async function downloadReport(project_id: number): Promise<void> {
  try {
    const data = await axios.post<Blob>(
      "/get_project_category_carbon_with_facilities",
      {
        project_id,
      },
      {
        responseType: "blob",
      }
    );
    const blob = new Blob([data.data], {
      type: "application/pdf",
    });
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
