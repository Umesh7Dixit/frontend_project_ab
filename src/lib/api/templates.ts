import axios from "@/lib/axios/axios";
import { apiClient, ApiResponse } from "./client";
export interface TemplateItem {
  template_id: number;
  name: string;
  description: string;
  is_public: boolean;
  creator_name: string;
  created_at: string;
  usage_percentage: number;
}

export interface TemplateDetail {
  unit_name: string;
  scope: string;
  activity: string;
  selection_1: string;
  selection_2: string;
  sub_category: string;
  frequency: string;
  emission_factor: number;
  staging_id: number;
  main_category: string;
}

export interface GetTemplatesResponse {
  templates: TemplateItem[];
  count: number;
}

export interface GetTemplateDetailsResponse {
  templates: TemplateDetail[];
}

export interface MainCategory {
  category_id: number;
  category_name: string;
}

export interface MainCategoriesResponse {
  categories: MainCategory[];
  count: number;
}

export interface GenericListResponse {
  templates: any[];
  count: number;
}

export const templateApi = {
  getTemplates: async (
    searchTerm?: string,
    token?: string
  ): Promise<ApiResponse<GetTemplatesResponse>> => {
    const url = searchTerm
      ? `/templates/list?search_term=${encodeURIComponent(searchTerm)}`
      : "/templates/list";

    return apiClient.get<GetTemplatesResponse>(url, {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    });
  },

  getTemplateDetails: async (p_project_id: number, p_scope: string) => {
    const res = await axios.post<ApiResponse<GetTemplateDetailsResponse>>(
      "/get_staged_activities_for_project",
      { p_project_id, p_scope }
    );

    const response = res.data;
    if (!response.issuccessful) return null;

    const mapped = response.data.templates.map((item: any, index: number) => ({
      id: item.staging_id,
      activity: item.activity,
      scope: item.scope,
      selection_1: item.selection_1 || "N/A",
      selection_2: item.selection_2 || "N/A",
      frequency: item.frequency || "Monthly",
      unit: item.unit_name,
      main_category: item.main_category,
      sub_category: item.sub_category,
      ef: item.emission_factor,
      subcategory_id: item.subcategory_id,
      efSource: "-",
    }));

    return mapped;
  },

  getMainCategoriesForScopeAndSource: async (
    token: string,
    scope: string,
    source: string
  ): Promise<ApiResponse<MainCategoriesResponse>> => {
    const url = `/categories/main?scope=${encodeURIComponent(
      scope
    )}&source=${encodeURIComponent(source)}`;

    return apiClient.get<MainCategoriesResponse>(url, {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
  },

  getSubcategoriesForMainCategory: async (
    token: string,
    main_category_id: number
  ): Promise<ApiResponse<GenericListResponse>> => {
    return apiClient.post(
      `/get_subcategories_for_main_category`,
      {
        p_main_category_id: main_category_id,
      },
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
  },

  getActivitiesForSubcategory: async (
    token: string,
    main_category_id: number,
    subcategory_name: string
  ): Promise<ApiResponse<GenericListResponse>> => {
    return apiClient.post(
      `/get_activities_for_subcategory`,
      {
        p_main_category: main_category_id,
        p_subcategory_name: subcategory_name,
      },
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
  },

  getSelection1ForActivity: async (
    token: string,
    main_category_id: number,
    subcategory_name: string,
    activity_name: string
  ): Promise<ApiResponse<GenericListResponse>> => {
    return apiClient.post(
      `/get_selection1_for_activity`,
      {
        p_main_category: main_category_id,
        p_subcategory_name: subcategory_name,
        p_activity_name: activity_name,
      },
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
  },

  getSelection2ForSelection1: async (
    token: string,
    main_category_id: number,
    subcategory_name: string,
    activity_name: string,
    selection_1_name: string
  ): Promise<ApiResponse<GenericListResponse>> => {
    return apiClient.post(
      `/get_selection2_for_selection1`,
      {
        p_main_category_id: main_category_id,
        p_subcategory_name: subcategory_name,
        p_activity_name: activity_name,
        p_selection_1_name: selection_1_name,
      },
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
  },

  getEmissionFactor: async (
    token: string,
    source: string,
    scope: string,
    main_category_id: number,
    subcategory_name: string,
    activity_name: string,
    selection_1_name: string | null,
    selection_2_name: string | null
  ): Promise<ApiResponse<GenericListResponse>> => {
    return apiClient.post(
      `/get_emission_factor_for_selection`,
      {
        p_source: source,
        p_scope: scope,
        p_main_category_id: main_category_id,
        p_subcategory_name: subcategory_name,
        p_activity_name: activity_name,
        p_selection_1_name: selection_1_name,
        p_selection_2_name: selection_2_name,
      },
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
  },

  getUnitById: async (token: string, unit_id: number) => {
    return apiClient.post(
      `/getUnitById`,
      { unit_id },
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
  },

  saveProjectActivityConfiguration: async (
    token: string,
    projectId: number | string,
    activities: any
  ) => {
    return axios.post(
      "/save_project_activity_configuration",
      {
        p_project_id: projectId,
        p_configured_activities: activities,
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  },

  commitStagedChangesToProject: async (p_project_id: number) => {
    return axios.post("/commit_staged_changes_to_project", {
      p_project_id,
    });
  },

  copyTemplateToStagingArea: async (
    p_project_id: number,
    p_template_id: number
  ) => {
    return axios.post("/copy_template_to_staging_area", {
      p_project_id,
      p_template_id,
    });
  },

  deleteStagedActivity: async (
    p_project_id: number,
    p_subcategory_id: number
  ) => {
    return axios.post("/delete_staged_activity", {
      p_project_id,
      p_subcategory_id,
    });
  }
};
