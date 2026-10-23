import { notFound } from "next/navigation";
import { getBike } from "@/lib/bikes";
import ReserveForm from "./ReserveForm";

export const dynamic = "force-dynamic";

export default async function ReservePage({
  params,
}: {
  params: Promise<{ bikeId: string }>;
}) {
  const { bikeId } = await params;
  const bike = await getBike(bikeId);
  if (!bike) {
    notFound();
  }

  return <ReserveForm bike={bike} />;
}
