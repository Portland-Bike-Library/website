import { NextRequest, NextResponse } from "next/server";
import { verifyCode } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Rate limit: 10 attempts per 15 minutes per IP (stricter to prevent brute force)
const RATE_LIMIT = 10;
const RATE_WINDOW = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    // Check rate limit by IP
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`verify-code:${clientIp}`, RATE_LIMIT, RATE_WINDOW);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimitResult.resetIn / 1000).toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { code, email, name } = body;

    if (!code) {
      return NextResponse.json(
        { error: "Code is required" },
        { status: 400 }
      );
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: "Code must be 6 digits" },
        { status: 400 }
      );
    }

    const result = await verifyCode(code, email, name);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: result.user,
      isNewUser: result.isNewUser
    });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
