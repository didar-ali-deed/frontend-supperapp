import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sidebar }           from "@/components/layout/sidebar";
import { BottomNav }         from "@/components/layout/bottom-nav";
import { NotificationPanel } from "@/components/layout/notification-panel";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/login");

  return (
    /*
     * Shell — fills the full viewport, locked — no scroll on the root.
     * Each module's <main> handles its own scroll area independently.
     * This mirrors native-app shell behaviour.
     */
    <div className="flex h-[100dvh] overflow-hidden bg-[var(--surface-subtle)]">
      {/* ── Desktop sidebar — fixed left, lg+ ─────────────────── */}
      <Sidebar />

      {/* ── Right drawer — notifications ──────────────────────── */}
      <NotificationPanel />

      {/* ── Content column — offset by sidebar on lg ─────────── */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        {/*
         * Main scroll area:
         *  - overscroll-contain  → no scroll chaining to the shell
         *  - pb-bottom-bar       → clears fixed BottomNav + safe-area
         *  - lg:pb-0             → no offset on desktop (no BottomNav)
         */}
        <main
          className="
            flex-1 overflow-y-auto overscroll-contain
            pb-bottom-bar lg:pb-0
          "
          style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {children}
        </main>

        {/* ── Mobile bottom navigation ───────────────────────── */}
        <BottomNav />
      </div>
    </div>
  );
}
