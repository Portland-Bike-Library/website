import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getBike } from "@/lib/bikes";
import BikeForm from "../BikeForm";

export const dynamic = "force-dynamic";

export default async function EditBikePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
  const { id } = await params;
  const bike = await getBike(id);
  if (!bike) notFound();
  return <BikeForm bike={bike} />;
}
