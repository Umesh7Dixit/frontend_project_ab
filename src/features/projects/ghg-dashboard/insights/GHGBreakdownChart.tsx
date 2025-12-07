"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Bar,
  LabelList,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SCOPE_COLORS } from "./utils";
import { SCOPES } from "@/lib/constants";

const scopeToColor = (scope: string) => {
  if (scope.includes("scope1")) return SCOPE_COLORS.scope1;
  if (scope.includes("scope2")) return SCOPE_COLORS.scope2;
  if (scope.includes("scope3")) return SCOPE_COLORS.scope3;
  if (scope.includes("total")) return SCOPE_COLORS.total;
  return "#9CA3AF";
};

const SHORT_NAMES: Record<string, string> = {
  "purchased goods and services": "Goods",
  "capital goods": "Capital Goods",
  "fuel-and-energy-related activities": "Energy",
  "upstream transportation and distribution": "Upstream",
  "waste generated in operations": "Waste",
  "business travel": "Travel",
  "direct emissions from mobile combustion": "Mobile",
  "direct emissions from fugitive sources": "Fugitive",
  "employee commuting": "Commuting",
  "upstream leased assets": "Upstream Leased",
  "downstream transportation and distribution": "Downstream",
  "processing of sold products": "Processing",
  "use of sold products": "Use of Sold",
  "end-of-life treatment of sold products": "End-of-Life",
  "downstream leased assets": "Downstream Leased",
  "franchises": "Franchises",
  "investments": "Investments",
};

const transformData = (data: any[]) => {
  const grouped: Record<string, Record<string, number>> = {};

  data.forEach((item) => {
    const rawScope = item.scope_name || "Unknown";
    const rawCategory = (item.main_category || "Other").trim();
    const val = parseFloat(item.total_carbon) || 0;

    let scopeKey = "scope1";
    const lowerScope = rawScope.toLowerCase();

    if (lowerScope.includes("scope 1")) scopeKey = "scope1";
    else if (lowerScope.includes("scope 2")) scopeKey = "scope2";
    else if (lowerScope.includes("scope 3")) scopeKey = "scope3";

    // Clean up category name
    let cleanName = rawCategory
      .replace(/Direct Emissions from /i, "")
      .replace(/Indirect Emissions from /i, "")
      .replace(/Category \d+:\s*/i, "")
      .trim();

    // Apply short name mapping
    const lowerName = cleanName.toLowerCase();
    if (SHORT_NAMES[lowerName]) {
      cleanName = SHORT_NAMES[lowerName];
    } else {
      // Fallback for partial matches if needed, or leave as is
      if (lowerName.includes("purchased goods")) cleanName = "Goods";
      else if (lowerName.includes("upstream transportation")) cleanName = "Upstream";
      else if (lowerName.includes("fugitive sources")) cleanName = "Fugitive";
      else if (lowerName.includes("downstream transportation")) cleanName = "Downstream";
    }

    if (!grouped[scopeKey]) {
      grouped[scopeKey] = {};
    }
    if (!grouped[scopeKey][cleanName]) {
      grouped[scopeKey][cleanName] = 0;
    }
    grouped[scopeKey][cleanName] += val;
  });

  const result: any[] = [];
  const scopeOrder = ["scope1", "scope2", "scope3"];

  scopeOrder.forEach((scopeKey) => {
    const categories = grouped[scopeKey];
    if (!categories) return;

    let scopeTotal = 0;
    Object.entries(categories).forEach(([cat, val]) => {
      result.push({
        category: cat,
        scope: scopeKey,
        value: val,
        uniqueId: `${scopeKey}-${cat}`,
      });
      scopeTotal += val;
    });

    if (scopeTotal > 0) {
      result.push({
        category: "Total",
        scope: "total",
        realScope: scopeKey,
        value: scopeTotal,
        uniqueId: `${scopeKey}-Total`,
      });
    }
  });

  return result;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { category, scope, value, realScope } = payload[0].payload;
    const displayScope = realScope || scope;

    return (
      <div className="rounded-xl bg-white p-3 shadow-md border border-gray-200">
        <p className="text-[10px] uppercase text-gray-500 tracking-wide">
          Greenhouse Gas Emissions
        </p>
        <p className="text-sm font-medium">{category || "Total"}</p>
        <p
          className={`text-base font-bold ${value >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
        >
          {value.toFixed(2)} tCO₂e
        </p>
        <p className="text-xs text-gray-400">{displayScope}</p>
      </div>
    );
  };
  return null;
};

const renderLegend = () => {
  const scopes = [
    { label: SCOPES.SCOPE_1_LABEL, color: SCOPE_COLORS.scope1 },
    { label: SCOPES.SCOPE_2_LABEL, color: SCOPE_COLORS.scope2 },
    { label: SCOPES.SCOPE_3_LABEL, color: SCOPE_COLORS.scope3 },
    { label: "Total", color: SCOPE_COLORS.total },
  ];

  return (
    <ul className="flex items-center justify-center gap-4 text-xs mt-3 w-full">
      {scopes.map((s) => (
        <li key={s.label} className="flex items-center gap-1">
          <span
            className="w-3 h-3 inline-block rounded-sm"
            style={{ background: s.color }}
          />
          {s.label}
        </li>
      ))}
    </ul>
  );
};

const GHGBreakdownChart = ({ data }: { data: any[] }) => {
  const [filterType, setFilterType] = useState<"Monthly" | "Yearly">("Yearly");
  const [filterValue, setFilterValue] = useState<string>("");

  const filterOptions = useMemo(() => {
    if (!data || data.length === 0) return [];

    const unique = new Set<string>();
    data.forEach(item => {
      if (!item.reporting_month) return;
      const date = new Date(item.reporting_month);
      if (isNaN(date.getTime())) return;

      if (filterType === "Yearly") {
        unique.add(date.getFullYear().toString());
      } else {
        unique.add(item.reporting_month);
      }
    });

    return Array.from(unique).sort((a, b) => {
      if (filterType === "Yearly") {
        return parseInt(b) - parseInt(a);
      }

      const dateA = new Date(a);
      const dateB = new Date(b);
      if (!isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
        return dateB.getTime() - dateA.getTime();
      }
      return b.localeCompare(a);
    });
  }, [data, filterType]);

  useEffect(() => {
    // Check if current filterValue is valid for new options, else reset
    if (!filterOptions.includes(filterValue)) {
      if (filterOptions.length > 0) {
        setFilterValue(filterOptions[0]);
      } else {
        setFilterValue("");
      }
    }
  }, [filterOptions, filterValue]);

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const filtered = data.filter(item => {
      if (!filterValue || !item.reporting_month) return true;
      const date = new Date(item.reporting_month);
      if (isNaN(date.getTime())) return false;

      if (filterType === "Yearly") {
        return date.getFullYear().toString() === filterValue;
      } else {
        return item.reporting_month === filterValue;
      }
    });

    return transformData(filtered);
  }, [data, filterValue, filterType]);

  return (
    <Card className="flex-1 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>GHG Breakdown by Scope</CardTitle>
        <div className="flex gap-2">
          <Select
            value={filterType}
            onValueChange={(val: "Monthly" | "Yearly") => setFilterType(val)}
          >
            <SelectTrigger className="w-[100px] h-8 text-xs bg-white/50">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filterValue}
            onValueChange={setFilterValue}
            disabled={!filterOptions.length}
          >
            <SelectTrigger className="w-[140px] h-8 text-xs bg-white/50">
              <SelectValue placeholder={filterType === "Yearly" ? "Select Year" : "Select Month"} />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map(opt => (
                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="h-[360px]">
        <ResponsiveContainer>
          <ComposedChart data={processedData}>
            <XAxis
              dataKey="uniqueId"
              tickFormatter={(val, index) => processedData[index]?.category || val}
              fontSize={10}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number) => value.toFixed(2)}
              content={<CustomTooltip />} />
            <Legend content={renderLegend} />

            <Bar
              dataKey="value"
              isAnimationActive={false}
              shape={(props: any) => {
                const { x, y, width, height, payload } = props;
                const isTotal = payload.scope === "total";
                const fill = isTotal
                  ? scopeToColor("total")
                  : scopeToColor(payload.scope);
                const rx = isTotal ? 4 : 6;

                return (
                  <rect
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={fill}
                    rx={rx}
                    ry={rx}
                  />
                );
              }}
            >
              <LabelList
                dataKey="value"
                position="top"
                formatter={(label: any) =>
                  typeof label === "number" && label !== 0
                    ? label.toLocaleString()
                    : ""
                }
                style={{ fontSize: "10px", fill: "#374151" }}
              />
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GHGBreakdownChart;
