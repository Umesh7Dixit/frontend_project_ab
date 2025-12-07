"use client";

import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import React from "react";
import { TextEllipsis } from "@/lib/helpers";
import { Eye, Info } from "lucide-react";
import { getProjectId } from "@/lib/jwt";
import axios from "@/lib/axios/axios";
import { Template } from "@/types";

interface TemplateItemProps {
  template: Template;
  usagePercentage: number;
  setInfoDrawerOpen: (v: boolean) => void;
  setSelectedItem: (row: Template) => void;
}

const TemplateItem: React.FC<TemplateItemProps> = ({
  template,
  usagePercentage,
  setInfoDrawerOpen,
  setSelectedItem,
}) => {
  const router = useRouter();
  const projectId = getProjectId();
  const { template_id, template_name, template_description, creator_name, created_at, is_public } = template;

  const type = is_public ? "Default" : "Custom";
  const badgeStyles =
    type === "Default"
      ? "bg-blue-50 text-blue-700 border-blue-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  async function copyToStaging(p_project_id: number, p_template_id: number) {
    try {
      await axios.post("/copy_template_to_staging_area", {
        p_project_id,
        p_template_id,
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      className="group relative flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
      onClick={async () => {
        await copyToStaging(projectId, Number(template_id));
        router.push(
          `/create-project/templates/${template_id}/preview?name=${encodeURIComponent(
            template_name
          )}`
        );
      }}
    >
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-3 mb-2">
          <div className="flex flex-col gap-2 min-w-0">
            <span
              className={`w-fit inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide border ${badgeStyles}`}
            >
              {type}
            </span>
            <h3
              className="font-semibold text-gray-900 text-base leading-snug truncate pr-2"
              title={template_name}
            >
              {template_name}
            </h3>
          </div>
          <button
            type="button"
            className="shrink-0 text-gray-400 hover:text-gray-600 p-1 -mr-2 -mt-1 rounded-full hover:bg-gray-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedItem(template);
              setInfoDrawerOpen(true);
            }}
          >
            <Info size={18} />
          </button>
        </div>

        <p className="text-sm text-gray-500 line-clamp-3 mb-4 flex-1 break-words leading-relaxed">
          {TextEllipsis(template_description, 120)}
        </p>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span className="truncate max-w-[120px]" title={creator_name}>
              {creator_name}
            </span>
            <span>{new Date(created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
          </div>

          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500 font-medium">Usage</span>
              <span className="text-gray-700 font-semibold">{usagePercentage}%</span>
            </div>
            <Progress
              value={usagePercentage}
              className="h-1.5 w-full bg-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-3 flex justify-center items-center text-primary text-sm font-medium border-t border-gray-100 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
        <Eye size={16} className="mr-2" />
        Preview
      </div>
    </div>
  );
};

export default TemplateItem;
