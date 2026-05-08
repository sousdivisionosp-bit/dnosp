import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getMatrixCategory } from "@/lib/recommendations";
import { ClipboardList } from "lucide-react";
import MatrixClient from "@/components/MatrixClient";

export default async function MatrixPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const isAdmin = user.role === "ADMIN";

  // Fetch student avis to calculate counts
  const studentsData = isAdmin
    ? await prisma.student.findMany({ 
        select: { 
          id: true,
          nom: true,
          prenom: true,
          avisTest: true,
          province: true,
          codeEleve: true
        } 
      })
    : await prisma.student.findMany({ 
        where: { province: user.province }, 
        select: { 
          id: true,
          nom: true,
          prenom: true,
          avisTest: true,
          province: true,
          codeEleve: true
        } 
      });

  const studentsWithCategory = studentsData.map(s => ({
    ...s,
    category: getMatrixCategory(s.avisTest)
  }));

  const counts = {
    vocation_competences: studentsWithCategory.filter(s => s.category === "vocation_competences").length,
    faible_vocation_competences: studentsWithCategory.filter(s => s.category === "faible_vocation_competences").length,
    competences_faible_vocation: studentsWithCategory.filter(s => s.category === "competences_faible_vocation").length,
    vocation_faibles_competences: studentsWithCategory.filter(s => s.category === "vocation_faibles_competences").length,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <ClipboardList className="text-blue-600" size={32} />
            Matrice de Suivi Pédagogique
          </h1>
          <p className="text-slate-500 mt-1">
            Cadre d'intervention et d'accompagnement. Total élèves : <span className="font-bold text-slate-900">{studentsData.length}</span>
          </p>
        </div>
      </div>

      <MatrixClient students={studentsWithCategory} counts={counts} />

      {/* Conclusion Note */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
        <h3 className="text-lg font-bold mb-2">Note Institutionnelle DNOSP / EDU-NC</h3>
        <p className="text-slate-400 text-sm leading-relaxed">
          Cette matrice sert de guide de référence pour les conseillers et enseignants. L'objectif est d'assurer un suivi personnalisé 
          permettant soit la consolidation des acquis pour les profils performants, soit une remédiation ciblée ou une réorientation 
          stratégique pour les élèves en difficulté, garantissant ainsi l'efficacité du système éducatif.
        </p>
      </div>
    </div>
  );
}
