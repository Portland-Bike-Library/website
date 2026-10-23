import type { BikeInput } from "@/lib/types";

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MAX_FEATURES = 25;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function str(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

// Validates an admin-submitted bike. Returns the clean input or an error string.
export function parseBikeInput(
  body: unknown
): { ok: true; value: BikeInput } | { ok: false; error: string } {
  const b = (body ?? {}) as Record<string, unknown>;

  const name = str(b.name, 120);
  if (name.length < 2) return { ok: false, error: "Name is required." };

  const id = str(b.id, 80) || slugify(name);
  if (!ID_RE.test(id)) {
    return { ok: false, error: "ID must be lowercase letters, numbers, and hyphens (e.g. woom-now-6)." };
  }

  const type = str(b.type, 60);
  if (!type) return { ok: false, error: "Type is required (e.g. Cargo E-Bike)." };

  const image = str(b.image, 1000);
  if (image && !/^(\/|https?:\/\/)/.test(image)) {
    return { ok: false, error: "Image must be a URL or a path starting with /." };
  }

  let features: string[] = [];
  if (Array.isArray(b.features)) {
    features = b.features
      .filter((f): f is string => typeof f === "string")
      .map((f) => f.trim().slice(0, 120))
      .filter(Boolean)
      .slice(0, MAX_FEATURES);
  }

  const sortOrderRaw = Number(b.sortOrder);
  const sortOrder = Number.isFinite(sortOrderRaw) ? Math.trunc(sortOrderRaw) : 0;

  return {
    ok: true,
    value: {
      id,
      name,
      type,
      size: str(b.size, 120),
      description: str(b.description, 2000),
      image,
      available: b.available === true,
      maxLoanPeriod: str(b.maxLoanPeriod, 60) || "2 weeks",
      features,
      sortOrder,
    },
  };
}

export function inputToRow(v: BikeInput) {
  return {
    id: v.id,
    name: v.name,
    type: v.type,
    size: v.size,
    description: v.description,
    image_url: v.image,
    available: v.available,
    max_loan_period: v.maxLoanPeriod,
    features: v.features,
    sort_order: v.sortOrder,
  };
}
