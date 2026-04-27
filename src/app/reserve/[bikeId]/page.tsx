import { notFound } from "next/navigation";
import { bikes } from "@/content/inventory";
import ReserveForm from "./ReserveForm";

export default async function ReservePage({
  params,
}: {
  params: Promise<{ bikeId: string }>;
}) {
  const { bikeId } = await params;
  const bike = bikes.find((b) => b.id === bikeId);
  if (!bike) {
    notFound();
  }

  return <ReserveForm bike={bike} />;
}
