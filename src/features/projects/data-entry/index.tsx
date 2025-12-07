"use client";

import type { ProjectMock, EmissionDataType, DataCollectionFetchParams } from "./utils";
import  { useEffect, useState } from "react";
import HeaderSection from "./DEHeader";
import CategoryTabs from "./CategoryTabs";
import EmissionTable from "./EmissionTable";
import DEFooter from "./DEFooter";
import DEUploadModal from "./DEUploadModal";
import PreviewInfoDrawer from "../templates/preview/PreviewInfoDrawer";
import { toast } from "sonner";
import { motion } from "motion/react";
import PreviewTableDrawer from "../data-collection/PreviewTableDrawer";
import { previewTableRows } from "../templates/preview/utils";
import { useSearchParams } from "next/navigation";
import ViewOrUploadModal from "./ViewOrUploadModal";
type Props = {
  initialData: ProjectMock;
};
import axios from "@/lib/axios/axios";
import { getProjectId, getViewer } from "@/lib/jwt";


export default function DataEntryPage({ initialData }: Props) {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isInfoDrawerOpen, setIsInfoDrawerOpen] = useState(false);
  const [openPreviewTable, setOpenPreviewTable] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [data, setData] = useState<ProjectMock>(initialData);
  const [emissionData, setEmissionData] = useState<EmissionDataType[]>([]);
  const currentScope = useSearchParams()?.get("scope") ?? 0;
  const [previewMode, setPreviewMode] = useState(false);
  const [viewUploadedFile, setViewUploadedFile] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const searchParams = useSearchParams();
  const projectId = getProjectId();
  const scope = Number(searchParams?.get("scope"));
  // handlers

  const onChangeValue = (rowId: number, periodKey: string, newVal: number) => {
    setEmissionData(prev =>
      prev.map(row =>
        row.project_activity_id === rowId
          ? {
            ...row,
            monthly_data: {
              ...row.monthly_data,
              [periodKey]: {
                ...row.monthly_data[periodKey],
                quantity: newVal
              }
            }
          }
          : row
      )
    );
  };


  const removeEntry = (id: string) => {
    setData((prev) => {
      const entries = prev.entries.filter((e) => e.id !== id);
      return {
        ...prev,
        entries,
        meta: { ...prev.meta, entryCount: entries.length },
      };
    });
    toast.success("Data removed successfully");
  };

  const clearAll = () => {
    setData((prev) => {
      const entries = prev.entries.map((e) => ({
        ...e,
        values: Object.fromEntries(Object.keys(e.values).map((k) => [k, 0])),
      }));
      return { ...prev, entries };
    });
  };

  async function fetchDataCollectionForScope(params: DataCollectionFetchParams) {
    try {
      const res = await axios.post("/get_data_collection_sheet_for_scope", params);
      const templates: EmissionDataType[] = res.data?.data?.templates || [];
      setEmissionData(templates);
    } catch (error) {
      console.error("Error fetching data collection for scope:", error);
    }
  }

  useEffect(() => {
    const isViewer = getViewer();
    if (isViewer) setPreviewMode(true);
    const scopeName = `Scope ${scope}`
    const params: DataCollectionFetchParams = {
      p_project_id: projectId,
      p_scope_name: scopeName,
      p_page_size: 10,
      p_page_number: 1
    };
    fetchDataCollectionForScope(params);
  }, [])

  const handleExcelUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("/upload-csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const rawTemplates = response.data?.data?.templates || [];
      const cleanKey = (str: string) =>
        str
          ?.replace(/\u00A0/g, " ")
          ?.replace(/\u202F/g, " ")
          ?.replace(/^\uFEFF/, "")
          ?.trim() || str;

      const validMonth = (key: string) => {
        const cleaned = cleanKey(key);
        return /^[A-Za-z]{3}\s?\d{2,4}$/.test(cleaned);
      };
      const cleanedTemplates = rawTemplates.map((item: any) => {
        const newMonthly: Record<string, any> = {};
        Object.entries(item.monthly_data || {}).forEach(([k, v]: any) => {
          const cleaned = cleanKey(k);
          if (!validMonth(cleaned)) return;
          newMonthly[cleaned] = v;
        });
        return {
          ...item,
          monthly_data: newMonthly,
        };
      });

      setEmissionData((prev) => {
        const updated = [...prev];

        cleanedTemplates.forEach((incoming: any) => {
          const matchIndex = updated.findIndex(
            (row) => row.project_activity_id === incoming.project_activity_id
          );

          if (matchIndex !== -1) {
            updated[matchIndex] = {
              ...updated[matchIndex],
              monthly_data: {
                ...updated[matchIndex].monthly_data,
                ...incoming.monthly_data,
              },
            };
          } else {
            updated.push(incoming);
          }
        });

        return updated;
      });
      toast.success("File uploaded and data updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload file");
    }
  };

  async function handlePreview() {
    const scopeName = `Scope ${scope}`
    const payload = {
      p_project_id: projectId,
      p_scope_name: scopeName,
    }
    setPreviewMode(true);
    try {
      await axios.post("/get_project_review_data", payload);
    } catch (error) {
      console.error("Error fetching preview data:", error);
    }
  }

  useEffect(() => {
    if (!emissionData.length) return;
    const allCategories = [...new Set(emissionData.map(e => e.sub_category).filter(Boolean))];
    if (!activeCategory || !allCategories.includes(activeCategory)) {
      setActiveCategory(allCategories[0] || "");
    }
  }, [emissionData, activeCategory]);

  const filteredEmissionData = !previewMode && activeCategory
    ? emissionData.filter(row => row.sub_category === activeCategory)
    : emissionData;

  return (
    <section className="flex flex-col min-h-full ">
      <DEUploadModal
        open={isUploadModalOpen}
        onOpenChange={setIsUploadModalOpen}
        onProcessData={handleExcelUpload}
      />
      <PreviewInfoDrawer
        open={isInfoDrawerOpen}
        onClose={() => setIsInfoDrawerOpen(false)}
        data={selectedRow}
      />
      {viewUploadedFile && (
        <ViewOrUploadModal
          open={viewUploadedFile}
          onOpenChange={setViewUploadedFile}
        />
      )}
      {openPreviewTable && (
        <PreviewTableDrawer
          onClose={() => setOpenPreviewTable(false)}
          submitBtn
          redirectionPath={`/project/${projectId}/data-control`}
          data={[
            ...previewTableRows.map((r) => ({
              activityId: r.id,
              activity: r.activity,
              branchId: r.id,
              main_category: r.category,
              sub_category: r.subCategory,
              unit: r.unit,
              frequency: r.frequency,
              database: r.efSource,
              ef: r.ef,
              selection_1: r.selection1,
              selection_2: r.selection2,
            })),
          ]}
        />
      )}

      <HeaderSection
        saved={saved}
        previewMode={previewMode}
        projectId={data.projectId}
        scope={data.scope}
        emissionData={emissionData}
        allowBulkUpload={data.meta?.features?.allowBulkUpload}
        onUpload={() => setIsUploadModalOpen(true)}
        readOnly={previewMode}
        setPreviewMode={setPreviewMode}
      />

      {!previewMode && (
        <CategoryTabs
          className="rounded-xl shadow-md mt-2"
          categories={[...new Set(emissionData.map(e => e.sub_category).filter(Boolean))]}
          activeCategory={activeCategory}
          onChange={(cat) => setActiveCategory(cat)}
          currentScope={Number(currentScope)}
          readOnly={previewMode}
        />
      )}


      <main className="flex-1 flex flex-col my-2">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 flex flex-col rounded-2xl bg-white/50 backdrop-blur shadow-md overflow-hidden"
        >
          <EmissionTable
            periodLabels={data.periodLabels}
            onChangeValue={onChangeValue}
            onRemoveEntry={removeEntry}
            emissionData={filteredEmissionData}
            setIsInfoDrawerOpen={setIsInfoDrawerOpen}
            setSelectedRow={setSelectedRow}
            readOnly={false}
            setViewUploadedFile={setViewUploadedFile}
            setPreviewMode={setPreviewMode}
          />
        </motion.div>
      </main>

      {!previewMode && (
        <div className="mt-2">
          <DEFooter
            setSaved={setSaved}
            onClear={clearAll}
            emissionData={emissionData}
            handlePreview={handlePreview}
          />
        </div>
      )}
    </section>
  );
}
