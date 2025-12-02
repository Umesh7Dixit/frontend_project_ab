import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useRef, useState, useEffect } from "react";
import { CloudUpload } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ViewOrUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileUrl?: string | null;
  onSave?: (file: File | null) => void;
}

const ViewOrUploadModal = ({
  open,
  onOpenChange,
  fileUrl: initialFileUrl,
  onSave,
}: ViewOrUploadModalProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialFileUrl ?? null
  );
  const [file, setFile] = useState<File | null>(null);
  const [isPdf, setIsPdf] = useState<boolean>(
    initialFileUrl?.toLowerCase().endsWith(".pdf") ?? false
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setPreviewUrl(initialFileUrl ?? null);
    setIsPdf(initialFileUrl?.toLowerCase().endsWith(".pdf") ?? false);
  }, [initialFileUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      setIsPdf(
        selectedFile.type === "application/pdf" ||
        selectedFile.name.toLowerCase().endsWith(".pdf")
      );
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setPreviewUrl(initialFileUrl ?? null);
    setFile(null);
    setIsPdf(initialFileUrl?.toLowerCase().endsWith(".pdf") ?? false);
    onOpenChange(false);
  };

  const handleSave = () => {
    if (onSave) onSave(file);
    onOpenChange(false);
    toast.success("File uploaded successfully!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-800">
            Uploaded File
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            View your uploaded file or upload a new one
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {previewUrl ? (
            <div className="flex justify-center">
              {isPdf ? (
                <iframe
                  src={previewUrl}
                  title="File Preview"
                  className="w-full h-96 rounded-lg border border-gray-200 shadow-sm"
                />
              ) : (
                <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <img
                    src={previewUrl}
                    alt="Uploaded File"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>
          ) : (
            <div
              onClick={handleUploadClick}
              className="flex flex-col items-center justify-center h-72 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50/70 hover:bg-gray-100 transition"
            >
              <motion.div
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-200 shadow-sm"
              >
                <CloudUpload className="h-12 w-12 text-emerald-600" />
              </motion.div>
              <p className="mt-4 text-gray-600 font-medium text-base">
                Click or Drag & Drop to Upload
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Supports PDF, PNG, JPG
              </p>
            </div>
          )}

          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!file && !previewUrl}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrUploadModal;
