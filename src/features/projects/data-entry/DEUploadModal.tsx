"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  CloudUpload,
  Trash2,
  FileSpreadsheet,
  X,
  FileText,
  CheckCircle2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProcessData: (file: File) => void;
}

const DEUploadModal: React.FC<UploadModalProps> = ({
  open,
  onOpenChange,
  onProcessData,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProcess = () => {
    if (!file) return;
    onProcessData(file);
    handleClear();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 shadow-2xl sm:rounded-2xl bg-white" showCloseButton={false}>
        <div className="bg-emerald-50/50 p-4 pb-4">
          <DialogHeader className="flex flex-col items-center gap-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-emerald-100 blur-xl opacity-50" />
              <div className="size-20 rounded-2xl bg-white shadow-sm border border-emerald-100 flex items-center justify-center relative z-10">
                <CloudUpload className="size-10 text-emerald-600" />
              </div>
              <motion.div
                className="absolute -right-2 -top-2 bg-emerald-600 rounded-full p-1.5 border-2 border-white z-20"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <CheckCircle2 className="w-3 h-3 text-white" />
              </motion.div>
            </motion.div>

            <div className="text-center space-y-1.5">
              <DialogTitle className="text-xl font-bold text-gray-900">
                Import Data
              </DialogTitle>
              <p className="text-sm text-gray-500 max-w-[260px] mx-auto leading-relaxed">
                Upload your <span className="text-emerald-700 font-medium">Sub Category</span> sheet to magic scan and process entries.
              </p>
            </div>
          </DialogHeader>
        </div>

        <div className="p-2 space-y-2">
          <AnimatePresence mode="wait">
            {!file ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    group relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ease-in-out cursor-pointer text-center
                    ${isDragging
                      ? "border-emerald-500 bg-emerald-50/30 scale-[1.02]"
                      : "border-gray-200 hover:border-emerald-400 hover:bg-gray-50/50"
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    className="hidden"
                    onChange={handleInputChange}
                  />
                  <div className="flex flex-col items-center gap-2">
                    <div className={`p-2 rounded-full transition-colors ${isDragging ? "bg-emerald-100" : "bg-gray-100 group-hover:bg-emerald-50"}`}>
                      <FileSpreadsheet className={`size-6 transition-colors ${isDragging ? "text-emerald-600" : "text-gray-400 group-hover:text-emerald-600"}`} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-400">
                        XLSX, XLS or CSV (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="file-preview"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mt-2"
              >
                <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50/40 p-4">
                  <div className="flex items-start gap-2">
                    <div className="size-10 shrink-0 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <FileText className="size-5 text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full -mr-2 -mt-2 transition-colors"
                      onClick={handleClear}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <div className="mt-3 h-1 w-full bg-emerald-200/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-emerald-500"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter className="p-6 pt-0 sm:justify-between gap-3">
          <Button
            variant="ghost"
            onClick={handleClear}
            disabled={!file}
            className="text-gray-500 hover:text-red-600 hover:bg-red-50 px-4 disabled:opacity-0 transition-opacity"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>

          <div className="flex gap-3 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 sm:flex-none border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcess}
              disabled={!file}
              className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 rounded-lg transition-all active:scale-95"
            >
              Process Data
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DEUploadModal;