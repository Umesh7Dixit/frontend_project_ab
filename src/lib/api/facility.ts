import axios from "@/lib/axios/axios";
import { apiClient, ApiResponse } from "./client";
import Cookies from "js-cookie";
export interface FacilityItem {
  facility_id: number;
  facility_name: string;
  org_id: number;
  org_name: string;
}

export interface GetFacilitiesResponse {
  facilities: FacilityItem[];
  count: number;
}

export const facilityApi = {
  getAccessibleFacilities: async (
    search: string,
    token: string
  ): Promise<ApiResponse<GetFacilitiesResponse>> => {
    return apiClient.get<GetFacilitiesResponse>(
      `/facilities/accessible?search_term=${encodeURIComponent(search)}`,
      {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }
    );
  },
};

export const getOrgs = async ({
  parent_org_id,
  setOrganization,
}: {
  parent_org_id: number;
  setOrganization: (orgs: { label: string; value: string }[]) => void;
}) => {
  const token = Cookies.get("user_info");
  try {
    const response = await axios.post(
      `/getorg_name_and_id`,
      { parent_org_id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.data;
    const formatted = result.data?.facility.map((item: any) => ({
      label: item.org_name,
      value: String(item.org_id),
    }));
    setOrganization(formatted);
  } catch (error: any) {
    console.error("Error fetching preview data:", error.response.data);
  }
};
