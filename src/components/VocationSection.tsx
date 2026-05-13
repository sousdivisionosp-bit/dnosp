"use client";

import { useState } from "react";
import { Plus, ClipboardCheck, User, Calendar, Trash2 } from "lucide-react";

interface VocationFollowup {
  id: string;
  trimester: number;
  interest: number;
  implication: number;
  participation: number;
  motivation: number;
  date: string;
  responsable: string;
  observation: string | null;
}

interface VocationSectionProps {
  studentId: string;
  initialFollowups: VocationFollowup[];
  isAdmin: boolean;
}

const SCORE_LABELS: Record<string, Record<number, string>> = {
  interest: {
    1: "Très faible",
    2: "Faible",
    3: "Moyen",
    4: "Bon",
    5: "Excellent"
  },
  participation: {
    1: "Ne participe jamais",
    2: "Participe rarement",
    3: "Participe parfois",
    4: "Participe souvent",
    5: "Très actif"
  },
  general: {
    1: "Très faible",
    2: "Faible",
    3: "Moyen",
    4: "Bon",
    5: "Excellent"
  }
};

export default function VocationSection({ studentId, initialFollowups, isAdmin }: VocationSectionProps) {
  const [followups, setFollowups] = useState<VocationFollowup[]>(initialFollowups);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      studentId,
      trimester: formData.get("trimester"),
      interest: formData.get("interest"),
      implication: formData.get("implication"),
      participation: formData.get("participation"),
      motivation: formData.get("motivation"),
      date: formData.get("date"),
      responsable: formData.get("responsable"),
      observation: formData.get("observation"),
    };

    try {
      const res = await fetch("/api/vocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erreur lors de l'enregistrement");

      const newFollowup = await res.json();
      setFollowups([...followups, newFollowup].sort((a, b) => a.trimester - b.trimester));
      setShowForm(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce suivi ?")) return;
    try {
      const res = await fetch(`/api/vocation?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      setFollowups(followups.filter(f => f.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="mt-12 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <ClipboardCheck className="text-emerald-600" size={24} />
          Dimensions Vocationnelles
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all text-sm font-bold shadow-sm"
        >
          {showForm ? "Annuler" : <><Plus size={18} /> Évaluer le trimestre</>}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-md space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Trimestre</label>
              <select name="trimester" required className="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <option value="1">1er Trimestre</option>
                <option value="2">2ème Trimestre</option>
                <option value="3">3ème Trimestre</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date</label>
              <input name="date" type="date" required className="w-full p-2.5 border border-slate-200 rounded-xl text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Responsable</label>
              <input name="responsable" type="text" required className="w-full p-2.5 border border-slate-200 rounded-xl text-sm" placeholder="Nom de l'observateur" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <DimensionInput name="interest" label="Intérêt" labels={SCORE_LABELS.interest} />
            <DimensionInput name="implication" label="Implication" labels={SCORE_LABELS.general} />
            <DimensionInput name="participation" label="Participation" labels={SCORE_LABELS.participation} />
            <DimensionInput name="motivation" label="Motivation" labels={SCORE_LABELS.general} />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Observations générales</label>
            <textarea name="observation" rows={2} className="w-full p-3 border border-slate-200 rounded-xl text-sm" placeholder="Remarques sur l'évolution vocationnelle..."></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 font-bold text-sm transition-all shadow-lg"
            >
              {loading ? "Enregistrement..." : "Enregistrer l'évaluation"}
            </button>
          </div>
        </form>
      )}

      {/* Synthesis Table */}
      <div className="grid grid-cols-1 gap-6">
        {followups.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-200 text-center text-slate-400 font-medium">
            Aucun suivi vocationnel enregistré.
          </div>
        ) : (
          followups.map((f) => (
            <div key={f.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-black">
                    TRIMESTRE {f.trimester}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <Calendar size={14} /> {new Date(f.date).toLocaleDateString()}
                    <span className="mx-2">•</span>
                    <User size={14} /> {f.responsable}
                  </div>
                </div>
                {isAdmin && (
                  <button onClick={() => handleDelete(f.id)} className="text-slate-300 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <div className="p-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
                <DimensionResult label="Intérêt" value={f.interest} labelText={SCORE_LABELS.interest[f.interest]} />
                <DimensionResult label="Implication" value={f.implication} labelText={SCORE_LABELS.general[f.implication]} />
                <DimensionResult label="Participation" value={f.participation} labelText={SCORE_LABELS.participation[f.participation]} />
                <DimensionResult label="Motivation" value={f.motivation} labelText={SCORE_LABELS.general[f.motivation]} />
              </div>

              {f.observation && (
                <div className="px-6 pb-6 text-sm text-slate-600 italic border-t border-slate-50 pt-4 mx-6">
                  " {f.observation} "
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DimensionInput({ name, label, labels }: { name: string, label: string, labels: Record<number, string> }) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-black text-slate-700 uppercase tracking-tight">{label} (/5)</label>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((val) => (
          <label key={val} className="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name={name} value={val} required className="w-4 h-4 text-emerald-600 focus:ring-emerald-500" />
            <span className="text-xs text-slate-600 group-hover:text-emerald-600 transition-colors">
              <span className="font-bold mr-1">{val}</span> - {labels[val]}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

function DimensionResult({ label, value, labelText }: { label: string, value: number, labelText: string }) {
  return (
    <div className="text-center space-y-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <div className="relative inline-flex items-center justify-center">
        <span className={`text-3xl font-black ${value >= 4 ? 'text-emerald-600' : value >= 3 ? 'text-blue-600' : 'text-amber-600'}`}>
          {value}
        </span>
        <span className="text-xs font-bold text-slate-300 ml-1">/5</span>
      </div>
      <p className="text-[10px] font-bold text-slate-500 bg-slate-100 py-1 px-2 rounded-full truncate">
        {labelText}
      </p>
    </div>
  );
}
