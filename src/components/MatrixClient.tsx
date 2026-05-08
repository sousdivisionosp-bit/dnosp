"use client";

import { useState } from "react";
import { 
  Target, 
  Lightbulb, 
  Trophy, 
  AlertOctagon, 
  ArrowRight, 
  CheckCircle2, 
  Users 
} from "lucide-react";
import MatrixModal from "@/components/MatrixModal";

interface Student {
  id: string;
  nom: string;
  prenom: string;
  province: string;
  codeEleve: string;
  category: string;
}

interface MatrixClientProps {
  students: Student[];
  counts: {
    vocation_competences: number;
    faible_vocation_competences: number;
    competences_faible_vocation: number;
    vocation_faibles_competences: number;
  };
}

export default function MatrixClient({ students, counts }: MatrixClientProps) {
  const [selectedGroup, setSelectedGroup] = useState<{id: string, title: string} | null>(null);

  const groups = [
    {
      id: "vocation_faibles_competences",
      title: "Bonne vocation + faibles compétences",
      icon: <Lightbulb className="text-blue-500" size={32} />,
      suivi: "Suivi de remédiation académique et pédagogique",
      activities: [
        "Remédiation scolaire",
        "Tutorat",
        "Exercices pratiques",
        "Micro-enseignement",
        "Coaching méthodologique"
      ],
      indicators: [
        "Amélioration des notes",
        "Participation pédagogique",
        "Maîtrise des contenus",
        "Progression des compétences",
        "Capacité d’enseigner"
      ],
      evaluation: "Évaluation de performance académique et pédagogique",
      color: "border-blue-200 bg-blue-50/30",
      headerColor: "bg-blue-600",
      count: counts.vocation_faibles_competences
    },
    {
      id: "competences_faible_vocation",
      title: "Bonnes compétences + faible vocation",
      icon: <Target className="text-purple-500" size={32} />,
      suivi: "Suivi motivationnel et orientationnel",
      activities: [
        "Entretiens d’orientation",
        "Découverte du métier",
        "Témoignages d’enseignants",
        "Activités de leadership",
        "Immersion pédagogique"
      ],
      indicators: [
        "Motivation",
        "Intérêt pour l’enseignement",
        "Engagement",
        "Participation volontaire",
        "Satisfaction envers l’option"
      ],
      evaluation: "Évaluation vocationnelle et motivationnelle",
      color: "border-purple-200 bg-purple-50/30",
      headerColor: "bg-purple-600",
      count: counts.competences_faible_vocation
    },
    {
      id: "vocation_competences",
      title: "Bonne vocation + bonnes compétences",
      icon: <Trophy className="text-emerald-500" size={32} />,
      suivi: "Suivi d’excellence et de leadership",
      activities: [
        "Tutorat des pairs",
        "Clubs pédagogiques",
        "Concours pédagogiques",
        "Responsabilités scolaires",
        "Encadrement des autres élèves"
      ],
      indicators: [
        "Maintien des performances",
        "Leadership",
        "Autonomie",
        "Créativité pédagogique",
        "Initiative"
      ],
      evaluation: "Évaluation de consolidation et de développement du potentiel",
      color: "border-emerald-200 bg-emerald-50/30",
      headerColor: "bg-emerald-600",
      count: counts.vocation_competences
    },
    {
      id: "faible_vocation_competences",
      title: "Faible vocation + faibles compétences",
      icon: <AlertOctagon className="text-red-500" size={32} />,
      suivi: "Suivi intensif et accompagnement global",
      activities: [
        "Coaching individuel",
        "Soutien psychopédagogique",
        "Remédiation académique",
        "Entretiens familiaux",
        "Activités de motivation",
        "Réorientation si nécessaire"
      ],
      indicators: [
        "Évolution des notes",
        "Motivation",
        "Discipline",
        "Participation",
        "Comportement",
        "Assiduité"
      ],
      evaluation: "Évaluation globale d’évolution ou de réorientation",
      color: "border-red-200 bg-red-50/30",
      headerColor: "bg-red-600",
      count: counts.faible_vocation_competences
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {groups.map((group, index) => (
          <div 
            key={index} 
            className={`flex flex-col rounded-2xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md ${group.color}`}
          >
            {/* Header */}
            <div className={`${group.headerColor} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                    {group.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{group.title}</h2>
                    <p className="text-white/80 text-sm font-medium mt-1">
                      {group.suivi}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black">{group.count}</div>
                  <div className="text-[10px] font-bold uppercase tracking-tighter opacity-70">Élèves</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <ArrowRight size={16} className="text-slate-400" />
                  Activités recommandées
                </h3>
                <ul className="space-y-2">
                  {group.activities.map((act, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                      {act}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                  <ArrowRight size={16} className="text-slate-400" />
                  Indicateurs à observer
                </h3>
                <ul className="space-y-2">
                  {group.indicators.map((ind, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                      <CheckCircle2 size={14} className="mt-0.5 text-emerald-500 flex-shrink-0" />
                      {ind}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-white/50 border-t border-inherit flex items-center justify-between">
              <p className="text-slate-800 font-bold text-xs max-w-[60%]">
                {group.evaluation}
              </p>
              <button
                onClick={() => setSelectedGroup({ id: group.id, title: group.title })}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm"
              >
                <Users size={16} />
                Voir les élèves
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <MatrixModal 
        isOpen={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
        title={selectedGroup?.title || ""}
        category={selectedGroup?.id || ""}
        students={students}
      />
    </>
  );
}
