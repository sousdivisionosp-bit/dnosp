import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SummaryClient from "@/components/SummaryClient";

export default async function SummaryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user as any;
  const isAdmin = user.role === "ADMIN";

  const students = await prisma.student.findMany({
    where: isAdmin ? {} : { province: user.province },
    include: {
      grades: true,
      vocationFollowups: true,
    },
    orderBy: { nom: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Synthèse Globale de Suivi
        </h1>
        <p className="text-slate-500">
          Vue d'ensemble du suivi des compétences et des dimensions vocationnelles par trimestre.
        </p>
      </div>

      <SummaryClient students={students as any} />
    </div>
  );
}
