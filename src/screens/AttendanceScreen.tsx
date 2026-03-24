import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';

export default function AttendanceScreen() {
  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const studentId = 'S04'; 
const backendURL = `https://overcaptious-jacquline-impatiently.ngrok-free.dev/api/subject-analysis/${studentId}`;

  useEffect(() => {
    fetch(backendURL)
      .then(res => res.json())
      .then(data => {
        setSubjectData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load subject analysis", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0D6EFD" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Subject Analysis</Text>
        <Text style={styles.subtitle}>Detailed breakdown and ML inferences.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {subjectData.map((sub) => (
          <View key={sub.id} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.subjectName}>{sub.name}</Text>
              <Text style={[styles.percentText, sub.status === 'critical' ? styles.textRed : sub.status === 'warning' ? styles.textOrange : styles.textGreen]}>
                {sub.percent}%
              </Text>
            </View>

            <View style={styles.progressBarBg}>
              <View style={[
                  styles.progressBarFill, 
                  { width: `${Math.min(sub.percent, 100)}%` }, // Caps visual bar at 100%
                  sub.status === 'critical' ? styles.bgRed : sub.status === 'warning' ? styles.bgOrange : styles.bgGreen
                ]} 
              />
            </View>
            
            <Text style={styles.attendanceFraction}>{sub.attended} / {sub.held} classes attended</Text>

            <View style={[styles.inferenceBox, sub.status === 'critical' ? styles.boxRed : sub.status === 'warning' ? styles.boxOrange : styles.boxGreen]}>
              <Text style={styles.inferenceText}>{sub.inference}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: { padding: 24, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#EAEAEA' },
  title: { fontSize: 28, fontWeight: '800', color: '#212529' },
  subtitle: { fontSize: 15, color: '#868E96', marginTop: 5 },
  listContainer: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  subjectName: { fontSize: 16, fontWeight: '700', color: '#343A40', flex: 1 },
  percentText: { fontSize: 20, fontWeight: '900' },
  textRed: { color: '#FA5252' }, textOrange: { color: '#FD7E14' }, textGreen: { color: '#40C057' },
  bgRed: { backgroundColor: '#FA5252' }, bgOrange: { backgroundColor: '#FD7E14' }, bgGreen: { backgroundColor: '#40C057' },
  progressBarBg: { height: 8, backgroundColor: '#E9ECEF', borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressBarFill: { height: '100%', borderRadius: 4 },
  attendanceFraction: { fontSize: 13, color: '#ADB5BD', fontWeight: '600', marginBottom: 16 },
  inferenceBox: { padding: 12, borderRadius: 8, borderWidth: 1 },
  boxRed: { backgroundColor: '#FFF0F0', borderColor: '#FFE3E3' },
  boxOrange: { backgroundColor: '#FFF4E6', borderColor: '#FFE8CC' },
  boxGreen: { backgroundColor: '#EBFBEE', borderColor: '#D3F9D8' },
  inferenceText: { fontSize: 14, color: '#495057', fontWeight: '500', lineHeight: 20 }
});