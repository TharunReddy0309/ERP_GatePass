// ─── Shared types used by components ─────────────────────────────────────
// Mock data removed — all data now fetched via src/api/caretakerApi.ts

export type PassType = 'DAYPASS' | 'HOMEPASS';

export interface ApprovalRequest {
  id: string;       // passID
  name: string;
  rollNo: string;
  passType: PassType;
  duration: string; // formatted date string
  reason: string;
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

// ─── Static dashboard tile config (labels only — counts fetched via API in future) ─
export const dashboardMetrics = [
  {
    id: 'awaiting',
    label: 'AWAITING APPROVAL',
    value: '—',
    tone: 'danger' as const,
  },
  {
    id: 'out',
    label: 'CURRENTLY OUT',
    value: '—',
    tone: 'default' as const,
  },
];
