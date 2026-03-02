import { Student } from "./students";
import { calculateRisk } from "../utils/riskCalculator";

export const students: Student[] = [
  (() => {
    const r = calculateRisk(68, 6, 3);
    return {
      id: 1,
      name: "Muhammed Safvan",
      attendance: 68,
      studyHours: 6,
      overdueAssignments: 3,
      riskScore: r.score,
      riskLevel: r.level,
    };
  })(),
];
