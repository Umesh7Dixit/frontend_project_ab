"use client";

import { FlowStep, FlowUser, ManageApprovalFlowProps, removeAuditor } from "./utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useUser } from "@/lib/context/EntriesContext";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { Plus, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import axios from "@/lib/axios/axios";
import { toast } from "sonner";
import { userId } from "@/lib/jwt";


export default function ManageApprovalFlow({ membersMap, projectId }: ManageApprovalFlowProps) {
  const [flow, setFlow] = useState<FlowStep[]>([
    { id: "submitted", label: "Submitted", fixed: true, participants: [] },
    { id: "approver", label: "Approver", fixed: false, participants: [] },
    { id: "pending", label: "Pending", fixed: false, participants: [] },
    { id: "approved", label: "Approved", fixed: true, participants: [] },
  ]);

  const defaultAuditor = useMemo(() => {
    if (!membersMap) return null;
    const filtered = Array.from(membersMap.values()).filter((u) => {
      const role = u.role.toLowerCase();
      return role === "internal auditor" || role === "external auditor";
    });
    if (filtered.length === 0) return null;
    const pick = filtered[0];
    return {
      id: pick.id,
      name: pick.name,
      role: pick.role.toLowerCase(),
    };
  }, [membersMap]);

  useEffect(() => {
    if (!defaultAuditor) return;
    setFlow((prev) =>
      prev.map((s) =>
        s.id === "approver" && s.participants.length === 0
          ? { ...s, participants: [defaultAuditor] }
          : s
      )
    );
  }, [defaultAuditor]);

  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<FlowUser[]>([]);
  const [auditors, setAuditors] = useState<FlowUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { isViewer } = useUser();

  const openModalForStep = (stepId: string) => {
    if (isViewer) return;
    setSelectedStep(stepId);
    setSelectedUserIds([]);
    setModalOpen(true);
  };

  const handleSaveParticipants = async () => {
    if (!selectedStep || selectedUserIds.length === 0) return;
    const picked = auditors.filter((a) => selectedUserIds.includes(a.id));
    try {
      await Promise.all(
        picked.map((p) =>
          axios.post("/add_new_member_to_project", {
            p_project_id: projectId,
            p_user_id: Number(p.id),
            p_role_name: p.role,
            p_permission_level: "viewer",
          })
        )
      );
      setFlow((prev) =>
        prev.map((step) =>
          step.id === selectedStep
            ? {
              ...step,
              participants: [
                ...step.participants,
                ...picked.filter(
                  (p) => !step.participants.some((existing) => existing.id === p.id)
                ),
              ],
            }
            : step
        )
      );
      setModalOpen(false);
      setSelectedStep(null);
    } catch {
      toast.error("Error adding participants. Please try again.");
      console.error("Error adding participants");
    }
  };

  const removeParticipant = async (stepId: string, auditorId: string) => {
    if (isViewer) return;
    const payload = {
      p_project_id: projectId,
      p_auditor_id: Number(auditorId),
      p_requester_id: Number(userId),
    }
    const { status, message } = await removeAuditor(payload);
    if (status) {
      toast.success("Auditor removed successfully");
      setFlow((prev) =>
        prev.map((step) =>
          step.id === stepId
            ? { ...step, participants: step.participants.filter((p) => p.id !== auditorId) }
            : step
        )
      );
    } else {
      toast.error(message || "Error removing auditor.");
    }
  };

  const fetchAuditors = async () => {
    try {
      const res = await axios.post("/search_auditors_to_add_to_project", {
        p_project_id: projectId,
      });
      const data = res.data?.data?.templates || [];
      const formatted = data.map((u: any) => ({
        id: String(u.user_id),
        name: u.full_name,
        role: u.role_name,
      }));
      setAuditors(formatted);
    } catch {
      setAuditors([]);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const term = search.toLowerCase();
    setSearchResults(auditors.filter((u) => u.name.toLowerCase().includes(term)));
  }, [search, auditors]);

  useEffect(() => {
    if (!modalOpen) return;
    fetchAuditors();
  }, [modalOpen]);

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="rounded-2xl p-4 md:p-6 bg-white/5 backdrop-blur-xl shadow-lg hover:shadow-xl h-fit"
      >
        <h3 className="text-sm font-semibold mb-4 text-gray-800">
          Approval Flow
        </h3>
        <div className="flex flex-col items-center">
          {flow.map((step, idx) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`text-xs font-medium mb-2 px-3 py-1 rounded-md ${step.fixed ? "bg-gray-200 text-gray-700" : "text-gray-600"}`}
              >
                {step.label}
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center">
                {step.participants.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2 bg-secondary border text-white p-1 rounded-full shadow-sm text-sm"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary  flex items-center justify-center text-xs font-semibold">
                      {p.name[0]}
                    </div>
                    <span>{p.name}</span>

                    {!isViewer && !step.fixed && (
                      <button
                        onClick={() => removeParticipant(step.id, p.id)}
                        className="rounded-full p-1 bg-red-50 text-red-500 transition"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </motion.div>
                ))}

                {!isViewer && !step.fixed && (
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-7 w-7 rounded-full border-cyan-300 text-cyan-600 hover:bg-cyan-100"
                    onClick={() => openModalForStep(step.id)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {idx < flow.length - 1 && (
                <div className="h-8 px-[1px] bg-gray-400 my-3" />
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {!isViewer && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Select User</DialogTitle>
            </DialogHeader>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search auditor…"
            />

            <div className="max-h-[260px] overflow-y-auto">
              <RadioGroup>
                <div className="flex flex-col gap-2">
                  {(isSearching ? searchResults : auditors).map((user) => {
                    const isSelected = selectedUserIds.includes(user.id);
                    return (
                      <label
                        key={user.id}
                        className={`flex items-center gap-2 p-1.5 border rounded-md hover:bg-gray-50 cursor-pointer ${isSelected && "bg-cyan-50 border-cyan-300"}`}
                        onClick={() =>
                          setSelectedUserIds((prev) =>
                            prev.includes(user.id)
                              ? prev.filter((id) => id !== user.id)
                              : [...prev, user.id]
                          )
                        }
                      >
                        <RadioGroupItem value={user.id} checked={isSelected} />
                        <div className="flex justify-between w-full">
                          <span className="text-sm font-medium">{user.name}</span>
                          <span className="text-xs text-gray-500">{user.role}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </RadioGroup>
            </div>

            <DialogFooter className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setModalOpen(false)}
                className="px-4"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveParticipants}
                disabled={selectedUserIds.length === 0}
                className="px-4 bg-cyan-600 text-white hover:bg-cyan-700"
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>

  );
}