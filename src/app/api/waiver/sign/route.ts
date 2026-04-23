import { NextRequest, NextResponse } from "next/server";
import { signWaiver } from "@/lib/auth";
import { MinorOnWaiver } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { printedName, signature, minor } = body;

    if (!printedName || typeof printedName !== "string" || printedName.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter your printed legal name" },
        { status: 400 }
      );
    }

    if (!signature || typeof signature !== "string" || signature.trim().length < 2) {
      return NextResponse.json(
        { error: "A valid signature is required" },
        { status: 400 }
      );
    }

    let minorPayload: MinorOnWaiver | undefined;
    if (minor) {
      const minorName = typeof minor.name === "string" ? minor.name.trim() : "";
      const minorDob = typeof minor.dateOfBirth === "string" ? minor.dateOfBirth.trim() : "";

      if (minorName.length < 2) {
        return NextResponse.json(
          { error: "Minor child's name is required" },
          { status: 400 }
        );
      }
      if (!minorDob) {
        return NextResponse.json(
          { error: "Minor child's date of birth is required" },
          { status: 400 }
        );
      }
      minorPayload = { name: minorName, dateOfBirth: minorDob };
    }

    const result = await signWaiver(
      printedName.trim(),
      signature.trim(),
      minorPayload
    );

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
