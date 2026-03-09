import { create } from "zustand";
import { PAYOUT_METHODS } from "@/lib/data/dashboard.mock";

export type WithdrawStep = "idle" | "processing" | "success";

interface DashboardState {
  availableBalance: number;
  pendingEarnings:  number;

  /* withdraw flow */
  withdrawStep:            WithdrawStep;
  withdrawAmount:          string;
  selectedPayoutMethodId:  string;

  setWithdrawAmount:       (v: string) => void;
  setSelectedPayoutMethod: (id: string) => void;
  confirmWithdraw:         () => void;
  resetWithdraw:           () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  availableBalance: 2_486.50,
  pendingEarnings:    690.00,

  withdrawStep:           "idle",
  withdrawAmount:         "",
  selectedPayoutMethodId: PAYOUT_METHODS[0].id,

  setWithdrawAmount:       (v)  => set({ withdrawAmount: v }),
  setSelectedPayoutMethod: (id) => set({ selectedPayoutMethodId: id }),

  confirmWithdraw: () => {
    const amount = parseFloat(get().withdrawAmount || "0");
    if (!amount) return;
    set({ withdrawStep: "processing" });
    setTimeout(() => {
      set((s) => ({
        availableBalance: Math.max(0, s.availableBalance - amount),
        withdrawStep: "success",
      }));
    }, 2000);
  },

  resetWithdraw: () => set({ withdrawStep: "idle", withdrawAmount: "" }),
}));
