export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getProfileById, deleteProfileById } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing profile ID" }, { status: 400 });
  }

  const profileData = await getProfileById(id);

  if (profileData) {
    return NextResponse.json({ data: profileData });
  }

  return NextResponse.json({ error: "Profile not found" }, { status: 404 });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing profile ID" }, { status: 400 });
  }

  const success = await deleteProfileById(id);

  if (success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Failed to delete profile" }, { status: 500 });
  }
}
