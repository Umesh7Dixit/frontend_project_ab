"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sections } from "@/schema/new-project-fields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios/axios";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useUser } from "@/lib/context/EntriesContext";

interface SaveTemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templateData: {
    name: string;
    description: string;
    scopes: string[];
  };
  onConfirm: () => void;
}

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  open,
  onOpenChange,
  templateData,
  onConfirm,
}) => {
  const [name, setName] = useState(templateData.name || "");
  const [description, setDescription] = useState(templateData.description || "");
  const [industry, setIndustry] = useState<string>("Manufacturing & Heavy Industry");

  useEffect(() => {
    if (open) {
      setName(templateData.name || "");
      setDescription(templateData.description || "");
      setIndustry("");
    }
  }, [open]);

  const { scopedEntries } = useUser();
  const handleConfirm = async () => {
    try {
      const userInfo = Cookies.get("user_data");
      const p_creator_user_id = userInfo ? JSON.parse(userInfo).user_id : null;
      const dataToSend = scopedEntries.map((entry: any) => {
        const { id, ...rest } = entry;
        return rest;
      });
      const payload = {
        p_creator_user_id,
        p_template_name: name,
        p_description: description,
        p_industry: industry,
        p_template_payload: JSON.stringify(dataToSend),
      };
      const response = await axios.post('/create_custom_template_from_scratch', payload);
      if (response.data?.issuccessful) toast.success("Template saved successfully");
      else toast.error("Failed to save template");
      onConfirm();
    } catch (error) {
      console.error("Error saving template", error);
    }
  };

  const industryField = sections.find((sec) => sec.id === "basic")?.fields.find((f) => f.name === "industry");
  const industryOptions =
    industryField && industryField.type !== "table"
      ? industryField.options ?? []
      : [];

  const canConfirm = name.trim() !== "" && description.trim() !== "" && industry !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Save Template</DialogTitle>
          <DialogDescription>
            Please edit the template details before saving.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200">
            <label className="text-sm text-gray-500 mb-1" htmlFor="template-name">Template Name</label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </div>

          <div className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200">
            <label className="text-sm text-gray-500 mb-1" htmlFor="template-description">Description</label>
            <Input
              id="template-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="p-4 rounded-xl bg-white/60 backdrop-blur-md border border-gray-200">
            <label className="text-sm text-gray-500 mb-2" htmlFor="industry-select">Industry</label>
            <Select onValueChange={(v) => {
              const selected = industryOptions.find((i: any) => i.value === v);
              if (!selected) return;
              setIndustry(v);
            }}
              value={industry} name="industry" >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="rounded-full px-6 bg-secondary hover:bg-secondary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateModal;
