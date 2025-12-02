"use client";

import TemplateHeader from "@/features/projects/templates/list/TemplateHeader";
import TemplateItem from "@/features/projects/templates/list/TemplateItem";
import InfoDrawer from "@/features/projects/templates/list/InfoDrawer";
import { useRouter, useSearchParams } from "next/navigation";
import LayoutWrapper from "@/components/layout/sidebar";
import React, { useEffect, useState } from "react";
import axios from "@/lib/axios/axios";
import { Template } from "@/types";
import { orgId } from "@/lib/jwt";


const ProjectTemplatePage: React.FC = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<Template | null>(null);
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const searchParams = useSearchParams();

  const fetchTemplates = async () => {
    const industry = searchParams.get("industry");
    if (!industry) {
      console.error("Industry not found in URL");
      return;
    }

    try {
      const payload = {
        org_id: orgId,
        industry: decodeURIComponent(industry)
      };
      const response = await axios.post("/templates/list", payload);
      const data = response.data;
      if (data.issuccessful) {
        setTemplates(data.data.templates);
      } else {
        console.error("Failed to fetch templates:", data.message);
      }
    } catch (err) {
      console.error("Error fetching templates:", err);
    }
  };
  // Fetch templates on load
  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <LayoutWrapper>
      <div className="flex flex-col gap-4">
        <TemplateHeader
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onCreate={() => router.push("/project/1/data-collection?scope=1&templateId=1")}
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
                setInfoDrawerOpen={setInfoDrawerOpen}
                setSelectedItem={setSelectedItem}
              />

            ))
          ) : (
            <div className="flex items-center w-full col-span-3 justify-center min-h-screen text-gray-500 text-center">No templates found</div>
          )}

        </div>
      </div>
    </LayoutWrapper>
  );
};

export default ProjectTemplatePage;
