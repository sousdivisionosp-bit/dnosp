import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ImportExcel from "@/components/ImportExcel";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const isAdmin = user.role === "ADMIN";

  const students = isAdmin
    ? await prisma.student.findMany({
        orderBy: { createdAt: "desc" },
      })
    : await prisma.student.findMany({
        where: { province: user.province },
        orderBy: { createdAt: "desc" },
      });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Tableau de bord
          </h1>
          <p className="text-slate-500">Bienvenue, {user.name} ({isAdmin ? "Administrateur" : `Province: ${user.province}`})</p>
        </div>
        
        {isAdmin && (
          <div className="flex flex-wrap gap-3">
            <a
              href="/dashboard/users/new"
              className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-sm font-medium"
            >
              Créer Utilisateur
            </a>
            <a
              href="/dashboard/students/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm font-medium"
            >
              Ajouter Élève
            </a>
          </div>
        )}
      </div>

      {isAdmin && <ImportExcel />}

      <DashboardClient students={students} isAdmin={isAdmin} />
    </div>
  );
}
