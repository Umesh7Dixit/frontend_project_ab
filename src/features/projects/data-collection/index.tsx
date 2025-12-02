"use client";

import DataCollectionShell from "./DataCollectionShell";
import { motion } from "motion/react";
import { CategoryNode } from "./utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Table2, Plus, Database, Activity } from "lucide-react";
import { useUser } from "@/lib/context/EntriesContext";
import PreviewTableDrawer from "./PreviewTableDrawer";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  projectId: number;
  data: {
    nodes: CategoryNode[];
    initialSelected: number[];
  };
}

export default function DataCollectionPage({ projectId, data: _data }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentScope, setCurrentScope] = useState<number>(0);
  const [database, setDatabase] = useState<"GHG Protocol" | "DEFRA">("GHG Protocol");
  const [openPreviewDrawer, setOpenPreviewDrawer] = useState(false);
  const scope = Number(searchParams.get("scope"));
  const templateId = searchParams.get("templateId");
  const { addedEntries } = useUser();


  useEffect(() => {
    if (!scope) {
      router.replace("/create-project/templates/2/preview?mode=edit");
      toast.error("Please click on Add Row first.");
    }
    setCurrentScope(Number(scope));
  }, [searchParams, router, scope]);

  return (
    <div className="flex flex-col h-full gap-2 relative">
      {openPreviewDrawer && (
        <PreviewTableDrawer
          onClose={() => {
            setOpenPreviewDrawer(false);
          }}
          data={addedEntries}
        />
      )}

      <motion.header
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/20 shadow-sm"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
            <h1 className="text-lg font-montserrat font-bold text-gray-900 tracking-tight">
              Select Emission Category
            </h1>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-2xl">
            Tracking configuration for project <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-xs border border-emerald-100">{projectId}</span><br />
            These will be used for monthly data entry in the next step.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 w-full md:w-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#0b1f1d]/90 text-white text-sm font-medium shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>New Activity</span>
          </motion.button>

          <div className="space-y-2 flex px-2 py-1 shadow-sm bg-gray-100 items-center border rounded-lg gap-2">
            <Database className="size-7 my-auto text-gray-500" />
            <Select
              value={database}
              onValueChange={(value: "GHG Protocol" | "DEFRA") => setDatabase(value)}
            >
              <SelectTrigger className="w-full min-w-[163px] rounded-lg border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GHG Protocol">GHG Protocol</SelectItem>
                <SelectItem value="DEFRA">DEFRA</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.header>

      <main className="flex flex-1 flex-col lg:flex-row my-2 gap-4 h-fit">
        <DataCollectionShell
          database={database}
          currentScope={scope}
        />
      </main>

      <motion.footer
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="flex justify-between items-center p-4 bg-white/65 backdrop-blur-[8px] rounded-xl shadow"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-3 py-2 rounded-md bg-teal-600 text-white text-sm"
          onClick={() => setOpenPreviewDrawer(true)}
        >
          <Table2 size={20} />
          View Table
        </motion.button>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm"
            onClick={() => {

              router.push(
                `/create-project/templates/${templateId}/preview?mode=edit`,
              );
            }
            }
          >
            Next →
          </motion.button>
        </div>
      </motion.footer>
    </div >
  );
}
