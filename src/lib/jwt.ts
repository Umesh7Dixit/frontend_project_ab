"use client";
import Cookies from "js-cookie";

let orgId: number = 0;
let userId: number = 0;
let facilityName: string = "";
let token: string = "";
let projectId: number = 0;
let parentOrgId: number = 0;
let fullName: string = "";
if (typeof window !== "undefined") {
  const rawUser = Cookies.get("user_data") || "{}";
  const userData = JSON.parse(rawUser);
  const rawOrgInfo = Cookies.get("org-info") || "{}";
  const orgInfo = JSON.parse(rawOrgInfo);
  token = Cookies.get("user_info")?.replace(/(^"|"$)/g, "") || "";

  function decodeJwt(token: string) {
    try {
      const [h, p, s] = token.split(".");
      if (!h || !p || !s) return null;
      return JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
      return null;
    }
  }
  let raw = window.localStorage.getItem("projectId");
  projectId = raw ? Number(raw) : 0;
  const payload = decodeJwt(token);
  facilityName = orgInfo.facility_name || "";
  orgId = Number(userData.org_id);
  parentOrgId = Number(userData.parent_org_id);
  userId = payload?.userId ?? 0;
  fullName = payload?.full_name || "";
}
export function getProjectId() {
  if (typeof window === "undefined") return 0;
  const raw = window.localStorage.getItem("projectId");
  return raw ? Number(raw) : 0;
}
export function getUserId() {
  if (typeof window === "undefined") return 0;
  const rawUser = Cookies.get("user_data") || "{}";
  const userData = JSON.parse(rawUser);
  return Number(userData.user_id) || 0;
}
export function getViewer() {
  if (typeof window === "undefined") return false;
  const isViewer = window.localStorage.getItem("isViewer");
  return isViewer === "true";
}
export { orgId, userId, facilityName, token, projectId, parentOrgId, fullName };
