import { ApiListResponse, UiUser } from "./ManageTeam";
import axios from "@/lib/axios/axios";

// Types
export type FlowUser = {
  id: string;
  name: string;
  role: string;
};
export type FlowStep = {
  id: string;
  label: string;
  fixed: boolean;
  participants: FlowUser[];
};
export type ManageApprovalFlowProps = {
  membersMap?: Map<string, UiUser>;
  projectId: number;
};
export type RemoveAuditorPayload = {
  p_project_id: number;
  p_auditor_id: number;
  p_requester_id: number;
};
type AuditorRemoveRes = {
  status: boolean;
  message: string;
};

// API functions
export async function removeAuditor(
  payload: RemoveAuditorPayload
): Promise<AuditorRemoveRes> {
  try {
    const res = await axios.post("/remove_project_auditor", payload);
    return {
      status: res.data?.issuccessful,
      message: res.data?.message,
    };
  } catch (error: any) {
    console.error("Error removing auditor:", error);
    const apiMessage =
      error?.response?.data?.message ??
      error?.response?.data?.templates?.[0]?.remove_project_auditor ??
      "Request failed";

    return {
      status: false,
      message: apiMessage,
    };
  }
}

export async function getProjectProgress(projectId: number) {
  const res = await axios.post("/get_project_overall_completion", {
    p_project_id: projectId,
  });
  const data = res.data?.data?.templates[0];
  return {
    scope1: Number(data.scope1_completion),
    scope2: Number(data.scope2_completion),
    scope3: Number(data.scope3_completion),
    overall: Number(data.completion_percentage),
    overall_status: data.overall_status,
  };
}

export async function getProjectMembers(id: number) {
  const res = await axios.post<ApiListResponse>(
    "/get_project_members_for_approval",
    { p_project_id: id }
  );

  if (!res.data?.issuccessful) return null;

  const map = new Map<string, UiUser>();
  res.data.data.templates.forEach((m) => {
    map.set(String(m.user_id), {
      id: String(m.user_id),
      name: m.full_name,
      role: m.role_name as UiUser["role"],
      permission_level: m.permission_level,
      isProjectMember: true,
    });
  });

  return map;
}
