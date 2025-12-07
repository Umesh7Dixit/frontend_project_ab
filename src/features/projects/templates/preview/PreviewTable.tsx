"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableHead } from "@/components/ui/table";
import {
  previewTableColumns,
  PreviewTableProps,
  RowData,
} from "./utils";
import EditableRow from "./EditableRow";
import { useUser } from "@/lib/context/EntriesContext";

const PreviewTable: React.FC<PreviewTableProps> = ({
  setInfoDrawerOpen,
  setSelectedRow,
  setDeleteModalOpen,
  selectedRowIds,
  setSelectedRowIds,
  mode,
  filteredRows,
}) => {
  const { setEntries } = useUser();

  function convertToRowData(obj: any): RowData {
    return {
      id: obj.id,
      frequency: obj.frequency ?? "Monthly",

      unit: obj.unit ?? obj.unit_name ?? "",

      main_category: obj.main_category ?? obj.category ?? "",
      main_category_id: obj.main_category_id ?? null,

      sub_category: obj.sub_category ?? obj.subCategory ?? "",
      subcategory_id: obj.subcategory_id ?? null,
      activity: obj.activity ?? "",
      selection_1: obj.selection_1 ?? obj.selection1 ?? "N/A",
      selection_2: obj.selection_2 ?? obj.selection2 ?? "N/A",

      ef: obj.ef ?? obj.emission_factor ?? "",
      source: obj.source ?? "-",
      scope: obj.scope,
    };
  }

  const handleUpdateRow = (id: string | number, updated: any) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, ...updated } : entry))
    );
  };
  return (
    <div className="flex flex-col h-full w-full rounded-3xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative ring-1 ring-black/5">
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <Table className="w-full border-collapse relative">
          <TableHeader className="sticky top-0 z-20 bg-white/90 backdrop-blur-md shadow-sm after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1px] after:bg-gray-100">
            <TableRow className="hover:bg-transparent border-none">
              {previewTableColumns
                .filter(
                  (col) =>
                    !(
                      mode === "preview" &&
                      ["checkbox", "edit", "delete"].includes(col.key)
                    )
                )
                .map((col) => (
                  <TableHead
                    key={col.key}
                    className={`px-4 text-xs font-semibold uppercase text-zinc-900 bg-transparent ${col.align === "center" ? "text-center" : "text-left"
                      }`}
                  >
                    {col.label}
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>

          <tbody className="divide-y divide-gray-50/50">
            {filteredRows && filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <EditableRow
                  key={row.id}
                  row={convertToRowData(row)}
                  setInfoDrawerOpen={setInfoDrawerOpen}
                  setSelectedRow={setSelectedRow}
                  setDeleteModalOpen={setDeleteModalOpen}
                  onUpdateRow={handleUpdateRow}
                  selectedRowIds={selectedRowIds}
                  setSelectedRowIds={setSelectedRowIds}
                  mode={mode}
                />
              ))
            ) : (
              <TableRow>
                <td
                  colSpan={previewTableColumns.length}
                  className="h-64 text-center"
                >
                  <div className="flex flex-col items-center justify-center text-gray-400 gap-2">
                    <span className="text-sm font-medium">
                      No records found
                    </span>
                  </div>
                </td>
              </TableRow>
            )}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default PreviewTable;