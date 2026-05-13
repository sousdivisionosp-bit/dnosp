import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      studentId,
      course,
      trimester,
      result,
      date,
      responsable,
      observation,
    } = body;

    const grade = await prisma.grade.create({
      data: {
        studentId,
        course,
        trimester: parseInt(trimester),
        result: parseFloat(result),
        date: new Date(date),
        responsable,
        observation,
      },
    });

    return NextResponse.json(grade);
  } catch (error: any) {
    console.error("Error creating grade:", error);
    return new Response(error.message, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return new Response("Student ID is required", { status: 400 });
  }

  try {
    const grades = await prisma.grade.findMany({
      where: { studentId },
      orderBy: [
        { trimester: "asc" },
        { date: "asc" }
      ],
    });

    return NextResponse.json(grades);
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

    await prisma.grade.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting grade:", error);
    return new Response(error.message, { status: 500 });
  }
}
