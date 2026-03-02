export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface Student {
  id: number;
  name: string;
  attendance: number; // %
  studyHours: number; // per week
  overdueAssignments: number;
  riskScore: number;
  riskLevel: RiskLevel;
}
