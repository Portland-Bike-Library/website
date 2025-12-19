import { NextRequest, NextResponse } from "next/server";
import { signWaiver } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { signature } = body;

    // Validation
    if (!signature || signature.trim().length < 2) {
      return NextResponse.json(
        { error: "A valid signature is required" },
        { status: 400 }
      );
    }

    const result = await signWaiver(signature.trim());

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ user: result.user });
  } catch (error) {
    console.error("Waiver sign error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
