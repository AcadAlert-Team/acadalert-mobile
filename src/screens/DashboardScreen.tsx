import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const studentId = 'S04'; 
const backendURL = `https://overcaptious-jacquline-impatiently.ngrok-free.dev/api/dashboard/${studentId}`;

export default function DashboardScreen() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(backendURL, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
      }
    })
      .then(async res => {
        const textResponse = await res.text();
        
        // 1. Check if ngrok sent an HTML warning page
        if (textResponse.trim().startsWith('<')) {
          throw new Error("Ngrok is sending an HTML page. Is your Node server running?");
        }

        const data = JSON.parse(textResponse);

        // 2. If the backend sent a 404 or 500, grab the EXACT error message and throw it!
        if (!res.ok) {
          throw new Error(data.error || `Server Error: Status ${res.status}`);
        }

        return data;
      })
      .then(data => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Dashboard Fetch Error:", err.message);
        // 3. Save the specific error to display on the UI
        setDashboardData({ error: err.message });
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0D6EFD" />
        <Text style={{ marginTop: 15, color: '#6C757D', fontWeight: '600' }}>Running AI Analysis...</Text>
      </SafeAreaView>
    );
  }

  // CHANGED: We now show the EXACT error message on the screen so we aren't guessing!
  if (!dashboardData || dashboardData.error) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ color: '#FA5252', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>⚠️ Backend Rejected Request</Text>
        <Text style={{ color: '#495057', marginTop: 10, textAlign: 'center', fontWeight: '600' }}>
          Reason: {dashboardData?.error || "Unknown Error"}
        </Text>
        <Text style={{ color: '#868E96', marginTop: 15, textAlign: 'center', fontSize: 12 }}>
          Check your Supabase database and your Node.js terminal logs.
        </Text>
      </SafeAreaView>
    );
  }

  const { student_name, attendance_rate, risk_level, ai_insight, backlogs } = dashboardData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBackground}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{student_name}</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={[styles.riskCard, risk_level === 'High' ? styles.riskHigh : styles.riskLow]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>AI Risk Assessment</Text>
              <Text style={styles.icon}>{risk_level === 'High' ? '⚠️' : '✅'}</Text>
            </View>
            <Text style={[styles.riskBadge, risk_level === 'High' ? styles.textHigh : styles.textLow]}>
              {risk_level ? risk_level.toUpperCase() : 'UNKNOWN'} RISK
            </Text>
            <Text style={styles.insightText}>{ai_insight}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{attendance_rate}%</Text>
            <Text style={styles.statLabel}>Overall</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{backlogs}</Text>
            <Text style={styles.statLabel}>Active Backlogs</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Days to Exams</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  topBackground: { backgroundColor: '#0D6EFD', padding: 24, paddingTop: 40, paddingBottom: 80, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  greeting: { fontSize: 18, color: '#E9ECEF', opacity: 0.9 },
  name: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', marginTop: 4 },
  cardContainer: { paddingHorizontal: 20, marginTop: -60 },
  riskCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  riskHigh: { borderTopWidth: 6, borderTopColor: '#FA5252' },
  riskLow: { borderTopWidth: 6, borderTopColor: '#40C057' },
  textHigh: { color: '#FA5252' },
  textLow: { color: '#40C057' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#868E96', textTransform: 'uppercase', letterSpacing: 1 },
  icon: { fontSize: 20 },
  riskBadge: { fontSize: 36, fontWeight: '900', marginBottom: 15 },
  insightText: { fontSize: 15, color: '#495057', lineHeight: 22, fontWeight: '500' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#212529', marginHorizontal: 24, marginTop: 30, marginBottom: 15 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 30 },
  statBox: { backgroundColor: '#FFFFFF', width: '30%', paddingVertical: 20, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#212529', marginBottom: 5 },
  statLabel: { fontSize: 12, color: '#868E96', fontWeight: '600', textAlign: 'center' }
});