import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateRootFolder } from "@/server/db/queries";

export default async function DriveRedirect() {
  const { userId } = await auth();
  if (!userId) redirect("/");
  const root = await getOrCreateRootFolder(userId);
  redirect(`/f/${root.id}`);
}
