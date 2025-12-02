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
import {
  GHG_BREAKDOWN_MOCK_DATA,
  SCOPE_COLORS,
  UNIT_OPTIONS,
} from "../insights/utils";
import { ALL_SCOPES, SCOPES } from "@/lib/constants";

const COLORS = ["#22c55e", "#15803d", "#0ea5e9", "#f59e0b", "#ef4444"];

interface GHGCompareBreakdownProps {
  selectedPlants: string[];
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
            {/* <span
              className="inline-block w-2 h-2 rounded-sm"
              style={{ background: p.color }}
            /> */}
            <span
  className={`inline-block w-2 h-2 rounded-sm bg-[${p.color}]`}
/>

            {p.dataKey}:{" "}
            <span className="font-medium">{p.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const _renderLegend = () => {
  const scopes = [
    { label: SCOPES.SCOPE_1_LABEL, color: SCOPE_COLORS.scope1 },
    { label: SCOPES.SCOPE_2_LABEL, color: SCOPE_COLORS.scope2 },
    {
      label: SCOPES.SCOPE_3_UPSTREAM_LABEL,
      color: SCOPE_COLORS.scope3Upstream,
    },
    {
      label: SCOPES.SCOPE_3_DOWNSTREAM_LABEL,
      color: SCOPE_COLORS.scope3Downstream,
    },
  ];

  return (
    <ul className="flex items-center justify-center gap-4 text-xs mt-3 w-full">
      {scopes.map((s) => (
        <li key={s.label} className="flex items-center gap-1">
          {/* <span
            className="w-3 h-3 inline-block rounded-sm"
            style={{ background: s.color }}
          /> */}
          {/* <span
            className={`w-3 h-3 inline-block rounded-sm ${s.color ? '' : ''}`}
            data-color={s.color}
          /> */}
          <span className={`w-3 h-3 inline-block rounded-sm bg-[${s.color}]`} />


          {s.label}
        </li>
      ))}
    </ul>
  );
};

const PlantBreakdownChart = ({
  data,
  selectedPlants,
}: {
  data: any[];
  selectedPlants: string[];
}) => (
  <ResponsiveContainer>
    <ComposedChart data={data}>
      <XAxis dataKey="category" fontSize={11} />
      <YAxis tick={{ fontSize: 11 }} />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      {selectedPlants.map((plant, i) => (
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
                ? label.toLocaleString()
                : ""
            }
          />
        </Bar>
      ))}
    </ComposedChart>
  </ResponsiveContainer>
);

const GHGCompareBreakdown = ({ selectedPlants }: GHGCompareBreakdownProps) => {
  const [unit, setUnit] = useState<string>(UNIT_OPTIONS[0]);
  const [scope, setScope] = useState<string>("scope1");

  // 🔑 Build per-plant dataset
  const buildData = (raw: typeof GHG_BREAKDOWN_MOCK_DATA) =>
    raw.map((row) => {
      const obj: Record<string, any> = {
        category: row.category,
        scope: row.scope,
      };
      selectedPlants.forEach((plant, i) => {
        // Fake values for demo → offset with +i*100
        obj[plant] = row.value + i * 100;
      });
      return obj;
    });

  const data = buildData(GHG_BREAKDOWN_MOCK_DATA);

  return (
    <Card className="flex-1 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between">
        <CardTitle>GHG Breakdown Comparison</CardTitle>
        <div className="flex gap-2">
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-[120px] text-xs">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              {UNIT_OPTIONS.map((u) => (
                <SelectItem key={u} value={u}>
                  {u}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
        {scope === "Scope 3" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            <PlantBreakdownChart
              data={data.filter((d) => d.scope.includes("Upstream"))}
              selectedPlants={selectedPlants}
            />
            <PlantBreakdownChart
              data={data.filter((d) => d.scope.includes("Downstream"))}
              selectedPlants={selectedPlants}
            />
          </div>
        ) : (
          <div className="h-full">
            <PlantBreakdownChart
              data={data.filter((d) => d.scope.includes(scope))}
              selectedPlants={selectedPlants}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GHGCompareBreakdown;
