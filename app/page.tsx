import { redirect } from "next/navigation";

// Root route — redirect to feed (Clerk middleware handles auth gate)
export default function RootPage() {
  redirect("/feed");
}
