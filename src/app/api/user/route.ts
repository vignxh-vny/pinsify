import { NextResponse } from "next/server";
import { deleteUserById } from "@/lib/db";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
  }

  const success = await deleteUserById(id);

  if (success) {
    return NextResponse.json({ success: true });
  } else {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
