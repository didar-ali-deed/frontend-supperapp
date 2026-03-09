import { redirect } from "next/navigation";

// /payments is now called /wallet — redirect for backwards compat
export default function PaymentsPage() {
  redirect("/wallet");
}
