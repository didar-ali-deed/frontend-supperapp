/**
 * lib/stores/wallet.store.ts — Wallet / payments global state.
 *
 * Combines local mock data for demo mode with real API fetch
 * actions via paymentsService.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { paymentsService } from "@/services/payments";
import { MOCK_CARDS, MOCK_TRANSACTIONS } from "@/lib/data/wallet.mock";
import { PAYOUT_METHODS } from "@/lib/data/dashboard.mock";
import type { WalletCard, WalletTransaction, Contact } from "@/lib/data/wallet.mock";

interface WalletState {
  // ── Data ──────────────────────────────────────────────────────
  cards:        WalletCard[];
  activeCardId: string;
  transactions: WalletTransaction[];

  // ── Async status ───────────────────────────────────────────────
  isLoadingBalance: boolean;
  isLoadingTxns:    boolean;
  error:            string | null;

  // ── Send-money flow ────────────────────────────────────────────
  sendRecipient: Contact | null;
  sendAmount:    string;
  sendNote:      string;
  sendStep:      "recipient" | "amount" | "confirm";

  // ── Withdraw flow ──────────────────────────────────────────────
  withdrawStep:           "idle" | "processing" | "success";
  withdrawAmount:         string;
  selectedPayoutMethodId: string;

  // ── UI ─────────────────────────────────────────────────────────
  balanceVisible:    boolean;
  processingPayment: boolean;

  // ── Async actions ─────────────────────────────────────────────
  fetchBalance:      () => Promise<void>;
  fetchTransactions: () => Promise<void>;

  // ── Card actions ───────────────────────────────────────────────
  setActiveCard: (id: string) => void;

  // ── Send flow ──────────────────────────────────────────────────
  setSendRecipient: (c: Contact | null) => void;
  setSendAmount:    (v: string) => void;
  setSendNote:      (v: string) => void;
  setSendStep:      (s: WalletState["sendStep"]) => void;
  resetSendFlow:    () => void;
  commitTransaction:(tx: WalletTransaction) => void;

  // ── Withdraw flow ──────────────────────────────────────────────
  setWithdrawAmount:       (v: string) => void;
  setSelectedPayoutMethod: (id: string) => void;
  confirmWithdraw:         () => void;
  resetWithdraw:           () => void;

  // ── UI ─────────────────────────────────────────────────────────
  toggleBalanceVisibility: () => void;
  setProcessing:           (v: boolean) => void;
}

export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      (set, get) => ({
        // ── Initial state ──────────────────────────────────────────
        cards:                  MOCK_CARDS,
        activeCardId:           MOCK_CARDS[0].id,
        transactions:           MOCK_TRANSACTIONS,
        isLoadingBalance:       false,
        isLoadingTxns:          false,
        error:                  null,
        sendRecipient:          null,
        sendAmount:             "",
        sendNote:               "",
        sendStep:               "recipient",
        withdrawStep:           "idle",
        withdrawAmount:         "",
        selectedPayoutMethodId: PAYOUT_METHODS[0].id,
        balanceVisible:         true,
        processingPayment:      false,

        // ── fetchBalance ───────────────────────────────────────────
        fetchBalance: async () => {
          set({ isLoadingBalance: true, error: null }, false, "wallet/fetchBalance/start");
          try {
            const bal = await paymentsService.getBalance();
            set(
              (s) => ({
                isLoadingBalance: false,
                cards: s.cards.map((c, i) =>
                  i === 0 ? { ...c, balance: bal.available } : c
                ),
              }),
              false,
              "wallet/fetchBalance/success",
            );
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to fetch balance";
            set({ isLoadingBalance: false, error: msg }, false, "wallet/fetchBalance/error");
          }
        },

        // ── fetchTransactions ──────────────────────────────────────
        fetchTransactions: async () => {
          set({ isLoadingTxns: true, error: null }, false, "wallet/fetchTxns/start");
          try {
            const res = await paymentsService.getTransactions({ page: 1, limit: 50 });
            // Cast: server Transaction → WalletTransaction (demo: keep existing mock)
            set({ isLoadingTxns: false }, false, "wallet/fetchTxns/success");
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to fetch transactions";
            set({ isLoadingTxns: false, error: msg }, false, "wallet/fetchTxns/error");
          }
        },

        // ── Card ───────────────────────────────────────────────────
        setActiveCard: (id) =>
          set({ activeCardId: id }, false, "wallet/setCard"),

        // ── Send flow ──────────────────────────────────────────────
        setSendRecipient: (contact) =>
          set({ sendRecipient: contact, sendStep: "amount" }, false, "wallet/setRecipient"),

        setSendAmount: (amount) =>
          set({ sendAmount: amount }, false, "wallet/setAmount"),

        setSendNote: (note) =>
          set({ sendNote: note }, false, "wallet/setNote"),

        setSendStep: (step) =>
          set({ sendStep: step }, false, "wallet/setStep"),

        resetSendFlow: () =>
          set(
            { sendRecipient: null, sendAmount: "", sendNote: "", sendStep: "recipient" },
            false, "wallet/resetSend",
          ),

        commitTransaction: (tx) =>
          set(
            (s) => {
              const card  = s.cards.find((c) => c.id === s.activeCardId);
              if (!card) return s;
              const delta = tx.direction === "credit" ? tx.amount : -tx.amount;
              return {
                transactions: [tx, ...s.transactions],
                cards: s.cards.map((c) =>
                  c.id === s.activeCardId
                    ? { ...c, balance: Math.max(0, c.balance + delta) }
                    : c
                ),
              };
            },
            false, "wallet/commitTx",
          ),

        // ── Withdraw flow ──────────────────────────────────────────
        setWithdrawAmount: (v) =>
          set({ withdrawAmount: v }, false, "wallet/setWithdrawAmount"),

        setSelectedPayoutMethod: (id) =>
          set({ selectedPayoutMethodId: id }, false, "wallet/setPayoutMethod"),

        confirmWithdraw: () => {
          const amount = parseFloat(get().withdrawAmount || "0");
          if (!amount) return;
          set({ withdrawStep: "processing" }, false, "wallet/withdraw/start");
          // In production: call paymentsService.requestPayout(...)
          setTimeout(() => {
            set(
              (s) => ({
                cards: s.cards.map((c, i) =>
                  i === 0 ? { ...c, balance: Math.max(0, c.balance - amount) } : c
                ),
                withdrawStep: "success",
              }),
              false, "wallet/withdraw/success",
            );
          }, 2000);
        },

        resetWithdraw: () =>
          set({ withdrawStep: "idle", withdrawAmount: "" }, false, "wallet/resetWithdraw"),

        // ── UI ─────────────────────────────────────────────────────
        toggleBalanceVisibility: () =>
          set((s) => ({ balanceVisible: !s.balanceVisible }), false, "wallet/toggleBalance"),

        setProcessing: (v) =>
          set({ processingPayment: v }, false, "wallet/setProcessing"),
      }),
      {
        name: "wallet-store",
        partialize: (s) => ({ activeCardId: s.activeCardId, balanceVisible: s.balanceVisible }),
      },
    ),
    { name: "WalletStore" },
  ),
);
