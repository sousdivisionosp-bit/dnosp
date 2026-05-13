import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getRecommendation, getStatusType } from "@/lib/recommendations";
import GradesSection from "@/components/GradesSection";
import GradeEvolutionChart from "@/components/GradeEvolutionChart";
import VocationSection from "@/components/VocationSection";
import VocationRadarChart from "@/components/VocationRadarChart";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const student = await prisma.student.findUnique({
    where: { id: id },
    include: {
      grades: {
        orderBy: [
          { trimester: "asc" },
          { date: "asc" }
        ]
      },
      vocationFollowups: {
        orderBy: { trimester: "asc" }
      }
    }
  });

  if (!student) {
    notFound();
  }

  // Check if user has access to this student's data
  if (user.role !== "ADMIN" && student.province !== user.province) {
    redirect("/dashboard");
  }

  const recommendation = getRecommendation(student.avisTest);
  const statusType = getStatusType(student.avisTest);

  // Serialize grades for the client component
  const serializedGrades = student.grades.map(g => ({
    ...g,
    date: g.date.toISOString(),
    createdAt: g.createdAt.toISOString(),
    updatedAt: g.updatedAt.toISOString(),
  }));

  // Serialize vocation followups
  const serializedVocation = student.vocationFollowups.map(v => ({
    ...v,
    date: v.date.toISOString(),
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-4xl mx-auto p-6 pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Détails de l'élève : {student.nom} {student.prenom}
        </h1>
        <a
          href="/dashboard"
          className="text-blue-600 hover:underline flex items-center font-bold"
        >
          ← Retour au tableau de bord
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white shadow-sm overflow-hidden rounded-2xl border border-slate-200">
          <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">
              Informations Personnelles
            </h3>
          </div>
          <div className="p-0">
            <dl className="divide-y divide-slate-100">
              <div className="px-6 py-4 grid grid-cols-3 gap-4">
                <dt className="text-xs font-bold text-slate-400 uppercase">Code</dt>
                <dd className="text-sm text-slate-900 col-span-2 font-bold">{student.codeEleve}</dd>
              </div>
              <div className="px-6 py-4 grid grid-cols-3 gap-4">
                <dt className="text-xs font-bold text-slate-400 uppercase">Sexe</dt>
                <dd className="text-sm text-slate-900 col-span-2 font-medium">{student.sexe}</dd>
              </div>
              <div className="px-6 py-4 grid grid-cols-3 gap-4">
                <dt className="text-xs font-bold text-slate-400 uppercase">Naissance</dt>
                <dd className="text-sm text-slate-900 col-span-2 font-medium">
                  {student.lieuNaissance}, le {new Date(student.dateNaissance).toLocaleDateString("fr-FR")}
                </dd>
              </div>
              <div className="px-6 py-4 grid grid-cols-3 gap-4">
                <dt className="text-xs font-bold text-slate-400 uppercase">École</dt>
                <dd className="text-sm text-slate-900 col-span-2 font-medium">
                  {student.etablissement} ({student.ville}, {student.province})
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className={`p-6 rounded-2xl shadow-sm border-2 ${
          statusType === 'risk' ? "bg-red-50/50 border-red-200 text-red-900" : 
          statusType === 'monitor' ? "bg-orange-50/50 border-orange-200 text-orange-900" : 
          "bg-emerald-50/50 border-emerald-200 text-emerald-900"
        }`}>
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                statusType === 'risk' ? "bg-red-600 text-white" : 
                statusType === 'monitor' ? "bg-orange-500 text-white" : 
                "bg-emerald-600 text-white"
              }`}>
                {statusType === 'risk' ? "À Risque" : statusType === 'monitor' ? "À Surveiller" : "Normal"}
              </span>
              <h3 className="text-lg font-bold mt-2">Recommandation</h3>
            </div>
            <p className="text-sm leading-relaxed font-medium italic opacity-90 flex-grow">
              "{recommendation}"
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GradeEvolutionChart grades={serializedGrades} />
        <VocationRadarChart followups={serializedVocation as any} />
      </div>

      <div className="space-y-12">
        <VocationSection 
          studentId={student.id} 
          initialFollowups={serializedVocation as any} 
          isAdmin={user.role === "ADMIN"} 
        />

        <GradesSection 
          studentId={student.id} 
          initialGrades={serializedGrades as any} 
          isAdmin={user.role === "ADMIN"} 
        />
      </div>
    </div>
  );
}
