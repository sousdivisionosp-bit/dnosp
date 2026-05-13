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
      trimester,
      interest,
      implication,
      participation,
      motivation,
      date,
      responsable,
      observation,
    } = body;

    const followup = await prisma.vocationFollowup.create({
      data: {
        studentId,
        trimester: parseInt(trimester),
        interest: parseInt(interest),
        implication: parseInt(implication),
        participation: parseInt(participation),
        motivation: parseInt(motivation),
        date: new Date(date),
        responsable,
        observation,
      },
    });

    return NextResponse.json(followup);
  } catch (error: any) {
    console.error("Error creating vocation followup:", error);
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
    const followups = await prisma.vocationFollowup.findMany({
      where: { studentId },
      orderBy: { trimester: "asc" },
    });

    return NextResponse.json(followups);
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

    await prisma.vocationFollowup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
