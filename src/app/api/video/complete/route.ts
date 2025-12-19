import { NextResponse } from "next/server";
import { markVideoWatched } from "@/lib/auth";

export async function POST() {
  try {
    const result = await markVideoWatched();

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error("Video complete error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
