"use client";

import { useState } from "react";
import { Plus, Trash2, Calendar, User, FileText, CheckCircle } from "lucide-react";

interface Grade {
  id: string;
  course: string;
  trimester: number;
  result: number;
  date: string;
  responsable: string;
  observation: string | null;
}

interface GradesSectionProps {
  studentId: string;
  initialGrades: Grade[];
  isAdmin: boolean;
}

const COURSES = [
  "Français",
  "Psychopédagogie",
  "Méthodologie",
  "Didactique",
  "Mathématiques",
  "Stage pédagogique"
];

export default function GradesSection({ studentId, initialGrades, isAdmin }: GradesSectionProps) {
  const [grades, setGrades] = useState<Grade[]>(initialGrades);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      studentId,
      course: formData.get("course"),
      trimester: formData.get("trimester"),
      result: formData.get("result"),
      date: formData.get("date"),
      responsable: formData.get("responsable"),
      observation: formData.get("observation"),
    };

    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur lors de l'ajout de la note");

      const newGrade = await res.json();
      setGrades([...grades, newGrade].sort((a, b) => a.trimester - b.trimester));
      setShowForm(false);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette note ?")) return;

    try {
      const res = await fetch(`/api/grades?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setGrades(grades.filter(g => g.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="text-blue-600" size={24} />
          Suivi des Compétences et Notes
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-bold shadow-sm"
        >
          {showForm ? "Annuler" : <><Plus size={18} /> Ajouter une note</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-blue-100 shadow-md space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cours</label>
              <select name="course" required className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trimestre</label>
              <select name="trimester" required className="w-full p-2 border border-slate-200 rounded-lg text-sm">
                <option value="1">1er Trimestre</option>
                <option value="2">2ème Trimestre</option>
                <option value="3">3ème Trimestre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Résultat / Note</label>
              <input name="result" type="number" step="0.01" required className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Ex: 15.5" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date de l'activité</label>
              <input name="date" type="date" required className="w-full p-2 border border-slate-200 rounded-lg text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Responsable</label>
              <input name="responsable" type="text" required className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Nom de l'enseignant" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Observation</label>
            <textarea name="observation" rows={2} className="w-full p-2 border border-slate-200 rounded-lg text-sm" placeholder="Commentaire sur l'évolution..."></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50 font-bold text-sm transition-all"
            >
              {loading ? "Enregistrement..." : "Enregistrer la note"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Trimestre</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Cours</th>
              <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Note</th>
              <th className="hidden md:table-cell px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Responsable</th>
              <th className="hidden lg:table-cell px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Observation</th>
              <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {grades.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                  Aucune note enregistrée pour cet élève.
                </td>
              </tr>
            ) : (
              grades.map((grade) => (
                <tr key={grade.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-bold">
                      T{grade.trimester}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-slate-700">
                    {grade.course}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-sm font-black ${grade.result >= 10 ? "text-emerald-600" : "text-red-600"}`}>
                      {grade.result}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <User size={12} /> {grade.responsable}
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-4 py-4 text-xs text-slate-500 max-w-xs truncate">
                    {grade.observation}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(grade.id)}
                        className="text-slate-300 hover:text-red-600 p-2 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
