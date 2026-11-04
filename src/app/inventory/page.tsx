import { getBikes, bikeTypesFrom } from "@/lib/bikes";
import InventoryGrid from "./InventoryGrid";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const bikes = await getBikes();
  return <InventoryGrid bikes={bikes} types={bikeTypesFrom(bikes)} />;
}
