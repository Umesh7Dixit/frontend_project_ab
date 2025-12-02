"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowDown, ArrowUp, Send, X } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PreviewTableDrawer = ({
  onClose,
  data,
  submitBtn = false,
  redirectionPath,
}: {
  onClose: () => void;
  submitBtn?: boolean;
  redirectionPath?: string;
  data: {
    activityId: number;
    branchId: number;
    activity: string;
    selection_1?: string;
    selection_2?: string;
    frequency: string;
    main_category: string;
    unit: string;
    sub_category?: string;
    ef?: string;
    database: string;
  }[];
}) => {
  const [expanded, setExpanded] = useState(false);
  const [tableData, setTableData] = useState(data);
  const router = useRouter();

  useEffect(() => {
    if (expanded) {
      setTableData([...data]);
    } else {
      setTableData([...data]);
    }
  }, [expanded, data]);

  const handleSubmit = () => {
    onClose();
    toast.success("Data submitted successfully!");
    if (redirectionPath) {
      setTimeout(() => {
        router.push(redirectionPath);
      }, 1000);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.aside
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ duration: 0.32, ease: "easeOut" }}
        className="relative mx-auto w-[70%] mt-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Preview Info"
      >
        <motion.div
          animate={{ height: expanded ? "80vh" : "auto" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="p-6 bg-white/70 backdrop-blur-xl border border-white/10 shadow-2xl rounded-t-3xl flex flex-col overflow-hidden"
        >
          <header className="flex items-start justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Preview Data
            </h3>
            <div className="flex items-center gap-2">
              {submitBtn && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1 rounded-full p-2 bg-secondary hover:bg-secondary/80 border border-white/20 text-white transition text-sm"
                  onClick={handleSubmit}
                >
                  <Send size={15} />
                  Submit
                </motion.button>
              )}
              <button
                onClick={() => setExpanded((prev) => !prev)}
                aria-label="Toggle Height"
                className="rounded-full p-2 bg-secondary/20 hover:bg-secondary/40 
                   border border-white/20 text-gray-600 transition cursor-pointer"
              >
                {expanded ? (
                  <ArrowDown className="h-4 w-4" />
                ) : (
                  <ArrowUp className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 bg-white/10 hover:bg-white/20 
                   border border-white/20 text-gray-600 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </header>

          <div className="flex-1  overflow-auto">
            {tableData && tableData.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/60">
                      <TableHead className="font-semibold">
                        Activity
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Selection 1
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Selection 2
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Data Type
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Unit
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Sub Category
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        EF (Kg)
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Database
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, idx) => (
                      <TableRow
                        key={idx}
                        className="hover:bg-gray-50 border-t border-gray-200"
                      >
                        <TableCell className="">
                          {row.activity}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.selection_1 || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.ef || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.frequency}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.unit}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.sub_category || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.ef || "—"}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.database}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-center text-gray-500 text-sm py-6">
                No rows selected yet.
              </p>
            )}
          </div>
        </motion.div>
      </motion.aside>
    </div>
  );
};

export default PreviewTableDrawer;
