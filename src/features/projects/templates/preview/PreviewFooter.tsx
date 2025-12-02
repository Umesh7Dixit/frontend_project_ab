"use client";

import React from "react";
import {
  ArrowLeft,
  Edit3,
  Copy,
  Plus,
  Save,
  ArrowRight,
  Send,
} from "lucide-react";
import { motion } from "motion/react";
import { PreviewFooterProps } from "./utils";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { toast } from "sonner";
import { MotionButton } from "@/components/MotionItems";
import { useUser } from "@/lib/context/EntriesContext";
import { templateApi } from "@/lib/api/templates";
import { projectId } from "@/lib/jwt";
const PreviewFooter: React.FC<PreviewFooterProps> = ({
  mode = "preview",
  onEditUse,
  currentScopeIndex,
  selectedScopes,
  setCurrentScopeIndex,
  selectedRowIds,
  templateID,
  currentPage,
  totalPages,
  goToPage,
  onDuplicate,
}) => {
  const router = useRouter();
  const goNext = () => {
    if (currentScopeIndex < selectedScopes.length - 1) {
      setCurrentScopeIndex((i) => i + 1);
    }
  };

  const goPrevious = () => {
    if (currentScopeIndex > 0) {
      setCurrentScopeIndex((i) => i - 1);
    }
  };
  const { entries } = useUser();
  const disableBack = currentScopeIndex === 0 || selectedScopes.length <= 1;
  const disableNext =
    currentScopeIndex === selectedScopes.length - 1 ||
    selectedScopes.length <= 1;

  const handleSave = async () => {
    if (!templateID || !entries?.length) {
      toast.error("Nothing to save or missing Project ID");
      return;
    }
    const response = await templateApi.commitStagedChangesToProject(projectId);
    if (response.data?.issuccessful) {
      toast.success("Configuration saved!");
    } else {
      toast.error(response.data?.message || "Error saving.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-white/70 backdrop-blur-md border-t border-gray-200 shadow-md px-6 py-4 rounded-2xl"
    >
      {mode === "preview" ? (
        <div className="w-full flex justify-between">
          <Pagination>
            <PaginationContent>
              <PaginationPrevious
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              />
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => goToPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationNext
                disabled={currentPage === totalPages}
                onClick={() => goToPage(currentPage + 1)}
              />
            </PaginationContent>
          </Pagination>
          <div className="flex items-center gap-3">
            <MotionButton
              variant="outline"
              className="rounded-full px-6 flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft size={18} />
              Back
            </MotionButton>

            <MotionButton
              onClick={onEditUse}
              className="rounded-full px-6 bg-secondary hover:bg-secondary/90 text-white flex items-center gap-2"
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 size={18} />
              Edit & Use
            </MotionButton>
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-end gap-3 items-center">
          <MotionButton
            variant="outline"
            className="rounded-full px-5 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDuplicate}
            disabled={selectedRowIds.length === 0}
          >
            <Copy size={16} />
            Duplicate
          </MotionButton>

          <MotionButton
            variant="outline"
            className="rounded-full px-5 flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() =>
              router.push(
                `/project/${templateID}/data-collection?scope=${currentScopeIndex + 1}&templateId=${templateID}`
              )
            }
          >
            <Plus size={16} />
            Add Row
          </MotionButton>


          <MotionButton
            onClick={goPrevious}
            disabled={disableBack}
            className="rounded-full px-5 bg-secondary hover:bg-secondary/90 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!disableBack ? { scale: 1.05 } : {}}
            whileTap={!disableBack ? { scale: 0.95 } : {}}
          >
            <ArrowLeft size={16} />
            Back
          </MotionButton>

          <MotionButton
            onClick={goNext}
            disabled={disableNext}
            className="rounded-full px-5 bg-secondary hover:bg-secondary/90 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!disableNext ? { scale: 1.05 } : {}}
            whileTap={!disableNext ? { scale: 0.95 } : {}}
          >
            Next
            <ArrowRight size={16} />
          </MotionButton>

          {disableNext && (
            <MotionButton
              onClick={() => {
                handleSave();
                router.push(`/project/${templateID}/data-control`)
              }}
              className="rounded-full px-5 bg-secondary hover:bg-secondary/90 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              Submit
            </MotionButton>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default PreviewFooter;
