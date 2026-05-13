"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { Award } from "lucide-react";

interface VocationFollowup {
  trimester: number;
  interest: number;
  implication: number;
  participation: number;
  motivation: number;
}

interface VocationRadarChartProps {
  followups: VocationFollowup[];
}

export default function VocationRadarChart({ followups }: VocationRadarChartProps) {
  if (followups.length === 0) return null;

  const data = [
    { subject: 'Intérêt', fullMark: 5 },
    { subject: 'Implication', fullMark: 5 },
    { subject: 'Participation', fullMark: 5 },
    { subject: 'Motivation', fullMark: 5 },
  ];

  const processedData = data.map(item => {
    const newItem: any = { ...item };
    followups.forEach(f => {
      const key = item.subject === 'Intérêt' ? 'interest' :
                  item.subject === 'Implication' ? 'implication' :
                  item.subject === 'Participation' ? 'participation' : 'motivation';
      newItem[`T${f.trimester}`] = f[key as keyof VocationFollowup];
    });
    return newItem;
  });

  const COLORS = ["#10b981", "#2563eb", "#8b5cf6"];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
        <Award className="text-emerald-600" size={20} />
        Synthèse des Dimensions Vocationnelles
      </h3>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 'bold' }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 5]} 
              tick={{ fill: '#94a3b8', fontSize: 10 }}
              axisLine={false}
            />
            {followups.map((f, index) => (
              <Radar
                key={f.trimester}
                name={`Trimestre ${f.trimester}`}
                dataKey={`T${f.trimester}`}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
              />
            ))}
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {followups.map((f, index) => (
          <div key={index} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Moyenne T{f.trimester}</p>
            <p className="text-xl font-black text-slate-800">
              {((f.interest + f.implication + f.participation + f.motivation) / 4).toFixed(1)} <span className="text-xs text-slate-400">/ 5</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
