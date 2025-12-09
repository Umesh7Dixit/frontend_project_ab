"use client";

import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Send, Paperclip, X, FileText, Loader2, User } from "lucide-react";
import { Task, TaskConv, getTaskConv, addTaskComment, getTaskHeader, TaskHeader, approveDecision } from "../tasks/utils";
import { getUserId, userId } from "@/lib/jwt";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { getProjectProgress } from "../carbon-accounting/dashboard/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProjectActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Task | null;
}

const ProjectActionModal: React.FC<ProjectActionModalProps> = ({
  open,
  onOpenChange,
  project,
}) => {
  const [comments, setComments] = useState<TaskConv[]>([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [taskHeader, setTaskHeader] = useState<TaskHeader | null>(null);
  const router = useRouter();
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [comments]);

  // useEffect(() => {
  //   if (!project) return;
  //   async function fetchProgress() {
  //     if (!project) return;
  //     try {
  //       const prj = await getProjectProgress(project.project_id);
  //       // setProgress(prj.overall);
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }
  //   fetchProgress();
  // }, []);

  if (!project) return null;

  const handleSubmit = async () => {
    if (!text.trim() && !file) return;
    const tempId = Math.random().toString();
    const optimisticComment: any = {
      created_at: new Date().toISOString(),
      created_by_name: "You",
      comment_text: text,
      p_task_conv_id: tempId,
      created_by: userId,
    };

    setComments((prev) => [...prev, optimisticComment]);
    setText("");
    const currentFile = file;
    setFile(null);

    const payload = {
      p_task_id: project.task_id,
      p_user_id: userId,
      p_comment_text: optimisticComment.comment_text,
      p_file_name: currentFile?.name || null,
      p_file_url: null,
      p_file_size: currentFile?.size || null,
    };
    await addTaskComment(payload);
    getTaskConv(project.task_id).then(setComments);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  const handleApproval = async () => {
    const payload = {
      p_project_id: project.project_id,
      p_approver_id_user_id: getUserId(),
      p_decision: "Approve",
      p_remarks: null
    }
    try {
      setLoading(true);
      const res = await approveDecision(payload);
      if (res.data?.issuccessful) {
        toast.success("Approval decision recorded successfully.");
      }
    } catch (error) {
      console.error("Error recording approval decision:", error);
    } finally {
      setLoading(false);
    }
  }
  function handleNavigation(path: string) {
    const id = project?.project_id;
    if (!id) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("projectId", id.toString());
    }
    router.push(path.includes("{id}") ? path.replace("{id}", id.toString()) : path);
  }
  function handleDetailedInfo() {
    handleNavigation(`/project/{id}/data-control`);
  }
  function handleRaiseRequest() {
    handleNavigation("/requests/raise-request");
  }

  const step = (() => {
    if (taskHeader?.task_type === "data required") return 0;
    if (taskHeader?.task_type === "Clarification needed") return 1;
    if (taskHeader?.task_type === "Review Needed") return 2;
    // return 3;
  })();

  useEffect(() => {
    if (!project) return;
    setLoading(true);
    getTaskHeader(project.task_id).then((res: TaskHeader) => setTaskHeader(res));
    getTaskConv(project.task_id)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [project]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-2 gap-0 overflow-hidden bg-white rounded-2xl border border-gray-100 shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight">
                {project.project_name}
              </DialogTitle>
              {taskHeader && (
                <div className="px-6 py-3 border-b border-gray-100 bg-primary/5">
                  <Badge className="text-xs">
                    {taskHeader.task_title}{" "}
                  </Badge>
                  <span className="text-gray-700 font-medium">— {taskHeader.created_by_name}</span>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        {
          step === 1 && (
            <>
              <ScrollArea className="h-[300px] w-full bg-white px-6 py-4">
                <div className="flex flex-col gap-6">
                  {loading ? (
                    <div className="flex h-40 items-center justify-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin" />
                    </div>
                  ) : comments.length > 0 ? (
                    comments.map((c, index) => {
                      const isMe = String(c.user_id) === String(userId);
                      const fullName = c.user_name || "";
                      const parts = fullName.trim().split(/\s+/);
                      const first = parts[0] || "";
                      const last = parts.length > 1 ? parts[parts.length - 1] : "";
                      const initials = `${first[0] || ""}${last[0] || ""}`.toUpperCase();
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          key={index}
                          className={`flex gap-3 w-full ${isMe ? "flex-row-reverse" : "flex-row"}`}
                        >
                          <Avatar className="w-8 h-8 border border-gray-100 bg-primary shadow-sm mt-1">
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className={`flex flex-col max-w-[80%] ${isMe ? "items-end" : "items-start"}`}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-gray-700">
                                {isMe ? "You" : c.user_name}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {c.created_at ? formatDistanceToNow(new Date(c.created_at), { addSuffix: true }) : ""}
                              </span>
                            </div>

                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm leading-relaxed ${isMe
                                ? " bg-primary text-white rounded-tr-sm"
                                : "bg-gray-200 text-gray-800 rounded-tl-sm"
                                }`}
                            >
                              {c.comment_text}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-60 mt-20">
                      <div className="p-3 bg-gray-50 rounded-full">
                        <User className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No discussions yet. Start the conversation!</p>
                    </div>
                  )}
                  <div ref={scrollRef} />
                </div>
              </ScrollArea>
              <div className="p-4 bg-white border-t border-gray-100">
                <AnimatePresence>
                  {file && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-3 bg-accent border px-3 py-2 rounded-lg text-sm w-fit">
                        <FileText className="w-4 h-4" />
                        <span className="max-w-[200px] truncate font-medium">{file.name}</span>
                        <button
                          onClick={() => setFile(null)}
                          className="hover:bg-primary rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative flex items-end gap-2 bg-gray-50 p-2 rounded-xl border">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg shrink-0 mb-0.5"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-4 h-4" />
                  </Button>

                  <Textarea
                    placeholder="Reply..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="min-h-[44px] max-h-[120px] w-full resize-none border-0 bg-transparent p-2.5 focus-visible:ring-0 text-sm placeholder:text-gray-400 shadow-none"
                    rows={1}
                  />

                  <Button
                    size="icon"
                    className={`h-9 w-9 shrink-0 rounded-lg transition-all duration-200 mb-0.5 ${text.trim() || file ? "bg-[#0b1f1d]/90" : "bg-gray-300 hover:bg-gray-300 cursor-not-allowed"
                      }`}
                    onClick={handleSubmit}
                    disabled={!text.trim() && !file}
                  >
                    <Send className="w-4 h-4 text-white ml-0.5" />
                  </Button>
                </div>
                <div className="text-center">
                  <Link className="text-center" href={`/requests/raise-request`}>
                    <Button variant="link" className="text-xs">
                      Detailed Info
                    </Button>
                  </Link>
                  <div className="text-[10px] text-gray-400 text-right pr-1">
                    Press <span className="font-semibold">Enter</span> to send
                  </div>
                </div>
              </div>
            </>
          )
        }
        {step === 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            {/* <p className="text-sm font-medium text-gray-700">
              Transport data for June is missing. Please check it.
            </p> */}
            <Button onClick={handleDetailedInfo} className="mt-3">Take Action</Button>
          </div>
        )}

        {step === 2 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex flex-col gap-3">
            <p className="text-sm font-medium text-gray-700">
              Review CBAM report submission
            </p>
            <div className="flex gap-3">
              <Button onClick={handleApproval} className="bg-emerald-600 hover:bg-emerald-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : "Approve"}
              </Button>
              <Button onClick={handleRaiseRequest} className="bg-emerald-600 hover:bg-emerald-700">
                Raise a request
              </Button>
              <Button variant="outline" onClick={handleDetailedInfo}>
                <FileText className="w-4 h-4 mr-1" /> Detailed Info
              </Button>
            </div>
          </div>
        )}

        {/* {step === 3 && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm font-medium text-gray-700">
              All steps completed. No pending actions.
            </p>
          </div>
        )} */}


      </DialogContent>
    </Dialog>

  );
};

export default ProjectActionModal;