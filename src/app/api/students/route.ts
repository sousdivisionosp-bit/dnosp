import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      province,
      etablissement,
      ville,
      nom,
      postNom,
      prenom,
      sexe,
      codeEleve,
      lieuNaissance,
      dateNaissance,
      avisTest,
    } = body;

    const student = await prisma.student.create({
      data: {
        province,
        etablissement,
        ville,
        nom,
        postNom,
        prenom,
        sexe,
        codeEleve,
        lieuNaissance,
        dateNaissance: new Date(dateNaissance),
        avisTest,
      },
    });

    return NextResponse.json(student);
  } catch (error: any) {
    console.error("Error creating student:", error);
    return new Response(error.message, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const user = session.user as any;

  try {
    const students = user.role === "ADMIN"
      ? await prisma.student.findMany({
          orderBy: { createdAt: "desc" },
        })
      : await prisma.student.findMany({
          where: { province: user.province },
          orderBy: { createdAt: "desc" },
        });

    return NextResponse.json(students);
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response("ID manquant", { status: 400 });
    }

    await prisma.student.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return new Response(error.message, { status: 500 });
  }
}
