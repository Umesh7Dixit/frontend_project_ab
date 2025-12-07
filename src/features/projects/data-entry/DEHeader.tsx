"use client";

import { motion } from "motion/react";
import { Edit, Save, UploadCloud } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { MotionButton } from "@/components/MotionItems";
import { useUser } from "@/lib/context/EntriesContext";
import { EmissionDataType } from "./utils";
import { getProjectId, getUserId } from "@/lib/jwt";
import { buildBatchPayload, upsertBatch } from "@/features/main-page/utils";

type HeaderProps = {
  projectId: number;
  scope: string;
  allowBulkUpload?: boolean;
  emissionData: EmissionDataType[];
  onUpload?: () => void;
  readOnly?: boolean;
  saved: boolean;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
};

export default function DEHeader({
  projectId,
  scope,
  allowBulkUpload = false,
  onUpload,
  readOnly = false,
  setPreviewMode,
  saved,
  previewMode,
  emissionData
}: HeaderProps) {
  const scopeNum = scope.split("-")[1] ?? "1";
  const searchParams = useSearchParams();
  const search = searchParams.get('scope')
  const title = `Scope ${search} Emission Data`;
  const router = useRouter();

  const handleEditButton = () => {
    if (readOnly) {
      setPreviewMode(false);
    } else {
      router.push(
        `/create-project/templates/${projectId}/preview?scope=Scope ${scopeNum}&mode=edit`
      );
    }
  };
  const { isViewer } = useUser();

  const handleSubmit = async () => {
    const userId = getUserId();

    if (saved) {
      toast.success("Submitted successfully!");
      router.push(`/project/${getProjectId()}/data-control`);
      return;
    }

    try {
      const batch = buildBatchPayload(emissionData);

      if (batch.length === 0) {
        toast.error("No data to submit");
        return;
      }
      const res = await upsertBatch(userId, batch);

      if (res?.issuccessful) {
        toast.success("Submitted successfully!");
        router.push(`/project/${getProjectId()}/data-control`);
      } else {
        toast.error(res?.message || "Submission failed");
      }

    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      key={readOnly ? "edit" : "preview"}
      className="flex justify-between items-center py-3 px-5 rounded-2xl bg-white/60 backdrop-blur-[10px] shadow-md"
    >
      <div>
        <h1 className="text-xl font-bold text-gray- flex items-center gap-3">
          {title}
          {/* <span className="text-xs font-semibold rounded-[10px] px-2 py-1 bg-[rgba(238,255,0,0.45)] text-[#2b5f5d]">
            Total: 1358
          </span> */}
        </h1>
        <p className="text-sm text-gray-500">
          Enter data for project <strong>{projectId}</strong>. Values entered
          here will be used for monthly/quarterly reporting.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {
          !isViewer && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className=" flex item-center gap-2 px-3 py-2 rounded-md bg-primary/80 text-white text-sm"
              onClick={handleEditButton}
            >
              <Edit size={20} />
              Edit
            </motion.button>
          )
        }
        {allowBulkUpload && !readOnly && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex item-center gap-2 px-3 py-2 rounded-md bg-emerald-600 text-white text-sm"
            onClick={onUpload}
          >
            <UploadCloud size={23} />
            Bulk Upload
          </motion.button>
        )}
        {(!isViewer && previewMode) && (
          <MotionButton
            variant="secondary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
          >
            <Save />
            Submit
          </MotionButton>
        )}
      </div>
    </motion.header>
  );
}
