/**
 * services/api.ts
 *
 * Base API service layer:
 *  - ApiError     typed error class (status, code, details)
 *  - tokenManager singleton for bearer-token injection
 *  - withRetry    exponential-back-off wrapper
 *  - Dev-mode request/response logger
 *
 * This module is framework-agnostic — no React, no Zustand.
 */

import axios, { type AxiosError, type AxiosResponse } from "axios";
import { apiClient, setAuthToken } from "@/lib/api/client";

/* ── Error class ──────────────────────────────────────────────── */

export interface ApiErrorPayload {
  message: string;
  code?:   string;
  details?: Record<string, string[]>; // validation field errors
}

export class ApiError extends Error {
  public readonly status:  number;
  public readonly code:    string;
  public readonly details: Record<string, string[]> | undefined;

  constructor(
    message: string,
    status:  number,
    code:    string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name    = "ApiError";
    this.status  = status;
    this.code    = code;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype); // restore prototype chain
  }

  static from(err: unknown): ApiError {
    if (err instanceof ApiError) return err;

    if (axios.isAxiosError(err)) {
      const axErr = err as AxiosError<ApiErrorPayload>;
      const status  = axErr.response?.status ?? 0;
      const payload = axErr.response?.data;
      const message = payload?.message ?? axErr.message ?? "Unknown error";
      const code    = payload?.code    ?? `HTTP_${status}`;
      return new ApiError(message, status, code, payload?.details);
    }

    if (err instanceof Error) {
      return new ApiError(err.message, 0, "UNKNOWN");
    }

    return new ApiError("An unexpected error occurred", 0, "UNEXPECTED");
  }

  /** 401 — token expired / missing */
  get isUnauthorized(): boolean { return this.status === 401; }
  /** 403 — authenticated but forbidden */
  get isForbidden():    boolean { return this.status === 403; }
  /** 404 — resource not found */
  get isNotFound():     boolean { return this.status === 404; }
  /** 422 — validation errors */
  get isValidation():   boolean { return this.status === 422; }
  /** 429 — rate limited */
  get isRateLimited():  boolean { return this.status === 429; }
  /** 5xx — server-side failure */
  get isServerError():  boolean { return this.status >= 500; }
  /** Network failure (no response) */
  get isNetwork():      boolean { return this.status === 0; }

  /** Flat field → message map for form validation */
  fieldErrors(): Record<string, string> {
    if (!this.details) return {};
    return Object.fromEntries(
      Object.entries(this.details).map(([k, msgs]) => [k, msgs[0] ?? "Invalid"])
    );
  }
}

/* ── Token manager ────────────────────────────────────────────── */

export const tokenManager = {
  _token: null as string | null,

  set(token: string | null): void {
    this._token = token;
    setAuthToken(token);
  },

  get(): string | null {
    return this._token;
  },

  clear(): void {
    this.set(null);
  },

  isSet(): boolean {
    return this._token !== null;
  },
};

/* ── Retry helper ─────────────────────────────────────────────── */

/**
 * Execute `fn`, retrying on network errors or 5xx responses.
 * Does NOT retry on 4xx client errors.
 */
export async function withRetry<T>(
  fn:       () => Promise<T>,
  retries = 2,
  delayMs = 400,
): Promise<T> {
  try {
    return await fn();
  } catch (raw) {
    const err = ApiError.from(raw);
    const shouldRetry = (err.isNetwork || err.isServerError) && retries > 0;

    if (!shouldRetry) throw err;

    await new Promise((resolve) => setTimeout(resolve, delayMs));
    return withRetry(fn, retries - 1, delayMs * 2);
  }
}

/* ── Safe request wrapper ─────────────────────────────────────── */

/**
 * Wrap any API call to normalise errors into ApiError instances.
 */
export async function safeRequest<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    throw ApiError.from(err);
  }
}

/* ── Dev-mode request / response logger ──────────────────────── */

if (process.env.NODE_ENV === "development") {
  apiClient.interceptors.request.use((config) => {
    const method = config.method?.toUpperCase() ?? "?";
    const url    = config.url ?? "";
    const params = config.params ? ` ${JSON.stringify(config.params)}` : "";
    // eslint-disable-next-line no-console
    console.debug(`%c[API] ${method} ${url}${params}`, "color:#6366f1;font-weight:600");
    return config;
  });

  apiClient.interceptors.response.use(
    (res: AxiosResponse) => {
      // eslint-disable-next-line no-console
      console.debug(
        `%c[API] ✓ ${res.status} ${res.config.url}`,
        "color:#10b981;font-weight:600",
      );
      return res;
    },
    (err: AxiosError) => {
      // eslint-disable-next-line no-console
      console.debug(
        `%c[API] ✗ ${err.response?.status ?? 0} ${err.config?.url}`,
        "color:#ef4444;font-weight:600",
        err.message,
      );
      return Promise.reject(err);
    },
  );
}

/* ── Re-export transport primitives ──────────────────────────── */

export { apiClient, setAuthToken } from "@/lib/api/client";
