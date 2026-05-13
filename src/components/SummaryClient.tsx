"use client";

import { useState } from "react";
import { Search, Filter, TrendingUp, Award, ChevronRight, User } from "lucide-react";
import Link from "next/link";

interface Grade {
  course: string;
  trimester: number;
  result: number;
}

interface VocationFollowup {
  trimester: number;
  interest: number;
  implication: number;
  participation: number;
  motivation: number;
}

interface Student {
  id: string;
  nom: string;
  prenom: string;
  codeEleve: string;
  province: string;
  grades: Grade[];
  vocationFollowups: VocationFollowup[];
}

interface SummaryClientProps {
  students: Student[];
}

export default function SummaryClient({ students }: SummaryClientProps) {
  const [search, setSearch] = useState("");
  const [trimesterFilter, setTrimesterFilter] = useState("all");

  const filteredStudents = students.filter(s => {
    const fullName = `${s.nom} ${s.prenom}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || s.codeEleve.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const getTrimesterAverage = (grades: Grade[], trimester: number) => {
    const triGrades = grades.filter(g => g.trimester === trimester);
    if (triGrades.length === 0) return null;
    return (triGrades.reduce((acc, g) => acc + g.result, 0) / triGrades.length).toFixed(1);
  };

  const getVocationAverage = (followups: VocationFollowup[], trimester: number) => {
    const f = followups.find(f => f.trimester === trimester);
    if (!f) return null;
    return ((f.interest + f.implication + f.participation + f.motivation) / 4).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Rechercher un élève par nom ou code..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th rowSpan={2} className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest border-r border-slate-200">Élève</th>
                <th colSpan={3} className="px-6 py-2 text-center text-[10px] font-black text-blue-600 uppercase tracking-widest border-b border-slate-200 border-r border-slate-200">Moyenne Notes (/20)</th>
                <th colSpan={3} className="px-6 py-2 text-center text-[10px] font-black text-emerald-600 uppercase tracking-widest border-b border-slate-200">Moyenne Vocationnelle (/5)</th>
                <th rowSpan={2} className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
              <tr className="bg-slate-50/50">
                <th className="px-4 py-2 text-center text-[10px] font-bold text-slate-400">T1</th>
                <th className="px-4 py-2 text-center text-[10px] font-bold text-slate-400">T2</th>
                <th className="px-4 py-2 text-center text-[10px] font-bold text-slate-400 border-r border-slate-200">T3</th>
                <th className="px-4 py-2 text-center text-[10px] font-bold text-slate-400">T1</th>
                <th className="px-4 py-2 text-center text-[10px] font-bold text-slate-400">T2</th>
                <th className="px-4 py-2 text-center text-[10px] font-bold text-slate-400">T3</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">
                    Aucun élève trouvé.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap border-r border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          <User size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{student.nom} {student.prenom}</p>
                          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">{student.codeEleve}</p>
                        </div>
                      </div>
                    </td>
                    
                    {/* Notes averages */}
                    {[1, 2, 3].map(t => {
                      const avg = getTrimesterAverage(student.grades, t);
                      return (
                        <td key={`n-${t}`} className={`px-4 py-4 text-center whitespace-nowrap ${t === 3 ? 'border-r border-slate-100' : ''}`}>
                          {avg ? (
                            <span className={`text-sm font-black ${Number(avg) >= 10 ? 'text-blue-600' : 'text-red-500'}`}>
                              {avg}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-300 font-bold">-</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Vocation averages */}
                    {[1, 2, 3].map(t => {
                      const avg = getVocationAverage(student.vocationFollowups, t);
                      return (
                        <td key={`v-${t}`} className="px-4 py-4 text-center whitespace-nowrap">
                          {avg ? (
                            <span className={`text-sm font-black ${Number(avg) >= 3.5 ? 'text-emerald-600' : Number(avg) >= 2.5 ? 'text-blue-500' : 'text-amber-500'}`}>
                              {avg}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-300 font-bold">-</span>
                          )}
                        </td>
                      );
                    })}

                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Link 
                        href={`/dashboard/students/${student.id}`}
                        className="inline-flex items-center gap-1 text-xs font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest"
                      >
                        Détails
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-600"></div>
          Moyenne Notes ≥ 10
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          Moyenne Notes {"<"} 10
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
          Vocation Excellente (≥ 3.5)
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          Vocation Moyenne (2.5 - 3.4)
        </div>
      </div>
    </div>
  );
}
