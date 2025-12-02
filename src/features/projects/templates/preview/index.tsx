"use client";

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import PreviewHeader from "./PreviewHeader";
import PreviewTable from "./PreviewTable";
import PreviewFooter from "./PreviewFooter";
import PreviewInfoDrawer from "./PreviewInfoDrawer";
import PreviewDeleteModal from "./PreviewDeleteModal";
import ScopeDrawer from "@/features/carbon-accounting/dashboard/ScopeDrawer";
import { drawerScopes } from "@/schema/carbon-accounting-data";
import SaveTemplateModal from "./SaveTemplateModal";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { usePagination } from "@/lib/hooks/usePagination";
import axios from "@/lib/axios/axios";
import { useUser } from "@/lib/context/EntriesContext";
import { templateApi } from "@/lib/api/templates";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const PreviewPage: React.FC<{ templateID: number; projectId: number }> = ({
  templateID,
  projectId,
}) => {
  // --- State ---
  const [infoDrawerOpen, setInfoDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [scopeCustomizationOpen, setScopeCustomizationOpen] = useState(false);
  const [saveTemplateModalOpen, setSaveTemplateModalOpen] = useState(false);

  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [selectedScopes, setSelectedScopes] = useState<number[]>([1, 2, 3]);
  const [currentScopeIndex, setCurrentScopeIndex] = useState(0);
  const [selectedRowIds, setSelectedRowIds] = useState<(string | number)[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingData, setIsLoadingData] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);

  const debouncedQuery = useDebounce(searchQuery, 300);
  const { entries, setEntries, setScopedEntries } = useUser();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mode = searchParams?.get("mode") ?? "preview";
  const templateName = decodeURIComponent(searchParams.get("name") || "");
  const editMode = mode === "edit";
  const currentScopeNumber = selectedScopes[currentScopeIndex];

  const fetchScopeData = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoadingData(true);
    try {
      const scopeString = `Scope ${currentScopeNumber}`;
      const response = await templateApi.getTemplateDetails(projectId, scopeString);

      if (controller.signal.aborted) return;
      if (!response) {
        console.error("Failed to fetch template details");
        setEntries([]);
        return;
      }
      const unique = [...new Map(response.map(item => [item.id, item])).values()];

      setEntries(unique); // UI table 

      setScopedEntries(prev => {
        const filtered = prev.filter(item => item.scope !== `Scope ${currentScopeNumber}`);
        return [...filtered, ...unique];
      });

    } catch (error: any) {
      if (error.name !== "AbortError") {
        console.error("Error fetching scope data:", error);
        setEntries([]);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoadingData(false);
      }
    }
  }, [projectId, currentScopeNumber, setEntries]);

  useEffect(() => {
    fetchScopeData();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchScopeData]);

  useEffect(() => {
    goToPage(1);
  }, [currentScopeIndex]);

  const filteredRows = useMemo(() => {
    if (!debouncedQuery.trim()) return entries;
    const q = debouncedQuery.toLowerCase();
    return entries.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(q)
      )
    );
  }, [debouncedQuery, entries]);

  const { currentPage, totalPages, paginatedData, goToPage } = usePagination({
    data: filteredRows,
    itemsPerPage: 50,
  });

  // --- Handlers ---
  const handleDuplicateRows = () => {
    if (selectedRowIds.length === 0) return;
    const idsToDuplicate = [...selectedRowIds];

    setEntries((prev) => {
      const newData = [...prev];
      idsToDuplicate.forEach((id) => {
        const index = newData.findIndex((r) => r.id === id);
        if (index !== -1) {
          const original = newData[index];
          const duplicated = {
            ...original,
            id: `${original.id}-copy-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 7)}`,
            activity: `${original.activity} (Copy)`,
          };
          newData.splice(index + 1, 0, duplicated);
        }
      });

      setScopedEntries(prev => {
        const filtered = prev.filter(item => item.scope !== `Scope ${currentScopeNumber}`);
        return [...filtered, ...newData];
      });

      return newData;
    });

    setSelectedRowIds([]);
  };

  const setMode = (nextMode?: string | null) => {
    const sp = new URLSearchParams(Array.from(searchParams?.entries() ?? []));
    if (!nextMode) sp.delete("mode");
    else sp.set("mode", nextMode);
    const qs = sp.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  };

  const handleApplyTemplate = async () => {
    try {
      const response = await axios.post(
        "/templates/apply_template_to_project",
        {
          p_project_id: projectId,
          p_template_id: templateID,
        }
      );

      if (response.data.issuccessful) {
        setMode(null);
      }
    } catch (error) {
      console.error("Error applying template:", error);
    }
  };

  const handleDeleteRow = async (id: number, subCategoryId: number) => {
    try {
      const res = await templateApi.deleteStagedActivity(projectId, subCategoryId);
      if (res.data?.issuccessful) {
        setEntries((prev) => prev.filter((item) => item.id !== id));
        setScopedEntries(prev =>
          prev.filter(item => !(item.id === id && item.scope === `Scope ${currentScopeNumber}`))
        );
        toast.success("Row deleted successfully.");
      } else {
        toast.error(res.data?.message || "Error deleting row.");
      }
    } catch (error) {
      toast.error("Error deleting row.");
    }
  };
  return (
    <div className="flex flex-col justify-between gap-4 h-full relative">
      {isLoadingData && (
        <div className="absolute inset-0 z-50 bg-white/50 flex items-center justify-center backdrop-blur-[1px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      <PreviewInfoDrawer
        open={infoDrawerOpen}
        onClose={() => setInfoDrawerOpen(false)}
        data={selectedRow}
      />
      <PreviewDeleteModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => {
          if (selectedRow) {
            const rowId = selectedRow.id;
            const subCategoryId = selectedRow.subcategory_id;
            handleDeleteRow(rowId, subCategoryId);
          }
          setDeleteModalOpen(false);
        }}
        item={selectedRow}
      />
      <PreviewHeader
        templateID={templateID}
        editMode={editMode}
        templateName={templateName}
        onSaveTemplate={() => setSaveTemplateModalOpen(true)}
        onCustomizeScopes={() => setScopeCustomizationOpen(true)}
        currentScope={currentScopeNumber}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      <PreviewTable
        setSelectedRow={setSelectedRow}
        setInfoDrawerOpen={setInfoDrawerOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        selectedRowIds={selectedRowIds}
        setSelectedRowIds={setSelectedRowIds}
        mode={editMode ? "edit" : "preview"}
        filteredRows={paginatedData}
      />
      <PreviewFooter
        mode={editMode ? "edit" : "preview"}
        onEditUse={() => {
          if (editMode) {
            handleApplyTemplate();
          } else {
            setMode("edit");
          }
        }}
        onDuplicate={handleDuplicateRows}
        currentScopeIndex={currentScopeIndex}
        selectedScopes={selectedScopes}
        setCurrentScopeIndex={setCurrentScopeIndex}
        selectedRowIds={selectedRowIds}
        templateID={templateID}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
      />
      <ScopeDrawer
        open={scopeCustomizationOpen}
        onClose={() => setScopeCustomizationOpen(false)}
        scopes={drawerScopes}
        selected={selectedScopes}
        setSelected={setSelectedScopes}
      />
      <SaveTemplateModal
        open={saveTemplateModalOpen}
        onOpenChange={setSaveTemplateModalOpen}
        templateData={{
          name: "Template 1",
          description: "Description",
          scopes: selectedScopes.map((s) => `Scope ${s}`),
        }}
        onConfirm={() => setSaveTemplateModalOpen(false)}
      />
    </div>
  );
};

export default PreviewPage;