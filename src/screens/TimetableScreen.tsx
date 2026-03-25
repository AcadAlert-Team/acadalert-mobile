import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";

// 1. Define strict TypeScript types so the app knows exactly what to expect
type DayOfWeek = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday";

interface ClassSession {
  id: string;
  time: string;
  code: string;
  subject: string;
  color: string;
}

// 2. Type the data object so TypeScript knows it only contains those 5 days
const timetableData: Record<DayOfWeek, ClassSession[]> = {
  Monday: [
    { id: "1", time: "09:30 - 10:30", code: "AAD", subject: "Algorithm Analysis And Design", color: "#1F2937" },
    { id: "2", time: "10:30 - 11:25", code: "MENT", subject: "Mentoring", color: "#10B981" },
    { id: "3", time: "11:35 - 12:30", code: "CD", subject: "Compiler Design", color: "#047857" },
    { id: "4", time: "01:30 - 02:30", code: "CGIP", subject: "Computer Graphics and Image Processing", color: "#D97706" },
    { id: "5", time: "02:30 - 03:25", code: "ELEC", subject: "Elective", color: "#8B5CF6" },
    { id: "6", time: "03:35 - 04:30", code: "CCW", subject: "Co-Curricular Work", color: "#4C1D95" },
  ],
  Tuesday: [
    { id: "1", time: "09:30 - 12:30", code: "NETWORKING", subject: "Networking Lab / Mini Project", color: "#991B1B" },
    { id: "2", time: "01:30 - 02:30", code: "IEFT", subject: "Industrial Economics And Foreign Trade", color: "#06B6D4" },
    { id: "3", time: "02:30 - 04:30", code: "HNRS/MNR", subject: "Honours and Minors", color: "#713F12" },
  ],
  Wednesday: [
    { id: "1", time: "09:30 - 10:30", code: "ELEC", subject: "Elective", color: "#8B5CF6" },
    { id: "2", time: "10:30 - 11:25", code: "AAD", subject: "Algorithm Analysis And Design", color: "#1F2937" },
    { id: "3", time: "11:35 - 12:30", code: "CD", subject: "Compiler Design", color: "#047857" },
    { id: "4", time: "01:30 - 02:30", code: "CGIP", subject: "Computer Graphics and Image Processing", color: "#D97706" },
    { id: "5", time: "02:30 - 03:25", code: "IEFT", subject: "Industrial Economics And Foreign Trade", color: "#06B6D4" },
    { id: "6", time: "03:35 - 04:30", code: "CGIP", subject: "Computer Graphics and Image Processing", color: "#D97706" },
  ],
  Thursday: [
    { id: "1", time: "09:30 - 10:30", code: "CD", subject: "Compiler Design", color: "#047857" },
    { id: "2", time: "10:30 - 11:25", code: "IEFT", subject: "Industrial Economics And Foreign Trade", color: "#06B6D4" },
    { id: "3", time: "11:35 - 12:30", code: "ELEC", subject: "Elective", color: "#8B5CF6" },
    { id: "4", time: "01:30 - 04:30", code: "NETWORKING", subject: "Networking Lab / Mini Project", color: "#991B1B" },
  ],
  Friday: [
    { id: "1", time: "09:30 - 10:20", code: "AAD", subject: "Algorithm Analysis And Design", color: "#1F2937" },
    { id: "2", time: "10:20 - 11:10", code: "CGIP", subject: "Computer Graphics and Image Processing", color: "#D97706" },
    { id: "3", time: "11:20 - 12:10", code: "AAD", subject: "Algorithm Analysis And Design", color: "#1F2937" },
    { id: "4", time: "02:00 - 02:50", code: "CD", subject: "Compiler Design", color: "#047857" },
    { id: "5", time: "02:50 - 04:30", code: "HNRS/MNR", subject: "Honours and Minors", color: "#713F12" },
  ],
};

const daysOfWeek: DayOfWeek[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function TimetableScreen() {
  // 3. State is now strictly typed to only accept one of our 5 days
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>("Monday");

  useEffect(() => {
    const currentDayIndex = new Date().getDay(); 
    if (currentDayIndex >= 1 && currentDayIndex <= 5) {
      setSelectedDay(daysOfWeek[currentDayIndex - 1]);
    } else {
      setSelectedDay("Monday"); 
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🗓️ Class Timetable</Text>
      </View>

      <View style={styles.tabContainer}>
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            style={[styles.tab, selectedDay === day && styles.activeTab]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[styles.tabText, selectedDay === day && styles.activeTabText]}>
              {day.substring(0, 3)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={timetableData[selectedDay]}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={[styles.card, { borderLeftColor: item.color }]}>
            <View style={styles.cardHeader}>
              <Text style={styles.code}>{item.code}</Text>
              <View style={styles.timeContainer}>
                <Text style={styles.timeText}>⏰ {item.time}</Text>
              </View>
            </View>
            <Text style={styles.subject}>{item.subject}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F4F6F8" 
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  title: { 
    fontSize: 26, 
    fontWeight: "800", 
    color: "#212529" 
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#E9ECEF",
  },
  activeTab: {
    backgroundColor: "#0D6EFD", 
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#495057",
  },
  activeTabText: {
    color: "#FFFFFF",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 14,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  code: { 
    fontSize: 18, 
    fontWeight: "900", 
    color: "#212529",
    letterSpacing: 0.5,
  },
  timeContainer: {
    backgroundColor: "#F8F9FA",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  timeText: { 
    color: "#495057", 
    fontSize: 13,
    fontWeight: "600"
  },
  subject: { 
    fontSize: 14, 
    color: "#6C757D",
    fontWeight: "500",
    lineHeight: 20,
  },
});