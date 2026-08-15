// ─── Shared types used by components ─────────────────────────────────────
// Mock data removed — all data now fetched via src/api/wardenApi.ts

export type PassType = 'DAYPASS' | 'HOMEPASS';

export interface ApprovalRequest {
  id: string;       // passID
  name: string;
  rollNo: string;
  passType: PassType;
  duration: string; // formatted date string
  reason: string;
}

export interface AuditEntry {
  id: string;
  name: string;
  rollNo: string;
  action: string;
  time: string;
  remarks: string | null;
}

export interface DirectoryStudent {
  id: string;
  name: string;
  rollNo: string;
  hostelId: string;
  accent: 'navy' | 'brown';
}

export interface CurrentlyOutStudent {
  id: string;
  name: string;
  rollNo: string;
  passType: PassType;
  schedule: string;
  destination: string;
  overdue?: boolean;
}

export interface BlockedStudent {
  id: string;          // blocked record id
  rollNo: string;
  name: string;
  hostelId: string;
  date: string;        // formatted block date
  remark: string | null;
}
