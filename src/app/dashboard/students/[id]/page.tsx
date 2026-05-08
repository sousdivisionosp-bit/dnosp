import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getRecommendation, getStatusType } from "@/lib/recommendations";

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const student = await prisma.student.findUnique({
    where: { id: id },
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Détails de l'élève : {student.nom} {student.prenom}
        </h1>
        <a
          href="/dashboard"
          className="text-blue-600 hover:underline flex items-center"
        >
          Retour au tableau de bord
        </a>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8 border border-slate-200">
        <div className="px-4 py-5 sm:px-6 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg leading-6 font-bold text-slate-900">
            Informations Personnelles
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider">Code élève</dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2 font-medium">{student.codeEleve}</dd>
            </div>
            <div className="bg-slate-50/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider">Sexe</dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2 font-medium">{student.sexe}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider">Lieu et Date de naissance</dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2 font-medium">
                {student.lieuNaissance}, le {new Date(student.dateNaissance).toLocaleDateString("fr-FR")}
              </dd>
            </div>
            <div className="bg-slate-50/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider">Etablissement</dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2 font-medium">
                {student.etablissement} ({student.ville}, {student.province})
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avis du Test</dt>
              <dd className="mt-1 text-sm text-slate-900 sm:mt-0 sm:col-span-2 font-bold italic">
                "{student.avisTest}"
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className={`border-l-4 p-6 rounded-r-xl shadow-sm ${
        statusType === 'risk' ? "bg-red-50 border-red-500" : 
        statusType === 'monitor' ? "bg-orange-50 border-orange-500" : 
        "bg-emerald-50 border-emerald-500"
      }`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center ${
          statusType === 'risk' ? "text-red-800" : 
          statusType === 'monitor' ? "text-orange-800" : 
          "text-emerald-800"
        }`}>
          Recommandation DNOSP / EDU-NC
        </h3>
        <p className={`text-base leading-relaxed font-medium ${
          statusType === 'risk' ? "text-red-700" : 
          statusType === 'monitor' ? "text-orange-700" : 
          "text-emerald-700"
        }`}>
          {recommendation}
        </p>
      </div>
    </div>
  );
}
