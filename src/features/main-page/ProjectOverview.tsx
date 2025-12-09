"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, DownloadCloud, Ellipsis } from "lucide-react";
import { getProjectProgress } from "../carbon-accounting/dashboard/utils";
import axios from "@/lib/axios/axios";
import { useRouter } from "next/navigation";

import { Progress } from "@/components/ui/progress";
import ProjectDetailsModal from "./ProjectDetailsModal";
import ProjectActionModal from "./ProjectActionModal";
import { ActionValue } from "./utils";
import { fetchTasks, Task } from "../tasks/utils";
import { getUserId } from "@/lib/jwt";
import { downloadReport } from "../ReportCard.utils";

const ITEMS_PER_PAGE = 4;

type TaskWithProgress = Task & {
  overallProgress: number;
  scopes: { name: string; progress: number }[];
};

interface ProjectApiResponse {
  project_id: number;
  project_name: string;
  date_created: string;
  last_activity_date: string;
  facility_name: string;
  organization_name: string;
  owner_name: string;
  auditor_name: string;
  user_role: string;
  completion_percentage: number;
}

interface ProjectRow {
  id: number;
  name: string;
  created: string;
  activity: string;
  facility_name: string;
  org_name: string;
  owner: string;
  auditor: string;
  role: string;
  completion: number;
  overallProgress?: number;
  scopes?: { name: string; progress: number }[];
}

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

async function fetchProjectData(
  p_user_id: number,
  p_view_type: "Open" | "Completed"
): Promise<ProjectRow[]> {
  try {
    const res = await axios.post("/get_project_portfolio_list", {
      p_user_id,
      p_view_type,
    });
    const apiProjects: ProjectApiResponse[] = res.data?.data?.templates ?? [];

    const sorted = [...apiProjects].sort(
      (a, b) =>
        new Date(b.last_activity_date).getTime() -
        new Date(a.last_activity_date).getTime()
    );

    return sorted.map((item) => ({
      id: item.project_id,
      name: item.project_name,
      created: formatDate(item.date_created),
      activity: formatDate(item.last_activity_date),
      facility_name: item.facility_name,
      org_name: item.organization_name,
      owner: item.owner_name,
      auditor: item.auditor_name,
      role: item.user_role,
      completion: item.completion_percentage,
    }));
  } catch (error) {
    console.error("Error fetching project data:", error);
    return [];
  }
}

const ProjectOverview = () => {
  const router = useRouter();
  const userId = getUserId();
  const [openModal, setOpenModal] = useState(false);
  const [openActionModal, setOpenActionModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Task | null>(null);
  const [taskItems, setTaskItems] = useState<TaskWithProgress[]>([]);
  const [taskPage, setTaskPage] = useState(0);
  const [taskDirection, setTaskDirection] = useState<"left" | "right">("right");
  const [taskAnimating, setTaskAnimating] = useState(false);
  const [openProjects, setOpenProjects] = useState<ProjectRow[]>([]);
  const [completedProjects, setCompletedProjects] = useState<ProjectRow[]>([]);
  const [openProgressLoaded, setOpenProgressLoaded] = useState(false);
  const [completedProgressLoaded, setCompletedProgressLoaded] = useState(false);

  const [openPage, setOpenPage] = useState(0);
  const [openDirection, setOpenDirection] = useState<"left" | "right">("right");
  const [openAnimating, setOpenAnimating] = useState(false);

  const [completedPage, setCompletedPage] = useState(0);
  const [completedDirection, setCompletedDirection] =
    useState<"left" | "right">("right");
  const [completedAnimating, setCompletedAnimating] = useState(false);

  useEffect(() => {
    fetchTasks(userId, "Open").then((tasks: Task[]) => {
      const formatted: TaskWithProgress[] = tasks.map((t) => ({
        ...t,
        overallProgress: 0,
        scopes: [],
      }));

      setTaskItems(formatted.slice(0, 8));
      setTaskPage(0);
    });
  }, []);


  useEffect(() => {
    if (!userId) {
      console.error("Invalid user token.");
      return;
    }

    const loadProjects = async () => {
      const [open, completed] = await Promise.all([
        fetchProjectData(userId, "Open"),
        fetchProjectData(userId, "Completed"),
      ]);

      setOpenProjects(open.slice(0, 8));
      setCompletedProjects(completed.slice(0, 8));
      setOpenPage(0);
      setCompletedPage(0);
    };

    loadProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return;

    async function fetchProgressForTask() {
      try {
        if (!selectedProject?.project_id) return;
        const pr: any = await getProjectProgress(selectedProject.project_id);

        setTaskItems((prev) =>
          prev.map((p) =>
            p.project_id === selectedProject.project_id
              ? {
                ...p,
                overallProgress: pr.overall,
                scopes: [
                  { name: "Scope 1", progress: pr.scope1 },
                  { name: "Scope 2", progress: pr.scope2 },
                  { name: "Scope 3", progress: pr.scope3 },
                ],
              }
              : p
          )
        );
      } catch (error) {
        console.error("Error fetching task progress:", error);
      }
    }

    fetchProgressForTask();
  }, [selectedProject]);


  useEffect(() => {
    if (!openProjects.length || openProgressLoaded) return;

    const loadOpenProgress = async () => {
      const updated = await Promise.all(
        openProjects.map(async (p) => {
          try {
            const pr: any = await getProjectProgress(p.id);
            return {
              ...p,
              overallProgress: pr.overall,
              scopes: [
                { name: "Scope 1", progress: pr.scope1 },
                { name: "Scope 2", progress: pr.scope2 },
                { name: "Scope 3", progress: pr.scope3 },
              ],
            };
          } catch (e) {
            console.error("Error fetching project progress (open):", e);
            return p;
          }
        })
      );
      setOpenProjects(updated);
      setOpenProgressLoaded(true);
    };

    loadOpenProgress();
  }, [openProjects, openProgressLoaded]);


  useEffect(() => {
    if (!completedProjects.length || completedProgressLoaded) return;

    const loadCompletedProgress = async () => {
      const updated = await Promise.all(
        completedProjects.map(async (p) => {
          try {
            const pr: any = await getProjectProgress(p.id);
            return {
              ...p,
              overallProgress: pr.overall,
              scopes: [
                { name: "Scope 1", progress: pr.scope1 },
                { name: "Scope 2", progress: pr.scope2 },
                { name: "Scope 3", progress: pr.scope3 },
              ],
            };
          } catch (e) {
            console.error("Error fetching project progress (completed):", e);
            return p;
          }
        })
      );
      setCompletedProjects(updated);
      setCompletedProgressLoaded(true);
    };

    loadCompletedProgress();
  }, [completedProjects, completedProgressLoaded]);

  const handleTaskCardClick = (item: TaskWithProgress) => {
    setSelectedProject(item);
    setOpenActionModal(true);
  };

  const handleTaskEllipsis = (
    e: React.MouseEvent,
    item: TaskWithProgress
  ) => {
    e.stopPropagation();
    setSelectedProject(item);
    setOpenModal(true);
  };

  const handleProjectClick = (projectId: number) => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("projectId", projectId.toString());
    }
    router.push(`/project/${projectId}/data-control`);
  };

  const handleProjectDownload = (project: ProjectRow) => {
    console.log("Download report for project", project.id);
  };


  const taskTotalPages = Math.max(
    1,
    Math.ceil(taskItems.length / ITEMS_PER_PAGE)
  );
  const taskCurrentItems = taskItems.slice(
    taskPage * ITEMS_PER_PAGE,
    taskPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const handleTaskPrev = () => {
    setTaskDirection("left");
    setTaskAnimating(true);
    setTaskPage((p) => Math.max(p - 1, 0));
  };

  const handleTaskNext = () => {
    setTaskDirection("right");
    setTaskAnimating(true);
    setTaskPage((p) => Math.min(p + 1, taskTotalPages - 1));
  };

  const openTotalPages = Math.max(
    1,
    Math.ceil(openProjects.length / ITEMS_PER_PAGE)
  );
  const openCurrentItems = openProjects.slice(
    openPage * ITEMS_PER_PAGE,
    openPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const handleOpenPrev = () => {
    setOpenDirection("left");
    setOpenAnimating(true);
    setOpenPage((p) => Math.max(p - 1, 0));
  };

  const handleOpenNext = () => {
    setOpenDirection("right");
    setOpenAnimating(true);
    setOpenPage((p) => Math.min(p + 1, openTotalPages - 1));
  };

  const completedTotalPages = Math.max(
    1,
    Math.ceil(completedProjects.length / ITEMS_PER_PAGE)
  );
  const completedCurrentItems = completedProjects.slice(
    completedPage * ITEMS_PER_PAGE,
    completedPage * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );

  const handleCompletedPrev = () => {
    setCompletedDirection("left");
    setCompletedAnimating(true);
    setCompletedPage((p) => Math.max(p - 1, 0));
  };

  const handleCompletedNext = () => {
    setCompletedDirection("right");
    setCompletedAnimating(true);
    setCompletedPage((p) => Math.min(p + 1, completedTotalPages - 1));
  };

  return (
    <>
      {selectedProject && (
        <>
          <ProjectDetailsModal
            open={openModal}
            onOpenChange={setOpenModal}
            project={selectedProject}
          />
          <ProjectActionModal
            open={openActionModal}
            onOpenChange={setOpenActionModal}
            project={selectedProject}
          />
        </>
      )}

      {taskItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-[15px] bg-white/65 backdrop-blur-[8px] rounded-xl shadow mb-2"
        >
          <div className="flex items-center justify-between p-1.5">
            <h2 className="text-base font-bold">Action Required (Tasks)</h2>

            <div className="flex items-center gap-3">
              <button
                aria-label="Prev page"
                onClick={handleTaskPrev}
                disabled={taskPage === 0}
                className={`rounded-full p-2 transition ${taskPage === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-secondary/20 hover:bg-secondary/30"
                  }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                aria-label="Next page"
                onClick={handleTaskNext}
                disabled={taskPage === taskTotalPages - 1}
                className={`rounded-full p-2 transition ${taskPage === taskTotalPages - 1
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-secondary/20 hover:bg-secondary/30"
                  }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden relative w-full">
            <AnimatePresence initial={false} custom={taskDirection}>
              <motion.div
                key={taskPage}
                custom={taskDirection}
                onAnimationComplete={() => setTaskAnimating(false)}
                initial={
                  taskAnimating
                    ? {
                      x: taskDirection === "right" ? 300 : -300,
                      opacity: 0,
                    }
                    : { x: 0, opacity: 1 }
                }
                animate={{ x: 0, opacity: 1 }}
                exit={
                  taskAnimating
                    ? {
                      x: taskDirection === "right" ? -300 : 300,
                      opacity: 0,
                    }
                    : {}
                }
                transition={{ duration: taskAnimating ? 0.4 : 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2"
              >
                {taskCurrentItems.map((item) => (
                  <motion.div
                    key={item.task_id}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer relative rounded-xl p-5 bg-[rgba(239,239,239,0.65)] flex flex-col items-center justify-center gap-2 shadow"
                    onClick={() => handleTaskCardClick(item)}
                  >
                    <Ellipsis
                      className="absolute top-2 right-2 text-gray-600 cursor-pointer bg-white rounded-full hover:bg-secondary/70 hover:text-white transition"
                      size={16}
                      onClick={(e) => handleTaskEllipsis(e, item)}
                    />

                    <h3 className="text-lg font-semibold mt-3">
                      {item.project_name}
                    </h3>

                    <p className="text-xs bg-yellow-400/40 px-2 py-1 rounded-full">
                      {ActionValue(item.request_type)}
                    </p>

                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {openProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-[15px] bg-white/65 backdrop-blur-[8px] rounded-xl shadow"
        >
          <div className="flex items-center justify-between p-1.5">
            <h2 className="text-base font-bold">Open Projects</h2>
            <div className="flex items-center gap-2">
              <button
                aria-label="Prev page"
                onClick={handleOpenPrev}
                disabled={openPage === 0}
                className={`rounded-full p-2 transition ${openPage === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-secondary/20 hover:bg-secondary/30"
                  }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                aria-label="Next page"
                onClick={handleOpenNext}
                disabled={openPage === openTotalPages - 1}
                className={`rounded-full p-2 transition ${openPage === openTotalPages - 1
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-secondary/20 hover:bg-secondary/30"
                  }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden relative w-full">
            <AnimatePresence initial={false} custom={openDirection}>
              <motion.div
                key={openPage}
                custom={openDirection}
                onAnimationComplete={() => setOpenAnimating(false)}
                initial={
                  openAnimating
                    ? {
                      x: openDirection === "right" ? 300 : -300,
                      opacity: 0,
                    }
                    : { x: 0, opacity: 1 }
                }
                animate={{ x: 0, opacity: 1 }}
                exit={
                  openAnimating
                    ? {
                      x: openDirection === "right" ? -300 : 300,
                      opacity: 0,
                    }
                    : {}
                }
                transition={{ duration: openAnimating ? 0.4 : 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2"
              >
                {openCurrentItems.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer relative rounded-xl p-5 bg-[rgba(239,239,239,0.65)] flex flex-col items-start gap-2 shadow"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <h3 className="text-lg font-semibold">{project.name}</h3>

                    <div className="flex items-center justify-end w-full mt-2">
                      <h5 className="text-xs font-medium">
                        {(project.overallProgress ?? project.completion) ?? 0}%
                      </h5>
                    </div>

                    <Progress
                      value={project.overallProgress ?? project.completion}
                      className="h-2 rounded-full w-full"
                    />

                    <div className="flex flex-col gap-2 w-full mt-2">
                      {(project.scopes ?? []).map((scope, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between w-full p-2 rounded-[5px] text-sm font-medium transition ${i === 0
                            ? "bg-[#e5e5e5]"
                            : i === 1
                              ? "bg-[#d6ffd6]"
                              : "bg-[#ddffff]"
                            }`}
                        >
                          <h3>{scope.name}</h3>
                          <p className="text-xs text-gray-700">
                            {scope.progress}%
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-[15px] bg-white/65 backdrop-blur-[8px] rounded-xl shadow mb-2"
        >
          <div className="flex items-center justify-between p-1.5">
            <h2 className="text-base font-bold">Completed Projects</h2>

            <div className="flex items-center gap-2">
              <button
                aria-label="Prev page"
                onClick={handleCompletedPrev}
                disabled={completedPage === 0}
                className={`rounded-full p-2 transition ${completedPage === 0
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-secondary/20 hover:bg-secondary/30"
                  }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                aria-label="Next page"
                onClick={handleCompletedNext}
                disabled={completedPage === completedTotalPages - 1}
                className={`rounded-full p-2 transition ${completedPage === completedTotalPages - 1
                  ? "opacity-40 cursor-not-allowed"
                  : "bg-secondary/20 hover:bg-secondary/30"
                  }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="overflow-hidden relative w-full">
            <AnimatePresence initial={false} custom={completedDirection}>
              <motion.div
                key={completedPage}
                custom={completedDirection}
                onAnimationComplete={() => setCompletedAnimating(false)}
                initial={
                  completedAnimating
                    ? {
                      x: completedDirection === "right" ? 300 : -300,
                      opacity: 0,
                    }
                    : { x: 0, opacity: 1 }
                }
                animate={{ x: 0, opacity: 1 }}
                exit={
                  completedAnimating
                    ? {
                      x: completedDirection === "right" ? -300 : 300,
                      opacity: 0,
                    }
                    : {}
                }
                transition={{ duration: completedAnimating ? 0.4 : 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-2"
              >
                {completedCurrentItems.map((project) => (
                  <motion.div
                    key={project.id}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer relative rounded-xl p-5 bg-[rgba(239,239,239,0.65)] flex flex-col items-start gap-2 shadow"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <h3 className="text-lg font-semibold">{project.name}</h3>

                    <div className="flex items-center justify-between w-full mt-3">
                      <button
                        type="button"
                        className="bg-[#3a7573] text-white rounded-[5px] px-2 py-1 flex items-center gap-2 text-[0.6rem] hover:scale-[1.02] transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadReport(project?.id);
                        }}
                      >
                        <DownloadCloud size={16} /> Download Report
                      </button>
                      <h5 className="text-xs font-medium">
                        {(project.overallProgress ?? project.completion) ?? 0}%
                      </h5>
                    </div>

                    <Progress
                      value={project.overallProgress ?? project.completion}
                      className="h-2 rounded-full w-full"
                    />

                    <div className="flex flex-col gap-2 justify-around h-full">
                      <div
                        className={`flex flex-col gap-2 w-full p-2 rounded-[5px] text-sm font-medium transition bg-[#e5e5e5]`}
                      >
                        Owner : {project.owner}
                      </div>
                      <div className="text-xs flex flex-col gap-2 w-full p-2 rounded-[5px] font-medium transition bg-[#e5e5e5] text-gray-700">
                        Auditor : {project.auditor}
                      </div>
                      <div className="text-xs flex flex-col gap-2 w-full p-2 rounded-[5px] font-medium transition bg-[#e5e5e5] text-gray-700">
                        Facility Name : {project.facility_name}
                      </div>
                    </div>

                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default ProjectOverview;
