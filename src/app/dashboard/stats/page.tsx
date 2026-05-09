import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StatsClient from "@/components/StatsClient";

export default async function StatsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const isAdmin = user.role === "ADMIN";

  // Fetch all students for statistics
  // If not admin, only fetch students from their province
  const students = isAdmin
    ? await prisma.student.findMany({
        select: {
          province: true,
          avisTest: true,
        },
      })
    : await prisma.student.findMany({
        where: { 
          province: {
            equals: user.province?.trim(),
          }
        },
        select: {
          province: true,
          avisTest: true,
        },
      });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Statistiques Pédagogiques
        </h1>
        <p className="text-slate-500">
          {isAdmin 
            ? "Analyse comparative de toutes les provinces éducationnelles." 
            : `Analyse détaillée de la province : ${user.province}`}
        </p>
      </div>

      <StatsClient students={students} />
    </div>
  );
}
