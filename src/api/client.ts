const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000/api";

const getToken = () => localStorage.getItem("authToken");

export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
};

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

const buildHeaders = (options: RequestOptions) => {
  const headers: Record<string, string> = {};
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  headers.Accept = "application/json";

  if (options.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const buildBody = (options: RequestOptions) => {
  if (!options.body) return undefined;
  if (options.body instanceof FormData) return options.body;
  return JSON.stringify(options.body);
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}/${path}`, {
    ...options,
    headers: {
      ...buildHeaders(options),
      ...(options.headers ?? {}),
    },
    body: buildBody(options),
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (typeof payload === "string") {
      const trimmed = payload.trim();
      const isHtml = trimmed.startsWith("<!DOCTYPE html>") || trimmed.startsWith("<html");
      throw new Error(isHtml ? "Server error." : trimmed || "Request failed");
    }

    throw new Error(payload?.message ?? "Request failed");
  }

  return payload as T;
};

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) => request<T>(path, { method: "POST", body }),
  put: <T>(path: string, body: unknown) => request<T>(path, { method: "PUT", body }),
  del: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
