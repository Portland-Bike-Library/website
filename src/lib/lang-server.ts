import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang } from "./lang-const";

export async function getLang(): Promise<Lang> {
  const v = (await cookies()).get(LANG_COOKIE)?.value;
  return v === "es" ? "es" : "en";
}
