import { RiskLevel } from "../data/students";

export function calculateRisk(
  attendance: number,
  studyHours: number,
  overdueAssignments: number
): { score: number; level: RiskLevel; color: string } {
  let score = 0;

  if (attendance < 75) score += 40;
  if (studyHours < 10) score += 30;
  if (overdueAssignments > 0) score += overdueAssignments * 10;

  let level: RiskLevel = "LOW";
  let color = "#16A34A";

  if (score >= 70) {
    level = "HIGH";
    color = "#DC2626";
  } else if (score >= 40) {
    level = "MEDIUM";
    color = "#FACC15";
  }

  return { score, level, color };
}
