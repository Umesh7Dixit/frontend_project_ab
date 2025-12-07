"use client";

import TemplateHeader from "@/features/projects/templates/list/TemplateHeader";
import TemplateItem from "@/features/projects/templates/list/TemplateItem";
import InfoDrawer from "@/features/projects/templates/list/InfoDrawer";
import { useRouter, useSearchParams } from "next/navigation";
import LayoutWrapper from "@/components/layout/sidebar";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios/axios";
import { Template } from "@/types";
import { getUserId } from "@/lib/jwt";

interface UsageMap {
  [key: number]: number;
}

const ProjectTemplatePage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [usageMap, setUsageMap] = useState<UsageMap>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<Template | null>(null);
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);

  const fetchTemplates = async () => {
    const industry = searchParams.get("industry");
    if (!industry) return;

    try {
      const response = await axios.post("/templates/list", {
        user_id: getUserId(),
        industry: decodeURIComponent(industry),
      });

      if (response.data.issuccessful) {
        setTemplates(response.data.data.templates);
        fetchUsage(response.data.data.templates.map((t: Template) => t.template_id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsage = async (ids: number[]) => {
    const industry = decodeURIComponent(searchParams.get("industry") || "");

    try {
      const res = await axios.post("/get_template_usage_percentage", { industry });
      if (res.data.issuccessful) {
        const updatedMap: UsageMap = {};
        res.data.data.templates.forEach((t: any) => {
          updatedMap[t.template_id] = parseFloat(t.usage_percentage);
        });
        setUsageMap(updatedMap);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <LayoutWrapper>
      <div className="flex flex-col gap-4">
        <TemplateHeader
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onCreate={() =>
            router.push("/project/1/data-collection?scope=1&templateId=1")
          }
        />

        {infoDrawerOpen && (
          <InfoDrawer
            open={infoDrawerOpen}
            onClose={setInfoDrawerOpen}
            selectedItem={selectedItem}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {templates.length > 0 ? (
            templates.map((t, i) => (
              <TemplateItem
                key={i}
                template={t}
                usagePercentage={usageMap[t.template_id] ?? 0}
                setInfoDrawerOpen={setInfoDrawerOpen}
                setSelectedItem={setSelectedItem}
              />
            ))
          ) : (
            <div className="flex items-center w-full col-span-3 justify-center min-h-screen text-gray-500 text-center">
              No templates found
            </div>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default ProjectTemplatePage;
