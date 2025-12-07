"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

import axios from "@/lib/axios/axios";
import { toast } from "sonner";
import { motion } from "motion/react";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Trash2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export type roles =
  | "viewer"
  | "editor"
  | "Owner"
  | "Member"
  | "Internal Auditor"
  | "External Auditor";

export type UiUser = {
  id: string;
  name: string;
  role: roles;
  role_name?: "Member" | "Owner";
  permission_level?: string;
  isProjectMember: boolean;
};

export type ApiMember = {
  user_id: number;
  full_name: string;
  role_name: string;
  permission_level?: string;
};

export type ApiListResponse = {
  issuccessful: boolean;
  message?: string;
  data: {
    templates: ApiMember[];
    count: number;
  };
};
type Props = {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  projectId: number;
  originalSnapshot: Map<string, UiUser>;
  setOriginalSnapshot?: (map: Map<string, UiUser>) => void;
  onUpdated: (m: Map<string, UiUser>) => void;
}
export default function ManageTeam({
  open,
  onOpenChange,
  originalSnapshot,
  projectId,
  onUpdated,
  setOriginalSnapshot,
}: Props) {
  const [availableUsers, setAvailableUsers] = useState<UiUser[]>([]);
  const [hasFetchedAvailable, setHasFetchedAvailable] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<UiUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<Map<string, UiUser>>(new Map(originalSnapshot));
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedUsers(new Map(originalSnapshot));
  }, [originalSnapshot]);

  const fetchAvailableUsers = async () => {
    if (hasFetchedAvailable) return;
    const res = await axios.post("/get_available_users_for_project_team", {
      p_project_id: Number(projectId),
    });
    if (res.data?.issuccessful) {
      const formatted = res.data.data.templates.map((u: any) => ({
        id: String(u.user_id),
        name: u.full_name,
        role: u.role_name as roles,
        isProjectMember: false,
      }));
      setAvailableUsers(formatted);
      setHasFetchedAvailable(true);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    if (!value.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    const term = value.toLowerCase().trim();
    setIsSearching(true);
    setSearchResults(
      availableUsers.filter((u) => u.name.toLowerCase().includes(term))
    );
  };

  const addUser = (user: UiUser) => {
    setSelectedUsers((prev) => {
      const m = new Map(prev);
      // Force role to Member so it shows up in ActivityPanel, use separate permission_level
      m.set(user.id, { ...user, isProjectMember: true, role: "Member", permission_level: "viewer" });
      return m;
    });
    setSearch("");
    setIsSearching(false);
    setSearchResults([]);
  };

  const changeRole = (id: string, permission_level: string) =>
    setSelectedUsers((prev) => {
      const m = new Map(prev);
      const u = m.get(id);
      if (!u) return prev;
      m.set(id, { ...u, permission_level });
      return m;
    });

  const markForDeletion = (id: string) => setDeleteId(id);

  const confirmRemove = () => {
    if (!deleteId) return;
    setSelectedUsers((prev) => {
      const m = new Map(prev);
      m.delete(deleteId);
      return m;
    });
    setDeleteId(null);
  };
  const handleSave = async () => {
    setSaving(true);
    const selected = Array.from(selectedUsers.values());
    const additions = selected.filter((u) => !originalSnapshot.has(u.id));
    const updates = selected.filter((u) => {
      const prev = originalSnapshot.get(u.id);
      return prev && prev.permission_level !== u.permission_level;
    });
    const removals = Array.from(originalSnapshot.values()).filter(
      (o) => !selectedUsers.has(o.id)
    );

    try {
      for (const u of removals)
        await axios.post("/remove_member_from_project", {
          p_project_id: Number(projectId),
          p_user_id: Number(u.id),
        });

      for (const a of additions)
        await axios.post("/add_new_member_to_project", {
          p_project_id: Number(projectId),
          p_user_id: Number(a.id),
          p_role_name: 'Member',
          p_permission_level: a.permission_level || 'viewer'
        });

      for (const u of updates)
        await axios.post("/update_project_member_permission", {
          p_project_id: Number(projectId),
          p_member_user_id: Number(u.id),
          p_new_permission_level: u.permission_level === "Owner" ? 3 : u.permission_level === "editor" ? 2 : 1,
        });
      if (setOriginalSnapshot) {
        setOriginalSnapshot(new Map(selectedUsers));
      }
      toast.success("Changes saved");
      onUpdated(selectedUsers);
    } catch {
      toast.error("Failed to save changes");
    }

    setSaving(false);
    onOpenChange(false);
  };

  const selectedList = useMemo(
    () => Array.from(selectedUsers.values()),
    [selectedUsers]
  );
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl p-4 space-y-4">
          <DialogHeader>
            <DialogTitle>Manage Team</DialogTitle>
            <DialogDescription>Select users to add/update.</DialogDescription>
          </DialogHeader>

          <Input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={fetchAvailableUsers}
            placeholder="Search users..."
          />

          {isSearching ? (
            <div className="max-h-[250px] overflow-y-auto space-y-2">
              {searchResults.map((u) => (
                <div
                  key={u.id}
                  onClick={() => addUser(u)}
                  className="p-2 bg-white border rounded flex justify-between cursor-pointer hover:bg-gray-50"
                >
                  <span>{u.name}</span>
                  <span className="text-xs text-gray-500">Add</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="max-h-[350px] overflow-y-auto space-y-2">
              {selectedList.map((u) => (
                <motion.div
                  key={u.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-3 bg-white border rounded"
                >
                  <Checkbox checked />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{u.name}</p>
                  </div>
                  <Select
                    value={u.permission_level}
                    onValueChange={(v) => changeRole(u.id, v as roles)}
                  >
                    <SelectTrigger className="min-w-[100px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => markForDeletion(u.id)}
                    className="p-1 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {!isSearching && (
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button disabled={saving} onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the selected user.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemove}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
