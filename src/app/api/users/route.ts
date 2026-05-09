import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email, password, province } = body;
    const normalizedProvince = province ? String(province).trim() : null;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response("L'utilisateur existe déjà", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER",
        province: normalizedProvince,
      },
    });

    return NextResponse.json({ id: user.id, email: user.email });
  } catch (error: any) {
    console.error("Error creating user:", error);
    return new Response(error.message, { status: 500 });
  }
}
