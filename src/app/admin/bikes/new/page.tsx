import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import BikeForm from "../BikeForm";

export default async function NewBikePage() {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
  return <BikeForm />;
}
