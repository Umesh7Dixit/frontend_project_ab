"use client";

import React, { useState, useMemo, useEffect } from "react";
import { ChevronRight, Clock, MoreHorizontal } from "lucide-react";
import { ActionValue } from "../main-page/utils";
import ProjectActionModal from "../main-page/ProjectActionModal";
import ProjectDetailsModal from "../main-page/ProjectDetailsModal";
import { fetchTasks, Task } from "./utils";
import TaskHeader from "./TaskHeader";
import { motion } from "motion/react";
import { userId } from "@/lib/jwt";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";


const TasksPage = () => {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Task | null>(null);
  const [openActionModal, setOpenActionModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const filtered = useMemo(() => {
    return tasks
      .filter((t) =>
        t.project_name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        const dA = new Date(a.last_updated_at).getTime();
        const dB = new Date(b.last_updated_at).getTime();
        return sortAsc ? dA - dB : dB - dA;
      });
  }, [search, tasks, sortAsc]);

  const handleCardClick = (task: Task) => {
    setSelectedProject(task);
    setOpenModal(false);
    setOpenActionModal(true);
  };

  const handleEllipsisClick = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    setSelectedProject(task);
    setOpenActionModal(false);
    setOpenModal(true);
  };

  useEffect(() => {
    fetchTasks(userId, "Open").then(setTasks);
  }, []);

  return (
    <div className="h-full flex space-y-4 flex-col">
      <TaskHeader
        search={search}
        setSearch={setSearch}
        sortAsc={sortAsc}
        onToggleSort={() => setSortAsc(!sortAsc)}
      />

      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              key={item.task_id}
              onClick={() => handleCardClick(item)}
              className="group relative flex flex-col p-4 rounded-2xl shadow-sm bg-white/90 hover:shadow-lg cursor-pointer overflow-hidden"
            >
              <div className="absolute top-1 right-1 z-10">
                <button
                  onClick={(e) => handleEllipsisClick(e, item)}
                  className="p-1.5 hover:bg-gray-100 text-gray-400 rounded-full"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">
                  {item.project_name}
                </h3>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-100 text-amber-700 border border-orange-100/50">
                    {ActionValue(item.request_type)}
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-2 flex items-center justify-between text-xs font-medium text-gray-400 group-hover:text-gray-500 transition-colors">
                <div className="flex items-center gap-1.5">
                  <Clock size={16} className="text-gray-300" />
                  {formatDistanceToNow(new Date(item.last_updated_at), { addSuffix: true })}
                </div>
                <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-primary" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {openActionModal && (
        <ProjectActionModal
          open={openActionModal}
          onOpenChange={setOpenActionModal}
          project={selectedProject}
        />
      )}

      {openModal && (
        <ProjectDetailsModal
          open={openModal}
          onOpenChange={setOpenModal}
          project={selectedProject}
        />
      )}
    </div>
  );
};

export default TasksPage;
