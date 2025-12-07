"use client";

import React, { useState } from "react";
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
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import { ALL_SCOPES } from "@/lib/constants";

const COLORS = ["#22c55e", "#15803d", "#0ea5e9", "#f59e0b", "#ef4444"];

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

interface GHGCompareBreakdownProps {
  selectedFacilitiesForCompare: string[];
  data: any[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { category } = payload[0].payload;
    return (
      <div className="rounded-xl bg-white p-3 shadow-md border border-gray-200">
        <p className="text-[10px] uppercase text-gray-500 tracking-wide">
          Greenhouse Gas Emissions
        </p>
        <p className="text-sm font-medium">{category}</p>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <span
              className={`inline-block w-2 h-2 rounded-sm bg-[${p.color}]`}
            />

            {p.dataKey}:{" "}
            <span className="font-medium">{Number(p.value).toFixed(2)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PlantBreakdownChart = ({
  data,
  selectedFacilitiesForCompare,
}: {
  data: any[];
  selectedFacilitiesForCompare: string[];
}) => (
  <ResponsiveContainer>
    <ComposedChart data={data}>
      <XAxis dataKey="category" fontSize={11} />
      <YAxis tick={{ fontSize: 11 }} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      {selectedFacilitiesForCompare.map((plant, i) => (
        <Bar
          key={plant}
          dataKey={plant}
          fill={COLORS[i % COLORS.length]}
          radius={[6, 6, 0, 0]}
        >
          <LabelList
            dataKey={plant}
            position="top"
            style={{ fontSize: "10px", fill: "#374151" }}
            formatter={(label: any) =>
              typeof label === "number" && label !== 0
                ? label.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : ""
            }
          />
        </Bar>
      ))}
    </ComposedChart>
  </ResponsiveContainer>
);

const GHGCompareBreakdown = ({ selectedFacilitiesForCompare, data }: GHGCompareBreakdownProps) => {
  const [scope, setScope] = useState<string>("scope1");

  const processedData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    let targetScope = "";
    if (scope === "scope1") targetScope = "Scope 1";
    else if (scope === "scope2") targetScope = "Scope 2";
    else if (scope.includes("scope3")) targetScope = "Scope 3";

    const filtered = data.filter(d => d.scope_name === targetScope);

    const catMap = new Map<string, any>();

    filtered.forEach(row => {
      let rawCategory = (row.main_category || "Uncategorized").trim();

      // Clean up category name similar to GHGBreakdownChart
      let cleanName = rawCategory
        .replace(/Direct Emissions from /i, "")
        .replace(/Indirect Emissions from /i, "")
        .replace(/Category \d+:\s*/i, "")
        .trim();

      const lowerName = cleanName.toLowerCase();
      if (SHORT_NAMES[lowerName]) {
        cleanName = SHORT_NAMES[lowerName];
      } else {
        if (lowerName.includes("purchased goods")) cleanName = "Goods";
        else if (lowerName.includes("upstream transportation")) cleanName = "Upstream";
        else if (lowerName.includes("fugitive sources")) cleanName = "Fugitive";
        else if (lowerName.includes("downstream transportation")) cleanName = "Downstream";
      }

      const facility = row.facility_name;

      if (selectedFacilitiesForCompare.includes(facility)) {
        const existing = catMap.get(cleanName) || { category: cleanName, scope: scope };
        existing[facility] = (existing[facility] || 0) + Number(row.total_carbon || 0);
        catMap.set(cleanName, existing);
      }
    });

    return Array.from(catMap.values());
  }, [data, scope, selectedFacilitiesForCompare]);

  return (
    <Card className="flex-1 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between">
        <CardTitle>GHG Breakdown Comparison</CardTitle>
        <div className="flex gap-2">
          <Select value={scope} onValueChange={setScope}>
            <SelectTrigger className="w-[140px] text-xs">
              <SelectValue placeholder="Select Scope" />
            </SelectTrigger>
            <SelectContent>
              {ALL_SCOPES.map((s) => (
                <SelectItem value={s.key} key={s.key}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="h-[260px]">
        <div className="h-full">
          <PlantBreakdownChart
            data={processedData}
            selectedFacilitiesForCompare={selectedFacilitiesForCompare}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default GHGCompareBreakdown;
