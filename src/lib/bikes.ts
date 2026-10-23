import { supabaseAdmin } from "@/lib/supabase";
import type { Bike, BikeRow } from "@/lib/types";

export function rowToBike(r: BikeRow): Bike {
  return {
    id: r.id,
    name: r.name,
    type: r.type,
    size: r.size,
    description: r.description,
    image: r.image_url,
    available: r.available,
    maxLoanPeriod: r.max_loan_period,
    features: r.features ?? [],
    sortOrder: r.sort_order,
  };
}

export async function getBikes(): Promise<Bike[]> {
  const { data, error } = await supabaseAdmin
    .from("bikes")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) {
    console.error("Bikes fetch failed:", error);
    return [];
  }
  return (data as BikeRow[]).map(rowToBike);
}

export async function getBike(id: string): Promise<Bike | null> {
  const { data, error } = await supabaseAdmin
    .from("bikes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error("Bike fetch failed:", error);
    return null;
  }
  return data ? rowToBike(data as BikeRow) : null;
}

export function bikeTypesFrom(bikes: Bike[]): string[] {
  return Array.from(new Set(bikes.map((b) => b.type))).sort();
}
