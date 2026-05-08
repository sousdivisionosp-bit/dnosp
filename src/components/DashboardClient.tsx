"use client";

import { useState } from "react";
import { Users, AlertTriangle, Activity, CheckCircle, Search, Trash2 } from "lucide-react";
import { getStatusType } from "@/lib/recommendations";

interface Student {
  id: string;
  nom: string;
  postNom: string | null;
  prenom: string;
  province: string;
  etablissement: string;
  sexe: string;
  avisTest: string;
  codeEleve: string;
}

interface DashboardStatsProps {
  students: Student[];
  isAdmin: boolean;
}

export default function DashboardClient({ students, isAdmin }: DashboardStatsProps) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [schoolSearch, setSchoolSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'élève ${name} ?`)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/students?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      window.location.reload(); // Recharger pour mettre à jour la liste
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const stats = {
    total: students.length,
    atRisk: students.filter(s => getStatusType(s.avisTest) === "risk").length,
    toMonitor: students.filter(s => getStatusType(s.avisTest) === "monitor").length,
    normal: students.filter(s => getStatusType(s.avisTest) === "normal").length,
  };

  const filteredStudents = students.filter(s => {
    const status = getStatusType(s.avisTest);
    const matchesFilter = 
      filter === "all" || 
      (filter === "risk" && status === "risk") ||
      (filter === "monitor" && status === "monitor") ||
      (filter === "normal" && status === "normal");
    
    const fullName = `${s.nom} ${s.postNom || ""} ${s.prenom}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || 
                         s.codeEleve?.toLowerCase().includes(search.toLowerCase());
    
    const matchesSchool = s.etablissement?.toLowerCase().includes(schoolSearch.toLowerCase());
    
    return matchesFilter && matchesSearch && matchesSchool;
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Élèves" 
          value={stats.total} 
          icon={<Users size={24} />} 
          color="bg-blue-500" 
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <StatCard 
          title="À Risque" 
          value={stats.atRisk} 
          icon={<AlertTriangle size={24} />} 
          color="bg-red-500" 
          active={filter === "risk"}
          onClick={() => setFilter("risk")}
        />
        <StatCard 
          title="À Surveiller" 
          value={stats.toMonitor} 
          icon={<Activity size={24} />} 
          color="bg-orange-500" 
          active={filter === "monitor"}
          onClick={() => setFilter("monitor")}
        />
        <StatCard 
          title="Normal" 
          value={stats.normal} 
          icon={<CheckCircle size={24} />} 
          color="bg-green-500" 
          active={filter === "normal"}
          onClick={() => setFilter("normal")}
        />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-3 flex-grow">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Nom ou code élève..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Rechercher par école..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Affichage:</span>
          <select 
            className="border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Tous les élèves</option>
            <option value="risk">Élèves à Risque</option>
            <option value="monitor">Élèves à Surveiller</option>
            <option value="normal">Élèves Normaux</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Élève</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Province</th>
                <th className="hidden lg:table-cell px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Établissement</th>
                <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                {isAdmin && <th className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-10 text-center text-slate-500">
                    Aucun élève ne correspond à ces critères
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <a href={`/dashboard/students/${student.id}`} className="block">
                        <div className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                          {student.nom} {student.prenom}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium sm:hidden">
                          {student.province} • {student.sexe}
                        </div>
                      </a>
                    </td>
                    <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {student.province}
                    </td>
                    <td className="hidden lg:table-cell px-4 py-4 whitespace-nowrap text-sm text-slate-500">
                      {student.etablissement}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <StatusBadge status={student.avisTest} />
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleDelete(student.id, `${student.nom} ${student.prenom}`)}
                          disabled={deletingId === student.id}
                          className="text-slate-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                          title="Supprimer l'élève"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center p-4 rounded-lg shadow-sm border transition-all text-left ${
        active ? `ring-2 ring-offset-2 ring-opacity-50 border-transparent scale-105 ${color.replace('bg-', 'ring-')}` : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className={`p-3 rounded-full text-white ${color} mr-4`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusType = getStatusType(status);
  
  const configs: any = {
    normal: { label: "Normal", classes: "bg-emerald-100 text-emerald-800" },
    risk: { label: "À Risque", classes: "bg-red-100 text-red-800" },
    monitor: { label: "À Surveiller", classes: "bg-orange-100 text-orange-800" },
  };

  const config = configs[statusType] || { label: "Inconnu", classes: "bg-slate-100 text-slate-800" };

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-bold rounded-full ${config.classes}`}>
      {config.label}
    </span>
  );
}
