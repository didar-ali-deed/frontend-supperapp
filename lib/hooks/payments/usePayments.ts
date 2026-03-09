import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { PaymentMethod, Transaction, PaginatedResponse } from "@/types";

const PAY_KEYS = {
  transactions: ["payments", "transactions"] as const,
  methods: ["payments", "methods"] as const,
};

export function useTransactions() {
  return useQuery({
    queryKey: PAY_KEYS.transactions,
    queryFn: () =>
      get<PaginatedResponse<Transaction>>(ENDPOINTS.payments.transactions),
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: PAY_KEYS.methods,
    queryFn: () => get<PaymentMethod[]>(ENDPOINTS.payments.methods),
  });
}

export function useCreatePaymentIntent() {
  return useMutation({
    mutationFn: (data: { amount: number; currency: string; toUserId: string }) =>
      post<{ clientSecret: string }>(ENDPOINTS.payments.intent, data),
  });
}
