"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Paperclip,
  Send,
  X,
  ChevronsUpDown,
  Check,
  Loader2,
  FileText,
  Users,
  Briefcase,
  Tag,
} from "lucide-react";
import axios from "@/lib/axios/axios";
import { cn } from "@/lib/utils";
import { getProjectId, getUserId } from "@/lib/jwt";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { toast } from "sonner";

type ProjectType = {
  project_name: string;
  project_id: number;
};

type UiUser = {
  id: string;
  name: string;
  role: string;
};

const NewRequestForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(false);
  const [projectId, setProjectId] = useState(getProjectId());
  const [userId, setUserId] = useState(getUserId());
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [requestType, setRequestType] = useState<string>("");
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [selectedProject, setSelectedProject] = useState<number>(0);
  const [availableUsers, setAvailableUsers] = useState<UiUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<UiUser | null>(null);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [userSearchOpen, setUserSearchOpen] = useState(false);

  async function fetchProjectNames(project_id: number) {
    try {
      const res = await axios.post("/getAllProjectsByFacilityID", { project_id });
      const templates: ProjectType[] = res?.data?.data?.templates || [];
      setProjects(templates);

      if (templates.length === 1) {
        setSelectedProject(templates[0].project_id);
      }
    } catch (e) {
      console.error("Error fetching projects:", e);
    }
  }

  async function fetchUsers(projectId: number) {
    if (!projectId) return;
    setIsFetchingUsers(true);
    try {
      const res = await axios.post("/get_available_users_for_project_team", {
        p_project_id: Number(projectId),
      });

      if (res.data?.issuccessful) {
        const formatted = res.data.data.templates.map((u: any) => ({
          id: String(u.user_id),
          name: u.full_name,
          role: u.role_name,
        }));
        setAvailableUsers(formatted);
      } else {
        setAvailableUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setIsFetchingUsers(false);
    }
  }

  useEffect(() => {
    setProjectId(getProjectId());
    setUserId(getUserId());
    fetchProjectNames(projectId);
  }, []);

  useEffect(() => {
    if (selectedProject) {
      setSelectedUser(null);
      fetchUsers(selectedProject);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (requestType === "activity" || requestType === "emission") {
      setSelectedUser({ id: "14", name: "Carbon Scan Helpdesk", role: "Support" });
    } else {
      setSelectedUser(null);
    }
  }, [requestType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  async function handleSubmit() {
    if (!title.trim() || !selectedProject || !selectedUser) return;

    setIsLoading(true);
    if (!userId) {
      console.error("Invalid user token.");
      setIsLoading(false);
      return;
    }
    let fixeduserId;
    if (requestType === "activity" || requestType === "emission") {
      fixeduserId = 14;
    }
    try {
      const form = new FormData();
      form.append("p_creator_id", userId.toString());
      form.append("p_project_id", String(selectedProject));
      form.append("p_request_type", requestType || "others");
      form.append("p_title", title);
      form.append("p_description", desc);
      form.append("p_assignee_id", fixeduserId?.toString() ?? selectedUser.id);
      if (file) {
        form.append("p_file_url", file);
      }
      form.append("p_file_name", "");
      form.append("p_file_size", "");

      await axios.post("/create_new_project_request_with_file", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setDesc("");
      setFile(null);
      setSelectedUser(null);
      toast.success("Request submitted successfully!");
    } catch (e) {
      console.error("Error submitting:", e);
      toast.error("Failed to submit request.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        <aside className="w-full md:w-80 bg-gray-50 border-r border-gray-200 p-6 flex flex-col gap-6">
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight text-gray-900">New Request</h2>
            <p className="text-xs text-gray-500">Configure your request details below.</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Briefcase className="w-3 h-3" /> Project
            </Label>
            <Popover open={projectDropdownOpen} onOpenChange={setProjectDropdownOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "w-full justify-between bg-white hover:bg-gray-50 border-gray-300",
                    !selectedProject && "text-muted-foreground"
                  )}
                >
                  {selectedProject
                    ? projects.find((p) => p.project_id === selectedProject)?.project_name
                    : "Select project..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search project..." />
                  <CommandList>
                    <CommandEmpty>No project found.</CommandEmpty>
                    <CommandGroup>
                      {projects.map((project) => (
                        <CommandItem
                          key={project.project_id}
                          value={project.project_name}
                          onSelect={() => {
                            setSelectedProject(project.project_id);
                            setProjectDropdownOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary",
                              selectedProject === project.project_id ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {project.project_name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-3 h-3" /> Type
            </Label>
            <Select value={requestType} onValueChange={(v) => setRequestType(v)}>
              <SelectTrigger className="w-full bg-white border-gray-300">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activity">Add Activity</SelectItem>
                <SelectItem value="emission">Emission Factors</SelectItem>
                <SelectItem value="data required">Data Required</SelectItem>
                <SelectItem value="Clarification needed">Clarification Needed</SelectItem>
                <SelectItem value="Review Needed">Review Needed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3 flex-1">
            <Label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <Users className="w-3 h-3" /> Receiver
            </Label>

            {/* Receiver locked for Activity / Emission */}
            {requestType === "activity" || requestType === "emission" ? (
              <div className="w-full min-h-[42px] rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm shadow-sm flex items-center justify-between cursor-not-allowed opacity-80">
                <span className="font-medium text-gray-800">Carbon Scan Helpdesk</span>
              </div>
            ) : (
              <Popover open={userSearchOpen} onOpenChange={setUserSearchOpen}>
                <PopoverTrigger asChild>
                  <div
                    className={cn(
                      "w-full min-h-[42px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors cursor-pointer hover:bg-gray-50",
                      "flex items-center justify-between"
                    )}
                  >
                    {selectedUser ? (
                      <span className="font-medium text-gray-800">{selectedUser.name}</span>
                    ) : (
                      <span className="text-muted-foreground select-none">Select team member...</span>
                    )}

                    <div className="flex items-center gap-1">
                      {selectedUser && (
                        <div
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUser(null);
                          }}
                          className="p-1 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </div>
                      )}
                      <ChevronsUpDown className="h-4 w-4 opacity-50 text-gray-500" />
                    </div>
                  </div>
                </PopoverTrigger>

                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command shouldFilter={false}>
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                      {isFetchingUsers && (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                          Loading users...
                        </div>
                      )}

                      {!isFetchingUsers && availableUsers.length === 0 && (
                        <CommandEmpty>No users available for this project.</CommandEmpty>
                      )}

                      <CommandGroup className="max-h-64 overflow-y-auto">
                        {availableUsers.map((u) => {
                          const isSelected = selectedUser?.id === u.id;
                          return (
                            <CommandItem
                              key={u.id}
                              value={u.name}
                              onSelect={() => {
                                setSelectedUser(u);
                                setUserSearchOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 text-primary",
                                  isSelected ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span>{u.name}</span>
                                <span className="text-[10px] text-gray-400">{u.role}</span>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col p-8 relative">
          <div className="flex flex-col gap-6 flex-1">
            <div className="space-y-2">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What is this request about?"
                className="text-2xl md:text-3xl font-bold border-none shadow-none px-0 placeholder:text-gray-300 focus-visible:ring-0 h-auto bg-transparent"
              />
              <Separator className="bg-gray-100" />
            </div>

            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe the details, objectives, and specific requirements here..."
              className="flex-1 resize-none border-none focus-visible:ring-0 shadow-none p-0 text-base leading-7 text-gray-700 placeholder:text-gray-300 -ml-1"
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100">

            <div className="flex-1 w-full">
              <AnimatePresence mode="wait">
                {file ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-sm w-fit border border-blue-100"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="max-w-[200px] truncate font-medium">{file.name}</span>
                    <button
                      onClick={() => setFile(null)}
                      className="ml-2 hover:bg-blue-200 p-1 rounded-full transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </motion.div>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                    asChild
                  >
                    <label className="cursor-pointer">
                      <Paperclip className="mr-2 h-4 w-4" />
                      Attach File
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </Button>
                )}
              </AnimatePresence>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isLoading || !title || !selectedProject || !selectedUser}
              className="w-full sm:w-auto min-w-[140px] shadow-lg shadow-blue-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default NewRequestForm;
