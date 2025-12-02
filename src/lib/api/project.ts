import axios from "../axios/axios";
import { ApiResponse } from "./client";

export interface ProjectCreateResponse {
  project_id: number;
  project_name: string;
  facility_id: number;
  creator_user_id: number;
  industry: string;
  team_members_added: number;
  reporting_period: {
    start: string;
    end: string;
  };
}

export interface ProjectCreateData {
  facility_id: number;
  project_name: string;
  project_description: string;
  reporting_period_start: string;
  reporting_period_end: string;
  responsible_party: string;
  intended_user: string;
  intended_use_of_inventory: string;
  organisational_boundary_type: string;
  reporting_protocol: string;
  base_year: number;
  industry: string;
  team_assignments: { user_id: number; role_name: string }[];

  base_year_recalculation_policy?: string;
  recalculation_context?: string;
  methodologies_used?: string;
  methodology_references?: string;
  facilities_excluded?: string;
  contractual_provision_info?: string;
  external_assurance?: string;
  inventory_quality?: string;
  ghg_sequestration?: string;
  base_year_emissions?: {
    scope?: string;
    total?: string;
    co2?: string;
    ch4?: string;
    n2o?: string;
    hfcs?: string;
    pfcs?: string;
    sf6?: string;
  }[];
  organizational_boundaries?: {
    entity?: string;
    equityShare?: string;
    financialControl?: string;
    operationalControl?: string;
  }[];
  organizational_diagram?: string;
}

export const projectApi = {
  createProject: async (
    data: any,
    token: string
  ): Promise<ApiResponse> => {
    const response = await axios.post("/projects/initialize", data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },
};
