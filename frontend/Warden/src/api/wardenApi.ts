import { Platform } from 'react-native';
import { getAccessToken } from '../utils/tokenStore';

// ─── Base URL ──────────────────────────────────────────────────────────────
// Web (browser on same machine) → localhost, Phone (Expo Go) → LAN IP
export const BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://10.0.43.53:3000';

// ─── Helpers ───────────────────────────────────────────────────────────────
async function authHeaders(): Promise<Record<string, string>> {
  const token = await getAccessToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: await authHeaders(),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `GET ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

async function put<T>(path: string, body?: object): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `PUT ${path} failed (${res.status})`);
  }
  return res.json() as Promise<T>;
}

// ─── Auth ──────────────────────────────────────────────────────────────────
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

// ─── Profile / getMe ───────────────────────────────────────────────────────
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

// ─── Passes ────────────────────────────────────────────────────────────────
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

/** Passes with status CareTakerapproved for the warden's hostel */
export function getApprovalsByHostel(hostelId: string): Promise<Pass[]> {
  return get<Pass[]>(`/Passes/getByHostelStatus/${hostelId}/Parentapproved`);
}

/** All passes for the hostel */
export function getPassesByHostel(hostelId: string): Promise<Pass[]> {
  return get<Pass[]>(`/Passes/getByHostel/${hostelId}`);
}

/** Currently checked-out students for the hostel */
export function getCurrentlyOut(hostelId: string): Promise<Pass[]> {
  return get<Pass[]>(`/Passes/getByHostelStatus/${hostelId}/CHECKEDOUT`);
}

/** Approve a pass (warden acting as caretaker role) */
export function approvePass(passId: string): Promise<Pass> {
  return put<Pass>(`/Passes/approveCaretaker/${passId}`);
}

/** Reject / cancel a pass */
export function rejectPass(passId: string): Promise<Pass> {
  return put<Pass>(`/Passes/rejectPass/${passId}`);
}

/** All pass actions (for Audit) */
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

// ─── Students ──────────────────────────────────────────────────────────────
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

// ─── Blocked ───────────────────────────────────────────────────────────────
export interface BlockedRecord {
  id: string;
  Roll_No: string;
  Hostel_id: string;
  Blocked_Role_ID: string;
  BlockedAt: string;
  UnblockedAt: string | null;
}

export function getAllBlocked(): Promise<BlockedRecord[]> {
  return get<BlockedRecord[]>('/Blocked/getAllBlocked');
}

export function unblockStudent(rollNo: string, Blocked_Role_id: string): Promise<unknown> {
  return put<unknown>(`/Blocked/unblockStudent/${rollNo}`, { Blocked_Role_id });
}
