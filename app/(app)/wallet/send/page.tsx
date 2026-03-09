"use client";

import { Topbar } from "@/components/layout/topbar";
import { SendMoneyForm } from "@/components/wallet/send-money-form";

export default function SendPage() {
  return (
    <>
      <Topbar title="Send Money" />
      <div className="mx-auto max-w-lg px-4 py-6">
        <SendMoneyForm />
      </div>
    </>
  );
}
