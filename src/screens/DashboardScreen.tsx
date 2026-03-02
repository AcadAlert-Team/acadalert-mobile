import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { students } from "../data/mockStudents";
import { calculateRisk } from "../utils/riskCalculator";

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const student = students[0];

  const risk = calculateRisk(
    student.attendance,
    student.studyHours,
    student.overdueAssignments
  );

  const insight =
    risk.level === "HIGH"
      ? "⚠️ Immediate attention needed. Improve attendance and clear pending work."
      : risk.level === "MEDIUM"
      ? "🟡 You’re doing okay. Stay consistent and reduce backlog."
      : "🟢 Excellent progress. Keep maintaining your routine.";

  const handleLogout = () => {
    navigation.replace("Login");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good day 👋</Text>
          <Text style={styles.name}>{student.name}</Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Risk Overview */}
      <View style={[styles.riskCard, { borderLeftColor: risk.color }]}>
        <View style={styles.riskRow}>
          <View>
            <Text style={styles.riskLabel}>Academic Risk</Text>
            <Text style={[styles.riskLevel, { color: risk.color }]}>
              {risk.level}
            </Text>
          </View>
          <Text style={[styles.riskScore, { color: risk.color }]}>
            {risk.score}
          </Text>
        </View>
        <Text style={styles.insight}>{insight}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{student.attendance}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{student.studyHours}h</Text>
          <Text style={styles.statLabel}>Study / week</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{student.overdueAssignments}</Text>
          <Text style={styles.statLabel}>Overdue</Text>
        </View>
      </View>

      {/* Actions */}
      <Text style={styles.sectionTitle}>Student Actions</Text>

      <View style={styles.grid}>
        <DashboardButton
          title="Attendance"
          sub="Overview"
          icon="📊"
          onPress={() => navigation.navigate("Attendance")}
        />
        <DashboardButton
          title="Self Attendance"
          sub="Mark Today"
          icon="✅"
          onPress={() => navigation.navigate("SelfAttendance")}
        />
        <DashboardButton
          title="Timetable"
          sub="Classes"
          icon="🗓️"
          onPress={() => navigation.navigate("Timetable")}
        />
        <DashboardButton
          title="Assignments"
          sub="Track Tasks"
          icon="📁"
          onPress={() => navigation.navigate("Assignments")}
        />
        <DashboardButton
          title="Study Log"
          sub="Daily Progress"
          icon="📘"
          onPress={() => navigation.navigate("StudyLog")}
        />
      </View>
    </ScrollView>
  );
}

/* Reusable Button */
function DashboardButton({
  title,
  sub,
  icon,
  onPress,
}: {
  title: string;
  sub: string;
  icon: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.actionCard} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.actionTitle}>{title}</Text>
      <Text style={styles.actionSub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  greeting: {
    color: "#6B7280",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  logout: {
    color: "#DC2626",
    fontWeight: "bold",
  },

  /* Risk */
  riskCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 18,
    borderLeftWidth: 6,
    marginBottom: 25,
  },
  riskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  riskLabel: {
    color: "#6B7280",
  },
  riskLevel: {
    fontSize: 20,
    fontWeight: "bold",
  },
  riskScore: {
    fontSize: 26,
    fontWeight: "bold",
  },
  insight: {
    marginTop: 10,
    color: "#374151",
  },

  /* Stats */
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    width: "31%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 16,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2563EB",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },

  /* Actions */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
  },
  icon: {
    fontSize: 26,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  actionSub: {
    color: "#6B7280",
    marginTop: 3,
  },
});
