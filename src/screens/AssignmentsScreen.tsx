import React, { useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function AssignmentsScreen() {
  const [assignments, setAssignments] = useState([
    { title: 'Math Assignment', status: 'Not Started' },
    { title: 'Physics Lab', status: 'In Progress' },
    { title: 'CS Mini Project', status: 'Submitted' },
  ]);

  const getColor = (status: string) => {
    if (status === 'Submitted') return '#16A34A';
    if (status === 'In Progress') return '#F59E0B';
    return '#DC2626';
  };

  const toggleStatus = (index: number) => {
    const flow = ['Not Started', 'In Progress', 'Submitted'];
    const next = (flow.indexOf(assignments[index].status) + 1) % flow.length;
    const updated = [...assignments];
    updated[index].status = flow[next];
    setAssignments(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📁 Assignments</Text>

      {assignments.map((a, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          onPress={() => toggleStatus(i)}
        >
          <Text style={styles.name}>{a.title}</Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getColor(a.status) },
            ]}
          >
            <Text style={styles.statusText}>{a.status}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Text style={styles.hint}>Tap assignment to update status</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F9FAFB' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  statusBadge: {
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { color: 'white', fontWeight: 'bold' },
  hint: { textAlign: 'center', color: '#6B7280', marginTop: 10 },
});
