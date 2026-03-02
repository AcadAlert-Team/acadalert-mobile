import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function StudyLogScreen() {
  const [hours, setHours] = useState("");
  const [problems, setProblems] = useState("");
  const [tags, setTags] = useState("");
  const [notes, setNotes] = useState("");
  const [logs, setLogs] = useState<any[]>([]);

  const saveLog = () => {
    if (!hours || !problems) return;

    const newLog = {
      date: new Date().toDateString(),
      hours,
      problems,
      tags,
      notes,
    };

    setLogs([newLog, ...logs]);
    setHours("");
    setProblems("");
    setTags("");
    setNotes("");
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>📖 Study Log</Text>
      <Text style={styles.subtitle}>
        Record today’s learning activity for better tracking
      </Text>

      {/* Input Card */}
      <View style={styles.card}>
        <Text style={styles.label}>Hours Studied</Text>
        <TextInput
          placeholder="e.g. 2.5 (hours)"
          style={styles.input}
          keyboardType="numeric"
          value={hours}
          onChangeText={setHours}
        />

        <Text style={styles.label}>Problems Solved</Text>
        <TextInput
          placeholder="e.g. 10 math problems, 2 coding questions"
          style={styles.input}
          value={problems}
          onChangeText={setProblems}
        />

        <Text style={styles.label}>Tags</Text>
        <TextInput
          placeholder="e.g. Math, DSA, Physics"
          style={styles.input}
          value={tags}
          onChangeText={setTags}
        />

        <Text style={styles.label}>Notes</Text>
        <TextInput
          placeholder="e.g. Learned binary search, need revision on formulas"
          style={[styles.input, { height: 80 }]}
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity style={styles.button} onPress={saveLog}>
          <Text style={styles.buttonText}>Save Today’s Log</Text>
        </TouchableOpacity>
      </View>

      {/* History */}
      <Text style={styles.historyTitle}>📚 Study History</Text>

      {logs.length === 0 && (
        <Text style={styles.empty}>No study logs added yet</Text>
      )}

      {logs.map((log, index) => (
        <View key={index} style={styles.historyCard}>
          <Text style={styles.date}>{log.date}</Text>
          <Text>⏱ Hours: {log.hours}</Text>
          <Text>🧠 Problems: {log.problems}</Text>
          {log.tags ? <Text>🏷 Tags: {log.tags}</Text> : null}
          {log.notes ? <Text>📝 Notes: {log.notes}</Text> : null}
        </View>
      ))}
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
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 18,
    elevation: 3,
    marginBottom: 30,
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#F9FAFB",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 15,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  empty: {
    color: "#6B7280",
    fontStyle: "italic",
  },

  historyCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 14,
    marginBottom: 10,
    elevation: 2,
  },
  date: {
    fontWeight: "bold",
    marginBottom: 5,
  },
});
