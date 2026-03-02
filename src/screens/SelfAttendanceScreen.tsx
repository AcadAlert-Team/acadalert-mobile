import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SelfAttendanceScreen() {
  const subjects = ["AAD", "CGIP", "Computer Science","CD"];
  const [marked, setMarked] = useState<{ [key: string]: string }>({});

  const markAttendance = (subject: string, status: string) => {
    setMarked({ ...marked, [subject]: status });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Today's Attendance</Text>

      {subjects.map((sub) => (
        <View key={sub} style={styles.card}>
          <Text style={styles.subject}>{sub}</Text>

          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.btn, styles.present]}
              onPress={() => markAttendance(sub, "Present")}
            >
              <Text style={styles.btnText}>Present</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.absent]}
              onPress={() => markAttendance(sub, "Absent")}
            >
              <Text style={styles.btnText}>Absent</Text>
            </TouchableOpacity>
          </View>

          {marked[sub] && (
            <Text style={styles.status}>Marked: {marked[sub]}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
  },
  subject: { fontSize: 16, fontWeight: "bold" },
  row: { flexDirection: "row", marginTop: 10 },
  btn: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  present: { backgroundColor: "#16A34A" },
  absent: { backgroundColor: "#DC2626", marginRight: 0 },
  btnText: { color: "white", fontWeight: "bold" },
  status: { marginTop: 10, color: "#6B7280" },
});
