"use client";

import { useMemo } from "react";
import { EmissionDataType } from "./utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Info, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

type EmissionTableProps = {
  periodLabels: string[];
  emissionData: EmissionDataType[];
  onChangeValue: (rowId: number, periodKey: string, newVal: number) => void;
  onRemoveEntry: (id: string) => void;
  setSelectedRow: (row: any) => void;
  setIsInfoDrawerOpen: (open: boolean) => void;
  readOnly?: boolean;
  setViewUploadedFile?: any;
  setPreviewMode?: any;
};

export default function EmissionTable({
  periodLabels,
  onChangeValue,
  onRemoveEntry,
  setSelectedRow,
  setIsInfoDrawerOpen,
  readOnly = false,
  setViewUploadedFile,
  setPreviewMode,
  emissionData,
}: EmissionTableProps) {

  const handleFileViewOrUpload = (row: any) => {
    if (readOnly) {
      if (row.fileUrl) {
        setViewUploadedFile(true);
      } else {
        toast.error("File not uploaded");
      }
    } else {
      setViewUploadedFile(true);
    }
  };

  const finalPeriodLabels = useMemo(() => {
    if (!emissionData || emissionData.length === 0) return periodLabels;

    const allKeys = new Set<string>();
    emissionData.forEach((row) => {
      if (!row.monthly_data) return;
      Object.keys(row.monthly_data).forEach((month) => {
        allKeys.add(month);
      });
    });

    const months = Array.from(allKeys);

    // Month mapping for sorting
    const monthMap: Record<string, number> = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };

    return months.sort((a, b) => {
      const [mA, yA] = a.split(" ");
      const [mB, yB] = b.split(" ");

      const yearA = parseInt(yA) + 2000; // Assuming "25" -> 2025
      const yearB = parseInt(yB) + 2000;

      if (yearA !== yearB) return yearA - yearB;
      return monthMap[mA] - monthMap[mB];
    });
  }, [periodLabels, emissionData]);


  const {     processedRows, grandTotal } = useMemo(() => {
    let totalSum = 0;

    const rows = emissionData?.map((row) => {
      // 1. Sum up the quantities from the monthly_data object
      const totalQuantity = Object.values(row.monthly_data || {}).reduce((sum, obj: any) => {
        // Ensure we parse the number safely
        const val = Number(obj?.quantity);
        return sum + (isNaN(val) ? 0 : val);
      }, 0);

      // 2. You requested to show the summation of quantities
      const ef = Number(row.ef) || 0; 
      const rowTotal = totalQuantity * ef;
      // const rowTotal = totalQuantity;

      // NOTE: If you ever want actual CO2e later, you would do: 
      // const rowTotal = totalQuantity * (Number(row.emission_factor) || 0);

      // 3. Add to the Grand Total
      totalSum += rowTotal;

      return {
        ...row,
        rowTotal, // We add this new property to use in the return statement
      };
    }) || [];

    return { processedRows: rows, grandTotal: totalSum };
  }, [emissionData]);
  const formatEf = (ef: unknown) =>
    ef != null && !isNaN(Number(ef)) ? Number(ef).toFixed(2) : "-";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2, ease: "easeInOut" }}
      key={readOnly ? "edit" : "preview"}
      className="flex-1 overflow-auto rounded-xl bg-white/50 backdrop-blur shadow-md h-full flex flex-col"
    >
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white/95 backdrop-blur z-20 shadow-sm">
            <TableRow>
              <TableHead className="w-[200px] text-xs font-semibold sticky left-0 bg-white/95 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Activities
              </TableHead>
              <TableHead className="text-xs font-semibold w-[80px]">Unit</TableHead>

              {finalPeriodLabels.map((label) => (
                <TableHead key={label} className="text-center text-xs font-semibold min-w-[80px]">
                  {label}
                </TableHead>
              ))}

              <TableHead className="text-right text-xs font-semibold w-[100px]">EF Value</TableHead>
              <TableHead className="text-right text-xs font-semibold w-[100px]">EF Source</TableHead>

              <TableHead className="text-right text-xs font-semibold w-[100px] sticky right-0 md:right-7 bg-white/95 z-30 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                Total T CO2e
              </TableHead>
              <TableHead className="bg-white/95 z-20 w-[80px] text-center">View File</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {processedRows.length > 0 ? (
              processedRows.map((row) => (
                <TableRow key={row.project_activity_id} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium text-xs flex items-center gap-2 sticky left-0 bg-white z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    <Info
                      size={16}
                      className="text-emerald-600 cursor-pointer shrink-0"
                      onClick={() => {
                        setSelectedRow(row);
                        setIsInfoDrawerOpen(true);
                      }}
                    />

                    <div className="flex flex-col items-start gap-0.5 max-w-[160px]">
                      <div className="font-medium truncate w-full" title={row.activity}>
                        {row.activity} 
                      </div>
                      <p className="text-[10px] text-gray-400 truncate w-full">
                        {row.selection_1 || "N/A"} • {row.selection_2 || "N/A"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs text-gray-600">{row.unit}</TableCell>

                  {finalPeriodLabels.map((pl) => {
                    const cellObj = row.monthly_data?.[pl];
                    const cellValue = cellObj ? cellObj.quantity ?? 0 : 0;

                    return (
                      <TableCell key={pl} className="text-center text-xs p-1">
                        {readOnly ? (
                          <span className="text-gray-700">{cellValue.toLocaleString()}</span>
                        ) : (
                          <input
                            type="number"
                            min={0}
                            aria-label={`Enter value for ${pl}`}
                            value={cellValue === 0 ? "" : cellValue}
                            placeholder="0"
                            onChange={(e) =>
                              onChangeValue(
                                row.project_activity_id,
                                pl,
                                e.target.value === "" ? 0 : parseFloat(e.target.value)
                              )
                            }
                            className="w-16 h-7 text-xs text-center rounded-md bg-white border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
                          />
                        )}
                      </TableCell>
                    );
                  })}

                  <TableCell className="text-center text-xs font-bold text-emerald-600">
                    {formatEf(row.ef)}
                  </TableCell>
                  <TableCell className="text-center text-xs text-gray-500 max-w-[100px]" title={row.ef_source || ""}>
                    {row.ef_source || "-"}
                  </TableCell>

                  <TableCell className="text-center font-bold text-xs font-mono text-emerald-700 sticky right-0 md:right-7 bg-white z-20 shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    {row.rowTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>

                  {!readOnly && (
                    <TableCell className="text-center sticky right-5 z-20 hidden">
                    </TableCell>
                  )}

                  <TableCell className="text-center bg-white z-10">
                    <div className="flex items-center justify-center gap-2">
                      <Eye
                        size={16}
                        onClick={() => handleFileViewOrUpload(row)}
                        className="text-gray-400 cursor-pointer hover:text-emerald-600 transition-colors"
                      />
                      {!readOnly && (
                        <Trash2
                          size={16}
                          onClick={() =>
                            onRemoveEntry(row.project_activity_id.toString())
                          }
                          className="text-gray-300 cursor-pointer hover:text-red-500 transition-colors"
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={finalPeriodLabels.length + 6} className="h-24 text-center text-gray-400 text-xs">
                  No emission data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="sticky bottom-0 bg-white/80 backdrop-blur border-t border-gray-100 p-1 flex justify-end">
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 py-1 px-2 rounded-lg shadow-sm">
          <span className="text-xs text-emerald-600 uppercase font-bold tracking-wider">
            Total Emissions
          </span>
          <span className="text-md font-bold text-emerald-800 font-mono">
            {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs font-sans font-normal text-emerald-600">tCO₂e</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}