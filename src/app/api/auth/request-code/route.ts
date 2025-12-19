import { NextRequest, NextResponse } from "next/server";
import { requestSignInCode } from "@/lib/auth";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Rate limit: 5 requests per 15 minutes per IP
const RATE_LIMIT = 5;
const RATE_WINDOW = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  try {
    // Check rate limit by IP
    const clientIp = getClientIp(request);
    const rateLimitResult = rateLimit(`request-code:${clientIp}`, RATE_LIMIT, RATE_WINDOW);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil(rateLimitResult.resetIn / 1000).toString(),
          }
        }
      );
    }

    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const result = await requestSignInCode(email, name);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Request code error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
