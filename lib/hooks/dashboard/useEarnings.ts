import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { get, post } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { EarningsChart, EarningsSummary, PayoutRequest } from "@/types";

const DASH_KEYS = {
  earnings: ["dashboard", "earnings"] as const,
  analytics: (period: string) => ["dashboard", "analytics", period] as const,
  payouts: ["dashboard", "payouts"] as const,
};

export function useEarningsSummary() {
  return useQuery({
    queryKey: DASH_KEYS.earnings,
    queryFn: () => get<EarningsSummary>(ENDPOINTS.dashboard.earnings),
  });
}

export function useEarningsChart(period: "7d" | "30d" | "90d" = "30d") {
  return useQuery({
    queryKey: DASH_KEYS.analytics(period),
    queryFn: () =>
      get<EarningsChart[]>(ENDPOINTS.dashboard.analytics, {
        params: { period },
      }),
  });
}

export function usePayouts() {
  return useQuery({
    queryKey: DASH_KEYS.payouts,
    queryFn: () => get<PayoutRequest[]>(ENDPOINTS.dashboard.payouts),
  });
}

export function useRequestPayout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) =>
      post<PayoutRequest>(ENDPOINTS.dashboard.requestPayout, { amount }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DASH_KEYS.payouts });
      qc.invalidateQueries({ queryKey: DASH_KEYS.earnings });
    },
  });
}
