import axios from "@/lib/axios/axios";

// Types
export interface Task {
  task_id: number;
  project_id: number;
  project_name: string;
  request_type: string;
  topic: string;
  description: string;
  status: string;
  created_by_name: string;
  created_at: string;
  last_updated_at: string;
  document_url: string | null;
}
export interface TaskHeader {
  project_id: number;
  project_name: string;
  task_title: string;
  task_type: string;
  status: string;
  created_by_name: string;
  created_at: string;
}
export interface AddTaskCommentPayload {
  p_task_id: number;
  p_user_id: number;
  p_comment_text: string;
  p_file_name: string | null;
  p_file_url: string | null;
  p_file_size: number | null;
}
export interface TaskConv {
  task_id: number;
  project_id: number;
  project_name: string;
  request_type: string;
  topic: string;
  user_id: number;
  comment_id: number;
  comment_text: string;
  status: string;
  user_name: string;
  created_at: string;
  last_updated_at: string;
  document_url: string | null;
}
export interface Approve {
  p_project_id: number;
  p_approver_id_user_id: number;
  p_decision: string;
  p_remarks: string | null;
}

// API Functions
export async function fetchTasks(
  p_user_id: number,
  p_status_filter: string
): Promise<Task[]> {
  try {
    const res = await axios.post("/get_assigned_tasks_for_user", {
      p_user_id,
      p_status_filter,
    });
    return res.data?.data?.templates || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function getTaskHeader(p_task_id: number): Promise<TaskHeader> {
  try {
    const res = await axios.post("/get_task_header", { p_task_id });
    return res.data?.data?.templates[0];
  } catch (error) {
    console.error("Error fetching task header:", error);
    throw error;
  }
}

export async function getTaskConv(p_task_id: number): Promise<TaskConv[]> {
  try {
    const res = await axios.post("/get_task_conversation", { p_task_id });
    return res.data?.data?.templates || [];
  } catch (error) {
    console.error("Error fetching task conversation:", error);
    throw error;
  }
}

export async function addTaskComment(payload: AddTaskCommentPayload) {
  try {
    const res = await axios.post("/add_task_comment", payload);
    return res.data?.issuccessful;
  } catch (error) {
    console.error("Error adding task comment:", error);
  }
}

export async function approveDecision(payload: Approve) {
  return axios.post("/record_approver_decision", payload);
}
