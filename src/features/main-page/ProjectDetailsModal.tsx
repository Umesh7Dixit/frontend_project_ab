"use client";

import { motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";
import { Task } from "../tasks/utils";
import { useEffect, useState } from "react";
import { getProjectProgress } from "../carbon-accounting/dashboard/utils";

interface ProjectDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Task | null;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  open,
  onOpenChange,
  project,
}) => {
  if (!project) return null;

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };
  
  const [progress, setProgress] = useState<{
    scope1: number;
    scope2: number;
    scope3: number;
    overall: number;
    overall_status: string;
  } | null>(null);

  const scopes = [
    { label: "Scope 1", value: progress?.scope1 ?? 0 },
    { label: "Scope 2", value: progress?.scope2 ?? 0 },
    { label: "Scope 3", value: progress?.scope3 ?? 0 },
  ];

  useEffect(() => {
    async function fetchProgress() {
      if (!project) return;
      try {
        const prj = await getProjectProgress(project.project_id);
        setProgress(prj);
      } catch (e) {
        console.error(e);
      }
    }
    fetchProgress();
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden rounded-2xl shadow-2xl">
        <DialogHeader className="bg-gray-50/50 border-b border-gray-100 sticky top-0 z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between"></div>
            <DialogTitle className="text-2xl font-bold text-gray-900 tracking-tight leading-snug">
              {project.project_name}
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{project.topic}</span>
              <span className="text-gray-300">•</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="grid grid-cols-2 gap-4"
          >
            <div className="flex flex-col gap-1.5 p-2 border rounded-xl  bg-gray-50">
              <span className="text-xs font-medium text-gray-400">Owner</span>
              <div className="flex items-center gap-2">
                <Avatar className="size-7">
                  <AvatarFallback className="text-[10px]">{getInitials(project.created_by_name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-900">{project.created_by_name}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-2 border rounded-xl  bg-gray-50">
              <span className="text-xs font-medium text-gray-400">Status</span>
              <div className="flex items-center gap-2 text-gray-900">
                <span className="text-sm font-medium">Verification In Progress</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-100 text-blue-700">{progress ? `${progress.overall}%` : "—"}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-2 rounded-xl border  bg-gray-50">
              <span className="text-xs font-medium text-gray-400">Created</span>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{formatDate(project.created_at)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 p-2 rounded-xl border bg-gray-50">
              <span className="text-xs font-medium text-gray-400">Last Activity</span>
              <div className="flex items-center gap-2 text-gray-900">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">{formatDate(project.last_updated_at)}</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-2">
            {scopes.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                className="flex p-2 rounded-xl border bg-gray-50 flex-col gap-2"
              >
                <span className="text-xs font-medium text-gray-500">{s.label}</span>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.value}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-green-600 rounded-full"
                  />
                </div>
                <span className="text-xs text-gray-500 text-right">
                  {s.value}%
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;