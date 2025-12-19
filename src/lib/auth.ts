import { cookies } from "next/headers";
import { createUser, getUserByEmail, getUserById, updateUserWaiver, updateUserVideoWatched, createSignInCode, verifySignInCode } from "./store";
import { User } from "./types";

const SESSION_COOKIE = "pbl_session";

// Simple session management (in production, use proper session/JWT)
const sessions = new Map<string, string>(); // sessionId -> userId

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

export async function requestSignInCode(
  email: string,
  name?: string
): Promise<{ success: boolean; error?: string }> {
  const code = createSignInCode(email, name);

  // In production, send this via email (SendGrid, Resend, etc.)
  // For now, log to console
  console.log(`\n========================================`);
  console.log(`Sign-in code for ${email}: ${code}`);
  console.log(`========================================\n`);

  return { success: true };
}

export async function verifyCode(
  code: string,
  email?: string,
  name?: string
): Promise<{ success: boolean; error?: string; user?: User; isNewUser?: boolean }> {
  const result = verifySignInCode(code, email, name);

  if (!result.valid || !result.email) {
    return { success: false, error: "Invalid or expired code" };
  }

  // Check if user exists
  let user = getUserByEmail(result.email);
  let isNewUser = false;

  if (!user) {
    // Create new user
    if (!result.name) {
      return { success: false, error: "Name is required for new users" };
    }
    user = createUser(result.email, result.name);
    isNewUser = true;
  }

  // Create session
  const sessionId = generateSessionId();
  sessions.set(sessionId, user.id);

  // Set cookie
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });

  return { success: true, user, isNewUser };
}

export async function signOut(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionId) {
    sessions.delete(sessionId);
    cookieStore.delete(SESSION_COOKIE);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return null;
  }

  const userId = sessions.get(sessionId);
  if (!userId) {
    return null;
  }

  const user = getUserById(userId);
  return user || null;
}

export async function signWaiver(
  signature: string
): Promise<{ success: boolean; error?: string; user?: User }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "You must be signed in to sign the waiver" };
  }

  if (user.hasSignedWaiver) {
    return { success: false, error: "You have already signed the waiver" };
  }

  const updatedUser = updateUserWaiver(user.id, signature);
  if (!updatedUser) {
    return { success: false, error: "Failed to save waiver signature" };
  }

  return { success: true, user: updatedUser };
}

export async function markVideoWatched(): Promise<{ success: boolean; error?: string; user?: User }> {
  const user = await getCurrentUser();
  if (!user) {
    return { success: false, error: "You must be signed in" };
  }

  if (!user.hasSignedWaiver) {
    return { success: false, error: "You must sign the waiver before watching the video" };
  }

  if (user.hasWatchedVideo) {
    return { success: false, error: "You have already completed the video" };
  }

  const updatedUser = updateUserVideoWatched(user.id);
  if (!updatedUser) {
    return { success: false, error: "Failed to save video completion" };
  }

  return { success: true, user: updatedUser };
}
