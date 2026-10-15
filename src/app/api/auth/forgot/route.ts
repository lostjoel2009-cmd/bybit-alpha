import { NextResponse } from "next/server";
export async function POST() {
  // Password resets are handled by an administrator in this build.
  return NextResponse.json({ ok: true });
}
