import { getAccessToken, getRefreshToken, getUserId, saveTokens, clearTokens } from '../utils/tokenStore';
import { triggerWardenLogout } from '../utils/logoutSignal';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  if (isRefreshing && refreshPromise) return refreshPromise;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = await getRefreshToken();
      const userId = await getUserId();
      if (!refreshToken || !userId) return null;

      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, refreshToken }),
      });

      if (!res.ok) {
        await clearTokens();
        triggerWardenLogout();
        return null;
      }

      const data = await res.json();
      await saveTokens(data.accessToken, data.refreshToken, data.userid);
      return data.accessToken as string;
    } catch {
      await clearTokens();
      triggerWardenLogout();
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function fetchWithAuth(input: string, init: RequestInit = {}): Promise<Response> {
  const accessToken = await getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> ?? {}),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    const newToken = await refreshAccessToken();
    if (!newToken) return res;
    const retryHeaders = { ...headers, Authorization: `Bearer ${newToken}` };
    return fetch(input, { ...init, headers: retryHeaders });
  }

  return res;
}

async function get<T>(path: string): Promise<T> {
  const res = await fetchWithAuth(`${BASE_URL}${path}`);
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `GET ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

async function put<T>(path: string, body?: object): Promise<T> {
  const res = await fetchWithAuth(`${BASE_URL}${path}`, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `PUT ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  UserID: string;
}

export async function loginWarden(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Email: email, password, role: 'WARDEN' }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || 'Login failed');
  }
  return res.json() as Promise<LoginResponse>;
}

export interface WardenMe {
  user: {
    Id: string;
    Name: string;
    Email: string;
    Phone: string;
    role: string;
  };
  hostel: {
    Block_Id: string;
    Warden_Id: string;
    CareTaker_Id: string;
  } | null;
}

export function getMe(): Promise<WardenMe> {
  return get<WardenMe>('/hostel/getMe');
}

export function updateMyProfile(data: { Name?: string; Phone?: string }): Promise<{ message: string }> {
  return put<{ message: string }>('/auth/updateMe', data);
}

export interface PassStudent {
  Roll_No: string;
  Block_Id: string;
  User_Id: string;
}

export interface Pass {
  passID: string;
  RollNo: string;
  passType: 'DAY_PASS' | 'HOME_PASS';
  HostelId: string;
  RaisedAt: string;
  Destination: string;
  Purpose: string;
  ModeofTransport: string;
  QRCODE: string;
  Status: string;
  Expected_Date: string;
  Expected_Time: string;
  Actual_Return_Date: string | null;
  Actual_Return_Time: string | null;
  student?: PassStudent;
}

export function getApprovalsByHostel(hostelId: string): Promise<Pass[]> {
  return get<Pass[]>(`/Passes/getByHostelStatus/${hostelId}/Parentapproved`);
}

export function getPassesByHostel(hostelId: string): Promise<Pass[]> {
  return get<Pass[]>(`/Passes/getByHostel/${hostelId}`);
}

export function getCurrentlyOut(hostelId: string): Promise<Pass[]> {
  return get<Pass[]>(`/Passes/getByHostelStatus/${hostelId}/CHECKEDOUT`);
}

export function approvePass(passId: string): Promise<Pass> {
  return put<Pass>(`/Passes/approveCaretaker/${passId}`);
}

export function rejectPass(passId: string): Promise<Pass> {
  return put<Pass>(`/Passes/rejectPass/${passId}`);
}

export interface PassAction {
  id: string;
  passID: string;
  Actor_Id: string;
  Action_Type: string;
  Timestamp: string;
  Remarks: string | null;
}

export function getAllPassActions(): Promise<PassAction[]> {
  return get<PassAction[]>('/Passes/getPassActions');
}

export interface StudentRecord {
  USER_ID: string;
  Roll_NO: string;
  Name: string;
  Email: string;
  PhoneNo: string;
  Hostel_Id: string;
  IS_BLOCKED: boolean;
  DEFAULTER_Attempts: number;
}

export function getStudentsByHostel(hostelId: string): Promise<StudentRecord[]> {
  return get<StudentRecord[]>(`/student/getbyHostel/${hostelId}`);
}

export interface BlockedRecord {
  id: string;
  Roll_No: string;
  Hostel_id: string;
  Blocked_Role_ID: string;
  BlockedAt: string;
  UnblockedAt: string | null;
  Reason: string;
  Proof_Url: string | null;
}

export function getAllBlocked(): Promise<BlockedRecord[]> {
  return get<BlockedRecord[]>('/Blocked/getAllBlocked');
}

export function unblockStudent(rollNo: string, Blocked_Role_id: string): Promise<unknown> {
  return put<unknown>(`/Blocked/unblockStudent/${rollNo}`, { Blocked_Role_id });
}

