/**
 * services/payments.ts
 *
 * Wallet & payments service.
 * Wraps all /payments/* endpoints.
 */

import { get, post } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { safeRequest, withRetry } from "./api";
import type { PaymentMethod, Transaction, PaginatedResponse } from "@/types";

/* ── Request / response types ─────────────────────────────────── */

export interface BalanceResult {
  available: number;
  pending:   number;
  currency:  string;
}

export interface SendMoneyInput {
  toUserId:  string;
  amount:    number;
  currency?: string;
  note?:     string;
}

export interface SendMoneyResult {
  transactionId: string;
  status:        "completed" | "pending" | "failed";
  amount:        number;
  fee:           number;
  total:         number;
}

export interface CreatePaymentIntentInput {
  amount:    number;
  currency?: string;
  toUserId:  string;
  note?:     string;
}

export interface PaymentIntentResult {
  clientSecret:     string;
  paymentIntentId:  string;
  amount:           number;
  currency:         string;
}

export interface RequestPayoutInput {
  amount:          number;
  payoutMethodId:  string;
  note?:           string;
}

export interface PayoutResult {
  payoutId:          string;
  status:            "pending" | "processing" | "completed" | "failed";
  estimatedArrival:  string; // ISO date
  amount:            number;
}

export interface TransactionParams {
  page?:      number;
  limit?:     number;
  direction?: "credit" | "debit";
  status?:    Transaction["status"];
}

/* ── paymentsService ──────────────────────────────────────────── */

export const paymentsService = {
  /**
   * Fetch the authenticated user's wallet balance.
   */
  getBalance(): Promise<BalanceResult> {
    return withRetry(() => get<BalanceResult>(ENDPOINTS.payments.balance));
  },

  /**
   * Paginated transaction history.
   */
  getTransactions({
    page = 1,
    limit = 30,
    direction,
    status,
  }: TransactionParams = {}): Promise<PaginatedResponse<Transaction>> {
    return withRetry(() =>
      get<PaginatedResponse<Transaction>>(ENDPOINTS.payments.transactions, {
        params: { page, limit, ...(direction ? { direction } : {}), ...(status ? { status } : {}) },
      })
    );
  },

  /**
   * Fetch a single transaction by ID.
   */
  getTransaction(id: string): Promise<Transaction> {
    return safeRequest(() =>
      get<Transaction>(ENDPOINTS.payments.transaction(id))
    );
  },

  /**
   * List saved payment / payout methods.
   */
  getPaymentMethods(): Promise<PaymentMethod[]> {
    return withRetry(() => get<PaymentMethod[]>(ENDPOINTS.payments.methods));
  },

  /**
   * Send money directly to another user.
   * Returns the resulting transaction summary.
   */
  sendMoney(input: SendMoneyInput): Promise<SendMoneyResult> {
    return safeRequest(() =>
      post<SendMoneyResult>(ENDPOINTS.payments.send, {
        ...input,
        currency: input.currency ?? "USD",
      })
    );
  },

  /**
   * Create a Stripe PaymentIntent (for card-based flows).
   * Front-end uses the clientSecret with Stripe.js to confirm.
   */
  createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult> {
    return safeRequest(() =>
      post<PaymentIntentResult>(ENDPOINTS.payments.intent, {
        ...input,
        currency: input.currency ?? "USD",
      })
    );
  },

  /**
   * Request a payout to a saved bank / PayPal / crypto method.
   */
  requestPayout(input: RequestPayoutInput): Promise<PayoutResult> {
    return safeRequest(() =>
      post<PayoutResult>(ENDPOINTS.payments.payout, input)
    );
  },
};
