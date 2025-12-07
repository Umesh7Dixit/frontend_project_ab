"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export interface EmissionSummary {
  project_name: string;
  total_carbon: number;
  scope_1_total: number;
  scope_2_total: number;
  scope_3_total: number;
}

export interface EmissionSlice {
  name: string;
  value: number;
  color: string;
}

type Props = {
  chartData: EmissionSlice[];
  total: number;
};

const GHGEmissionsPie = ({ chartData, total }: Props) => {
  const formattedTotal = Number(total).toFixed(2);

  return (
    <Card className="flex-1 bg-white/60 backdrop-blur-md shadow-xl rounded-2xl">
      <CardHeader>
        <CardTitle>Emissions by Activity</CardTitle>
      </CardHeader>

      <CardContent className="h-[280px] relative">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              innerRadius="65%"
              outerRadius="90%"
              paddingAngle={2}
              cornerRadius={6}
              dataKey="value"
              animationBegin={0}
              animationDuration={900}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#fff",
                borderRadius: "12px",
                border: "none",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                fontSize: "12px"
              }}
              formatter={(value: any) =>
                Number(value).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                }) + " tCO₂e"
              }
            />

            <path d="" />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-6">
          <p className="text-3xl font-bold tracking-tighter text-gray-800">{formattedTotal}</p>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">tCO₂e</p>
        </div>

        <div className="flex justify-center gap-4 mt-[-20px] pb-2">
          {chartData.map(item => (
            <div key={item.name} className="flex items-center gap-1 text-xs text-gray-600">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              {item.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GHGEmissionsPie;
