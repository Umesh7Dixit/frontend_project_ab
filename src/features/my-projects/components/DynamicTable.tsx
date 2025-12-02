"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  DownloadCloud,
  ChevronLeft,
  ChevronRight,
  Inbox,
  ArrowUpDown,
  ListFilter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

// UI Components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DynamicTableProps, getStatusBadgeStyles } from "../utils";

const DynamicTable: React.FC<DynamicTableProps> = ({
  title,
  columns,
  data,
  onRowClick,
  compact,
  sortKey,
  onDownload,
}) => {
  const router = useRouter();

  // --- State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    const base = searchQuery
      ? data.filter((row) =>
        columns.some((col) =>
          row[col.key]?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
      : data;

    if (compact) {
      const sorted = sortKey
        ? [...base].sort((a, b) => {
          const av = a[sortKey] ?? 0;
          const bv = b[sortKey] ?? 0;
          return bv - av;
        })
        : base;

      return sorted.slice(0, 10);
    }

    return base;
  }, [data, searchQuery, columns, compact, sortKey]);


  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const currentData = filteredData.slice(start, end);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, pageSize]);

  return (
    <Card className="w-full bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden flex flex-col">
      <CardHeader className="border-b mb-0 pb-0  bg-white px-6 py-0 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <ListFilter size={18} />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">
              {title || "Data Table"}
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {filteredData.length} total records found
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-9 h-9 text-sm bg-gray-50 border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {
            !compact && (
              <Select
                value={pageSize.toString()}
                onValueChange={(val) => setPageSize(Number(val))}
              >
                <SelectTrigger className="h-9 w-[70px] border border-gray-300 bg-gray-50 text-xs">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )
          }
        </div>
      </CardHeader>

      <CardContent className="p-0 flex-1 flex -mt-6 flex-col relative min-h-[400px]">
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 backdrop-blur-sm">
              <TableRow className="border-gray-200">
                {columns.map((col) => (
                  <TableHead
                    key={col.key}
                    className="text-xs font-bold text-gray-700 uppercase tracking-wider px-6 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1 cursor-pointer group">
                      {col.label}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="">
              <AnimatePresence>
                {currentData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-[300px] text-center"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center text-gray-400"
                      >
                        <div className="bg-gray-50 p-4 rounded-full mb-3">
                          <Inbox size={40} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No results found</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Try adjusting your search or filters
                        </p>
                      </motion.div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.map((row, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.03 }}
                      onClick={() => {
                        if (!onRowClick) return;
                        const path = onRowClick(row);
                        if (typeof path === "string") router.push(path);
                      }}
                      className={cn(
                        "group border-b border-gray-100 last:border-0 transition-all hover:bg-slate-50/80",
                        onRowClick ? "cursor-pointer" : ""
                      )}
                    >
                      {columns.map((col) => {
                        const cellValue = row[col.key];
                        const isStatus = col.key === "status";
                        const isCompletion = col.key === "completion";

                        return (
                          <TableCell
                            key={col.key}
                            className="px-6 py-3 text-sm  whitespace-nowrap"
                          >
                            {col.icon ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDownload?.(row);
                                }}
                              >
                                <DownloadCloud size={16} />
                              </Button>
                            ) : col.render ? (
                              col.render(cellValue, row)
                            ) : isStatus ? (
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                  getStatusBadgeStyles(cellValue as string)
                                )}
                              >
                                {cellValue}
                              </span>
                            ) : isCompletion ? (
                              <div className="text-center font-medium text-gray-700">
                                {cellValue}%
                              </div>
                            ) : (
                              <span className="">
                                {cellValue}
                              </span>
                            )}
                          </TableCell>
                        );
                      })}
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>

        {!compact && (
          filteredData.length > 0 && (
            <div className="border-t border-gray-100 bg-gray-50/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-medium">
                Viewing <span className="text-gray-900">{start + 1}</span> -{" "}
                <span className="text-gray-900">
                  {Math.min(end, filteredData.length)}
                </span>{" "}
                of <span className="text-gray-900">{filteredData.length}</span> results
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft size={14} />
                </Button>

                <div className="flex items-center gap-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p = i + 1;
                    if (totalPages > 5 && page > 3) p = page - 2 + i;
                    if (p > totalPages) return null;

                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={cn(
                          "h-7 w-7 text-xs rounded-md flex items-center justify-center transition-colors",
                          page === p
                            ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                            : "text-gray-500 hover:bg-gray-200"
                        )}
                      >
                        {p}
                      </button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                >
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default DynamicTable;