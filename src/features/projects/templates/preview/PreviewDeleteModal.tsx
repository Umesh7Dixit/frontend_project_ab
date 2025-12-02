"use client";

import React from "react";
import { AlertTriangle, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";

interface PreviewDeleteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  item: any;
}

const PreviewDeleteModal: React.FC<PreviewDeleteModalProps> = ({
  open,
  onOpenChange,
  onConfirm,
  item,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg" showCloseButton={false}>
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold">
            Delete confirmation
          </DialogTitle>

          <div className="flex justify-center mt-6">
            <motion.div
              animate={{ scale: [1, 1.07, 1], opacity: [1, 0.9, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="h-28 w-28 rounded-full bg-red-50/60 flex items-center justify-center border border-red-200"
            >
              <AlertTriangle className="h-12 w-12 text-red-600" />
            </motion.div>
          </div>
        </DialogHeader>

        <div className="text-sm text-muted-foreground mt-1 text-center">
          Are you sure you want to delete
          <span className="font-semibold text-primary"> {item?.activity}</span>?
          <br />
          This action cannot be undone.
        </div>

        <DialogFooter className="mt-8 flex justify-between gap-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-6"
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              onConfirm();
            }}
            className="rounded-full px-6 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
          >
            <Trash2Icon />
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PreviewDeleteModal;
