"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import CarbonTrackerHeader from "./CarbonTrackerHeader";
import OverallCompletion from "./OverallCompletion";
import ActivityPanel from "./ActivityPanel";
import ScopeCards from "./ScopeCards";
import ScopeDrawer from "./ScopeDrawer";
import { drawerScopes } from "@/schema/carbon-accounting-data";
import ManageApprovalFlow from "./ManageApprovalFlow";
import { UiUser } from "./ManageTeam";
import { userId, getProjectId } from "@/lib/jwt";
import { useUser } from "@/lib/context/EntriesContext";
import { getProjectMembers, getProjectProgress } from "./utils";

export default function CarbonTrackerDashboard() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selected, setSelected] = useState<number[]>([1, 2, 3]);
  const [projectId, setProjectId] = useState<number>(0);
  const [membersMap, setMembersMap] = useState<Map<string, UiUser>>(new Map());
  const [originalSnapshot, setOriginalSnapshot] = useState<Map<string, UiUser>>(new Map());
  const [progress, setProgress] = useState({
    scope1: 0,
    scope2: 0,
    scope3: 0,
    overall: 0,
    overall_status: "",
  });
  const { setIsViewer } = useUser();

  async function fetchProgress(projectId: number) {
    try {
      const prjProgress = await getProjectProgress(projectId);
      setProgress(prjProgress);
    } catch (error) {
      console.error("Error fetching overall completion:", error);
    }
  }

  async function fetchMembers(projectId: number) {
    try {
      const membersMap = await getProjectMembers(projectId);
      if (!membersMap) return;
      setMembersMap(membersMap);
      setOriginalSnapshot(new Map(membersMap));
    } catch (error) {
      console.error("Error fetching project members:", error);
    }
  }

  useEffect(() => {
    setProjectId(getProjectId());
  }, []);

  useEffect(() => {
    if (!projectId) return;
    fetchMembers(projectId);
    fetchProgress(projectId);
  }, [projectId]);

  useEffect(() => {
    if (!membersMap) return;
    const logged = membersMap.get(String(userId));
    const viewer = logged?.permission_level === "viewer";
    if (typeof window !== "undefined") {
      window.localStorage.setItem("isViewer", viewer ? "true" : "false");
    };
    setIsViewer(viewer);
  }, [membersMap, setIsViewer]);

  return (
    <div className="md:p-1">
      <CarbonTrackerHeader onOpen={() => setDrawerOpen(true)} />
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-2 grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8"
      >
        <div className="space-y-8">
          <OverallCompletion status={progress.overall_status} completion={progress.overall} />
          <ScopeCards progressObj={progress} projectId={projectId} visibleScopes={selected} />
        </div>

        <div className="space-y-8">
          <ActivityPanel
            originalSnapshot={originalSnapshot}
            membersMap={membersMap}
            setMembersMap={setMembersMap}
            projectId={projectId}
            setOriginalSnapshot={setOriginalSnapshot}
          />
          <ManageApprovalFlow
            membersMap={membersMap}
            projectId={projectId}
          />
        </div>
      </motion.section>

      <ScopeDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        scopes={drawerScopes}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  );
}
