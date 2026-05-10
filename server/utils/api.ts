import { createError, type H3Event } from "h3";
import { VaultAddress } from "@/config/constant";

export const MELLOW_API_BASE_URL = "https://points.mellow.finance/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const assertGetMethod = (event: H3Event) => {
  if (event.method !== "GET") {
    throw new ApiError("Method not allowed", 405);
  }
};

export const normalizeAddress = (
  value: unknown,
  options: { label?: string; requiredMessage?: string } = {},
) => {
  const label = options.label ?? "Address";
  const address = String(value ?? "").trim();

  if (!address) {
    throw new ApiError(options.requiredMessage ?? `${label} is required`, 400);
  }

  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new ApiError(`Invalid ${label.toLowerCase()} format`, 400);
  }

  return address.toLowerCase();
};

export const getConfiguredVaultAddress = () =>
  normalizeAddress(VaultAddress, {
    label: "Vault address",
    requiredMessage: "Vault address is not configured",
  });

export const fetchMellowArray = async <T>(
  path: string,
  errorMessage: string,
  options: { notFoundAsEmpty?: boolean } = {},
): Promise<T[]> => {
  const response = await fetch(`${MELLOW_API_BASE_URL}${path}`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    if (response.status === 404 && options.notFoundAsEmpty) {
      return [];
    }

    throw new ApiError(
      errorMessage,
      response.status,
      `HTTP ${response.status}: ${response.statusText}`,
    );
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new ApiError("Invalid response format", 500, "Expected array");
  }

  return data as T[];
};

export const handleApiError = (error: unknown, fallbackMessage: string) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message = error instanceof Error ? error.message : fallbackMessage;
  const details = error instanceof ApiError ? error.details : undefined;

  throw createError({
    statusCode,
    statusMessage: message,
    data: details ? { details } : undefined,
  });
};
