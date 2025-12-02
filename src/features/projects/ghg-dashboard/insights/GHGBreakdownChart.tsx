"use client";

import React, { useMemo } from "react";
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
import { GHG_BREAKDOWN_MOCK_DATA, SCOPE_COLORS } from "./utils";
import { SCOPES } from "@/lib/constants";

// map scope → color
const scopeToColor = (scope: string) => {
  if (scope.includes("scope1")) return SCOPE_COLORS.scope1;
  if (scope.includes("scope2")) return SCOPE_COLORS.scope2;
  if (scope.includes("scope3Upstream")) return SCOPE_COLORS.scope3Upstream;
  if (scope.includes("scope3Downstream")) return SCOPE_COLORS.scope3Downstream;
  if (scope.includes("total")) return SCOPE_COLORS.total;
  return "#9CA3AF";
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { category, scope, value } = payload[0].payload;
    return (
      <div className="rounded-xl bg-white p-3 shadow-md border border-gray-200">
        <p className="text-[10px] uppercase text-gray-500 tracking-wide">
          Greenhouse Gas Emissions
        </p>
        <p className="text-sm font-medium">{category || "Total"}</p>
        <p
          className={`text-base font-bold ${
            value >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {value.toLocaleString()} tCO₂e
        </p>
        <p className="text-xs text-gray-400">{scope}</p>
      </div>
    );
  }
  return null;
};

const renderLegend = () => {
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
    { label: "Total", color: SCOPE_COLORS.total },
  ];

  return (
    <ul className="flex items-center justify-center gap-4 text-xs mt-3 w-full">
      {scopes.map((s) => (
        <li key={s.label} className="flex items-center gap-1">
          <span
            className="w-3 h-3 inline-block rounded-sm bg-[${s.color}"
            // style={{ background: s.color }}
          />
          {s.label}
        </li>
      ))}
    </ul>
  );
};

const GHGBreakdownChart = () => {
  // compute per-group waterfall offsets (start/end), resetting on every 'total' row
  const processedData = useMemo(() => {
    let groupCum = 0;
    return GHG_BREAKDOWN_MOCK_DATA.map((item) => {
      if (item.scope === "total") {
        // totals are full bars from 0
        groupCum = 0; // reset for the next group
        return { ...item, start: 0, end: item.value };
      } else {
        const start = groupCum;
        const end = start + item.value;
        groupCum = end;
        return { ...item, start, end };
      }
    });
  }, []);

  return (
    <Card className="flex-1 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle>GHG Breakdown by Scope</CardTitle>
      </CardHeader>
      <CardContent className="h-[360px]">
        <ResponsiveContainer>
          <ComposedChart data={processedData}>
            <XAxis dataKey="category" fontSize={11} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={renderLegend} />

            {/* invisible baseline to "push" floating bars up per-group */}
            <Bar dataKey="start" stackId="a" fill="transparent" />

            <Bar
              dataKey="value"
              stackId="a"
              isAnimationActive={false}
              shape={(props: any) => {
                const { x, y, width, height, payload } = props;
                // pick look depending on whether this is a total or a scope item
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
