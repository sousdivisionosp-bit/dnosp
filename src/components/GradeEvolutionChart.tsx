"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface Grade {
  course: string;
  trimester: number;
  result: number;
}

interface GradeEvolutionChartProps {
  grades: Grade[];
}

export default function GradeEvolutionChart({ grades }: GradeEvolutionChartProps) {
  if (grades.length === 0) return null;

  // Prepare data for Recharts
  // We want an array of objects like: { trimester: 'T1', 'Français': 12, 'Maths': 15 }
  const dataMap = new Map<number, any>();

  grades.forEach((g) => {
    if (!dataMap.has(g.trimester)) {
      dataMap.set(g.trimester, { trimester: `T${g.trimester}`, rawTrimester: g.trimester });
    }
    const current = dataMap.get(g.trimester);
    current[g.course] = g.result;
  });

  const data = Array.from(dataMap.values()).sort((a, b) => a.rawTrimester - b.rawTrimester);
  const courses = Array.from(new Set(grades.map((g) => g.course)));

  const COLORS = [
    "#2563eb", // blue-600
    "#10b981", // emerald-500
    "#f59e0b", // amber-500
    "#ef4444", // red-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
  ];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <TrendingUp className="text-blue-600" size={20} />
        Évolution des Compétences (Trimestriel)
      </h3>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="trimester" 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12, fontWeight: 'bold'}}
            />
            <YAxis 
              domain={[0, 20]} 
              axisLine={false} 
              tickLine={false} 
              tick={{fill: '#64748b', fontSize: 12}}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend />
            {courses.map((course, index) => (
              <Line
                key={course}
                type="monotone"
                dataKey={course}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
