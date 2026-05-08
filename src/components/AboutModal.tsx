"use client";

import { X, Scale, Network, Target, Info, CheckCircle2 } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  const sections = [
    {
      id: "juridique",
      title: "A. Fondement Juridique",
      icon: <Scale className="text-blue-600" size={24} />,
      content: [
        "Convention relative aux droits de l’enfant (ONU, 1989) ratifiée par l’Ordonnance-Loi n° 90-48 (Articles 5 et 28).",
        "Loi n° 09/001 du 10 janvier 2009 portant protection de l’enfant (Articles 74 et 79).",
        "Loi-Cadre n° 14/004 du 11 février 2014 de l’Enseignement National (Articles 185, 186 et 193).",
        "Arrêté Ministériel N° MIN.EPST/CABMINETAT/0112/2020 du 06 février 2020 portant restructuration du Service."
      ]
    },
    {
      id: "structure",
      title: "B. Structure Organique",
      icon: <Network className="text-purple-600" size={24} />,
      content: [
        "Niveau National : Direction Nationale avec 10 Divisions normatives et 3 Cellules techniques.",
        "Niveau Provincial : Antennes Provinciales EDU-NC, Coordinations et Bureaux d'Orientation (IPP).",
        "Niveau Sous-Provincial : Antennes Sous-Provinciales et Coordinations communautaires.",
        "Niveau École : 1 à 3+ Conseillers d'Orientation selon la taille de l'établissement (12 à 25+ classes)."
      ]
    },
    {
      id: "mission",
      title: "C. Missions et Axes d'Intervention",
      icon: <Target className="text-emerald-600" size={24} />,
      subSections: [
        {
          label: "La Guidance",
          desc: "Aider l’élève à choisir sa filière en tenant compte de ses aptitudes, goûts et aspirations."
        },
        {
          label: "Le Counseling",
          desc: "Accompagnement psychopédagogique et soutien psychosocial pour lutter contre les difficultés socio-affectives."
        },
        {
          label: "Évaluations",
          desc: "Tests prédictifs et diagnostiques (Orientation, Niveau, Maturité) et appui aux épreuves nationales."
        }
      ]
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">QUI SOMMES-NOUS ?</h2>
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">
                Direction Nationale d'Orientation Scolaire et Professionnelle
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-8 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Director's Photo */}
            <div className="lg:col-span-1">
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center sticky top-0">
                <div className="aspect-[3/4] mb-4 overflow-hidden rounded-2xl border-4 border-slate-50">
                  <img 
                    src="/directeur.jpg" 
                    alt="MABULA-A-MABULA Olga" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-lg font-black text-slate-900 leading-tight">MABULA-A-MABULA Olga</h4>
                <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mt-1">Directeur-Chef de Service</p>
                <div className="mt-4 pt-4 border-t border-slate-50 flex justify-center">
                  <img src="/logo.png" alt="Logo" className="h-10 opacity-20 grayscale" />
                </div>
              </div>
            </div>

            {/* Right Column: Content Sections */}
            <div className="lg:col-span-2 space-y-8">
              {sections.map((section) => (
                <div key={section.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-slate-50 rounded-lg">{section.icon}</div>
                    <h3 className="text-xl font-bold text-slate-900">{section.title}</h3>
                  </div>

                  {section.content && (
                    <ul className="space-y-4">
                      {section.content.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 group">
                          <CheckCircle2 size={18} className="mt-1 text-blue-500 flex-shrink-0" />
                          <p className="text-slate-600 leading-relaxed font-medium group-hover:text-slate-900 transition-colors">
                            {item}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.subSections && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {section.subSections.map((sub, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <h4 className="font-bold text-blue-700 mb-2">{sub.label}</h4>
                          <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            {sub.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Special Mission Note */}
              <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                <div className="flex gap-4">
                  <Info className="text-indigo-600 flex-shrink-0" size={24} />
                  <p className="text-sm text-indigo-900 leading-relaxed font-medium italic">
                    "L’enseignant transmet le savoir alors que le conseiller d’orientation intervient pour réguler le comportement de l’élève en terme de savoir être, savoir se comporter et savoir vivre."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white text-center">
          <button 
            onClick={onClose}
            className="px-10 py-3 bg-slate-900 text-white rounded-2xl text-sm font-black hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-600/20"
          >
            Fermer la présentation
          </button>
        </div>
      </div>
    </div>
  );
}
