import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const SUBJECT_ATTENDANCE = [
  { subject: "CD", attended: 27, total: 30 },
  { subject: "AAD", attended: 20, total: 28 },
  { subject: "Computer Science", attended: 25, total: 30 },
  { subject: "CGIP", attended: 18, total: 26 },
];

export default function AttendanceScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>📊 Subject-wise Attendance</Text>
      <Text style={styles.subtitle}>
        Minimum 75% attendance required for exam eligibility
      </Text>

      {SUBJECT_ATTENDANCE.map((item, index) => {
        const percentage = Math.round(
          (item.attended / item.total) * 100
        );
        const eligible = percentage >= 75;

        return (
          <View key={index} style={styles.card}>
            {/* Subject Header */}
            <View style={styles.row}>
              <Text style={styles.subject}>📘 {item.subject}</Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: eligible ? "#16A34A" : "#DC2626" },
                ]}
              >
                <Text style={styles.badgeText}>
                  {eligible ? "Eligible" : "Not Eligible"}
                </Text>
              </View>
            </View>

            {/* Attendance Details */}
            <Text style={styles.detail}>
              Attended: {item.attended} / {item.total} classes
            </Text>

            <Text
              style={[
                styles.percentage,
                { color: eligible ? "#16A34A" : "#DC2626" },
              ]}
            >
              {percentage}%
            </Text>

            {/* Status Message */}
            <Text style={styles.statusText}>
              {eligible
                ? "✅ You can attend the exam for this subject"
                : "⚠️ Attendance shortage – exam not permitted"}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  subject: {
    fontSize: 16,
    fontWeight: "bold",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },

  detail: {
    color: "#6B7280",
    marginBottom: 8,
  },

  percentage: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },

  statusText: {
    color: "#374151",
    marginTop: 5,
  },
});
