import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import { env } from "@/config/env";

// A single normalized error type for every backend call. The response
// interceptor converts any failure — HTTP error status or network error — into
// this shape, so callers only ever need `instanceof ApiError` and can safely
// read `.message` (already human-readable) / `.status` / `.data`.
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";

// Nest and better-auth both return errors as `{ message: string }`, so this
// covers the readable message for every endpoint we call.
function extractMessage(data: unknown): string | null {
  if (data && typeof data === "object" && "message" in data) {
    const message = (data as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }
  return null;
}

const instance = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  // Every backend route sits behind better-auth cookie sessions; sending
  // credentials globally replaces the per-call `credentials: "include"`.
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Request middleware — the single place to stamp headers on every outbound
// request. Add future cross-cutting headers (correlation id, Authorization,
// etc.) here rather than at each call site.
instance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.set("Accept", "application/json");
  return config;
});

// Response middleware — unwrap the payload on success so callers get the data
// directly, and normalize every failure into a single ApiError.
instance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    const status = error.response?.status ?? 0;
    const data = error.response?.data ?? null;
    const message = extractMessage(data) ?? DEFAULT_ERROR_MESSAGE;
    return Promise.reject(new ApiError(message, status, data));
  },
);

// Thin typed facade over the instance. Because the response interceptor returns
// `response.data`, the resolved value is `T` (not `AxiosResponse<T>`) — the
// `<T, T>` generics line the static types up with that runtime behavior.
export const http = {
  get: <T>(url: string, config?: AxiosRequestConfig) => instance.get<T, T>(url, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.post<T, T>(url, data, config),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.patch<T, T>(url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    instance.put<T, T>(url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    instance.delete<T, T>(url, config),
};
