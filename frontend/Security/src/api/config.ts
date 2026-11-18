import axios from "axios";

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

const SECURITY_SECRET = process.env.EXPO_PUBLIC_SECURITY_SECRET!;

export function buildSecuritySig(qrId: string): string {
  return `${SECURITY_SECRET}::${Date.now()}::${qrId}`;
}

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

