import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const timetable = [
  { subject: "Mathematics", time: "09:00 - 10:00" },
  { subject: "Physics", time: "10:15 - 11:15" },
  { subject: "Computer Science", time: "11:30 - 12:30" },
];

export default function TimetableScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗓️ Today’s Timetable</Text>

      <FlatList
        data={timetable}
        keyExtractor={(item) => item.subject}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subject}>📘 {item.subject}</Text>
            <Text style={styles.time}>⏰ {item.time}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F9FAFB" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  card: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 3,
  },
  subject: { fontSize: 16, fontWeight: "bold" },
  time: { color: "#6B7280", marginTop: 5 },
});
