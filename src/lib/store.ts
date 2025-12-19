// Simple in-memory store for demo purposes
// In production, replace with a real database (e.g., PostgreSQL, MongoDB)

import { User, WaiverSignature } from "./types";

interface SignInCode {
  code: string;
  email: string;
  name?: string; // For new user registration
  expiresAt: Date;
  used: boolean;
}

interface Store {
  users: Map<string, User>;
  waivers: Map<string, WaiverSignature>;
  signInCodes: Map<string, SignInCode>;
}

// Global store (persists during server runtime only)
const globalStore: Store = {
  users: new Map(),
  waivers: new Map(),
  signInCodes: new Map(),
};

export function getStore(): Store {
  return globalStore;
}

// Generate a 6-digit code
function generateCode(): string {
  // TODO: Use random code in production
  // return Math.floor(100000 + Math.random() * 900000).toString();
  return "000000";
}

// Sign-in code operations
export function createSignInCode(email: string, name?: string): string {
  const code = generateCode();
  const signInCode: SignInCode = {
    code,
    email: email.toLowerCase(),
    name,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    used: false,
  };

  // Store by code for lookup
  globalStore.signInCodes.set(code, signInCode);

  return code;
}

export function verifySignInCode(code: string, email?: string, name?: string): { valid: boolean; email?: string; name?: string } {
  // For testing: always accept 000000
  if (code === "000000") {
    return { valid: true, email: email || "test@portlandbikelibrary.org", name };
  }

  const signInCode = globalStore.signInCodes.get(code);

  if (!signInCode) {
    return { valid: false };
  }

  if (signInCode.used) {
    return { valid: false };
  }

  if (new Date() > signInCode.expiresAt) {
    globalStore.signInCodes.delete(code);
    return { valid: false };
  }

  // Mark as used
  signInCode.used = true;

  return { valid: true, email: signInCode.email, name: signInCode.name };
}

// User operations
export function createUser(email: string, name: string): User {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const user: User = {
    id,
    email: email.toLowerCase(),
    name,
    hasSignedWaiver: false,
    hasWatchedVideo: false,
    createdAt: new Date(),
  };
  globalStore.users.set(id, user);
  return user;
}

export function getUserByEmail(email: string): User | undefined {
  const normalizedEmail = email.toLowerCase();
  for (const user of globalStore.users.values()) {
    if (user.email === normalizedEmail) {
      return user;
    }
  }
  return undefined;
}

export function getUserById(id: string): User | undefined {
  return globalStore.users.get(id);
}

export function updateUserWaiver(
  userId: string,
  signature: string
): User | undefined {
  const user = globalStore.users.get(userId);
  if (user) {
    user.hasSignedWaiver = true;
    user.waiverSignedAt = new Date();
    user.waiverSignature = signature;

    // Also store in waivers collection
    globalStore.waivers.set(userId, {
      userId,
      signature,
      signedAt: new Date(),
    });

    return user;
  }
  return undefined;
}

export function updateUserVideoWatched(userId: string): User | undefined {
  const user = globalStore.users.get(userId);
  if (user) {
    user.hasWatchedVideo = true;
    user.videoWatchedAt = new Date();
    return user;
  }
  return undefined;
}
