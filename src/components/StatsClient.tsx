"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { getStatusType } from "@/lib/recommendations";
import { TrendingUp, AlertCircle, CheckCircle, Activity } from "lucide-react";

interface Student {
  province: string;
  avisTest: string;
}

interface StatsClientProps {
  students: Student[];
}

export default function StatsClient({ students }: StatsClientProps) {
  if (!students || students.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Activity className="text-slate-400" size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Aucune donnée disponible</h3>
        <p className="text-slate-500 max-w-md mx-auto">
          Il n'y a actuellement aucun élève enregistré dans la base de données pour générer des statistiques.
          {/* @ts-ignore */}
          Veuillez importer des données Excel depuis le tableau de bord.
        </p>
      </div>
    );
  }

  // Process Global Data
  const globalData = [
    { name: "Normal", value: students.filter(s => getStatusType(s.avisTest) === "normal").length, color: "#10b981" },
    { name: "À Risque", value: students.filter(s => getStatusType(s.avisTest) === "risk").length, color: "#ef4444" },
    { name: "À Surveiller", value: students.filter(s => getStatusType(s.avisTest) === "monitor").length, color: "#f97316" },
  ].filter(d => d.value > 0);

  // Process Province Data
  const provinces = Array.from(new Set(students.map(s => s.province)));
  const provinceData = provinces.map(prov => {
    const provinceStudents = students.filter(s => s.province === prov);
    return {
      province: prov,
      Normal: provinceStudents.filter(s => getStatusType(s.avisTest) === "normal").length,
      "À Risque": provinceStudents.filter(s => getStatusType(s.avisTest) === "risk").length,
      "À Surveiller": provinceStudents.filter(s => getStatusType(s.avisTest) === "monitor").length,
      total: provinceStudents.length
    };
  }).sort((a, b) => b.total - a.total);

  // Generate Conclusions
  const totalAtRisk = globalData.find(d => d.name === "À Risque")?.value || 0;
  const totalMonitor = globalData.find(d => d.name === "À Surveiller")?.value || 0;
  const riskPercentage = ((totalAtRisk / students.length) * 100).toFixed(1);
  
  const mostAffectedProvince = [...provinceData].sort((a, b) => {
    const bRisk = (b["À Risque"] / b.total);
    const aRisk = (a["À Risque"] / a.total);
    return bRisk - aRisk;
  })[0];

  return (
    <div className="space-y-8">
      {/* Global Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart Global */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <TrendingUp className="mr-2 text-blue-600" size={20} />
            Répartition Globale (Toutes Provinces)
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={globalData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {globalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conclusions Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <CheckCircle className="mr-2 text-emerald-600" size={20} />
            Conclusions et Analyse
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-sm text-slate-600 mb-1 font-medium">Taux d'élèves à risque</p>
              <p className="text-2xl font-bold text-red-600">{riskPercentage}%</p>
              <p className="text-xs text-slate-400 mt-1">Sur un total de {students.length} élèves analysés.</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="text-red-500 mt-1 flex-shrink-0" size={18} />
                <p className="text-sm text-slate-700">
                  <span className="font-bold">{totalAtRisk} élèves</span> nécessitent une intervention pédagogique immédiate.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <Activity className="text-orange-500 mt-1 flex-shrink-0" size={18} />
                <p className="text-sm text-slate-700">
                  <span className="font-bold">{totalMonitor} élèves</span> sont dans une zone de vigilance (À surveiller).
                </p>
              </div>
              {mostAffectedProvince && (
                <div className="flex items-start space-x-3">
                  <TrendingUp className="text-blue-500 mt-1 flex-shrink-0" size={18} />
                  <p className="text-sm text-slate-700">
                    La province de <span className="font-bold">{mostAffectedProvince.province}</span>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart Provinces */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Comparaison par Province Éducationnelle</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={provinceData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="province" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Legend iconType="circle" />
              <Bar dataKey="Normal" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} barSize={40} />
              <Bar dataKey="À Surveiller" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} />
              <Bar dataKey="À Risque" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
