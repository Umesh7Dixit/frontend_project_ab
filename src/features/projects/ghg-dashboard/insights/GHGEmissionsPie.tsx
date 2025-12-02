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
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={3}
              cornerRadius={8}
              dataKey="value"
              animationBegin={0}
              animationDuration={900}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                background: "#fff",
                borderRadius: "12px",
                border: "#10B981",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              }}
              formatter={(value: any) =>
                Number(value).toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })
              }
              wrapperStyle={{ zIndex: 50 }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none leading-tight">
          <p className="text-xl font-bold">{formattedTotal}</p>
          <p className="text-sm text-gray-600">tCO₂e</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GHGEmissionsPie;
