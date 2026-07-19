import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing profile ID" }, { status: 400 });
  }

  try {
    const profile = await prisma.aestheticProfile.findUnique({
      where: { id },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Fetch past history for this user
    const history = await prisma.aestheticProfile.findMany({
      where: { userId: profile.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ data: profile.data, history });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}
