"use client";

import { motion } from "motion/react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileModal from "./ProfileModal";
import { useState, useEffect } from "react";
import ManageTeam, { UiUser } from "./ManageTeam";
import { useUser } from "@/lib/context/EntriesContext";

type ActivityPanelProps = {
  originalSnapshot: Map<string, UiUser>;
  projectId?: number;
  membersMap?: Map<string, UiUser>;
  currentUserRole?: string;
  setMembersMap?: (map: Map<string, UiUser>) => void;
  setOriginalSnapshot?: (map: Map<string, UiUser>) => void;
};

export default function ActivityPanel({ originalSnapshot, membersMap, projectId, currentUserRole, setMembersMap, setOriginalSnapshot }: ActivityPanelProps) {
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [AddRemoveModalOpen, setAddRemoveModalOpen] = useState(false);
  const [team, setTeam] = useState<Map<string, UiUser>>(membersMap || new Map());
  const { isViewer } = useUser();

  useEffect(() => {
    setTeam(new Map(membersMap));
  }, [membersMap]);

  const handleCardClick = (user: any) => {
    setSelectedUser(user);
    setOpen(true);
  };
  
  const handleTeamUpdate = (updatedMap: Map<string, UiUser>) => {
    setTeam(new Map(updatedMap));
    setOriginalSnapshot?.(new Map(updatedMap));
    if (setMembersMap) setMembersMap(new Map(updatedMap));
  };


  const mainTeam = Array.from(team.values()).filter(
    (u) => u.role === "Owner" || u.role === "Member"
  );
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-2xl p-4 md:p-6 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:ring-1 hover:ring-white/20 transition h-fit"
    >
      {selectedUser && (
        <ProfileModal open={open} onOpenChange={setOpen} user={selectedUser} />
      )}
      {AddRemoveModalOpen && (
        <ManageTeam
          open={AddRemoveModalOpen}
          onOpenChange={setAddRemoveModalOpen}
          originalSnapshot={originalSnapshot}
          projectId={projectId ?? 0}
          setOriginalSnapshot={setOriginalSnapshot}
          onUpdated={handleTeamUpdate}
        />
      )}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
        <h3 className="text-base font-semibold text-[#0b1f1d] flex flex-col">
          Team Members
          <span className="text-[11px] text-[#6b7280] font-normal">
            Manage who can access this project
          </span>
        </h3>
        <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
          {
            currentUserRole !== "Viewer" && !isViewer && (
              <Button
                size="sm"
                className="text-xs bg-[#0b1f1d]/90"
                onClick={() => setAddRemoveModalOpen(true)}
                disabled={isViewer || currentUserRole === "Viewer"}
              >
                <PlusIcon className="h-4 w-4" />
                <span className="ml-1.5">Add / - Remove</span>
              </Button>
            )
          }
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {mainTeam.map((item, i) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1, delay: i * 0.06 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleCardClick(item)}
            className="rounded-xl p-3 bg-white/5 backdrop-blur-xl shadow-md hover:shadow-lg hover:ring-1 hover:ring-white/20 transition cursor-pointer flex flex-col items-center text-center"
          >
            <div className="size-14 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center mb-2">
              <span className="text-emerald-700 font-bold text-lg">
                {item.name[0]}
              </span>
            </div>

            <p className="text-sm font-medium text-[#0b1f1d] leading-tight">
              {item.name}
            </p>

            <p className="text-xs text-[#6b7280] mt-0.5">
              {item.role}
            </p>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}
