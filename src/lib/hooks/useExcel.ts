"use client";

import { useCallback } from "react";
import * as XLSX from "xlsx";

export function useExcel() {
    /**
     * Parse an Excel/CSV file into JSON
     */
    const parseFile = useCallback(async (file: File): Promise<any[]> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                try {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: "array" });

                    // take first sheet by default
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];

                    // convert to JSON
                    const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
                    resolve(json);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = (err) => reject(err);
            reader.readAsArrayBuffer(file);
        });
    }, []);

    /**
     * Export JSON/array to Excel
     */
    const exportToExcel = useCallback(
        (data: any[], filename = "data.xlsx") => {
            try {
                const worksheet = XLSX.utils.json_to_sheet(data);
                const workbook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

                XLSX.writeFile(workbook, filename);
            } catch (error) {
                console.error("Export error:", error);
            }
        },
        []
    );

    return { parseFile, exportToExcel };
}
