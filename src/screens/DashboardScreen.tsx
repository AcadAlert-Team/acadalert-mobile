import React, { useCallback, useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Lock onto Safvan for the High Risk demo
  const studentId = 'S04';

  // 2. Point this to your live Express server ngrok link
  const backendURL = `https://carly-homozygous-federico.ngrok-free.dev/api/dashboard/${studentId}`;

  // 3. Fetch the live data when the app opens
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      fetch(backendURL)
        .then(res => res.json())
        .then(data => {
          if (isActive) {
            setDashboardData(data);
            setLoading(false);
          }
        })
        .catch(err => {
          console.error('Failed to fetch dashboard data:', err);
          if (isActive) setLoading(false);
        });

      return () => {
        isActive = false;
      };
    }, []),
  );

  // Show a loading spinner while waiting for the ML model
  if (loading) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <ActivityIndicator size="large" color="#0D6EFD" />
        <Text style={{ marginTop: 15, color: '#6C757D', fontWeight: '600' }}>
          Running AI Analysis...
        </Text>
      </SafeAreaView>
    );
  }

  // Show error if ngrok is down
  if (!dashboardData || dashboardData.error) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: '#FA5252', fontSize: 16, fontWeight: 'bold' }}>
          ⚠️ Failed to connect to server.
        </Text>
        <Text style={{ color: '#6C757D', marginTop: 10 }}>
          Check if ngrok and Flask are running.
        </Text>
      </SafeAreaView>
    );
  }

  // 4. Extract the live data from your Express/Flask backend!
  const {
    student_name,
    attendance_percentage,
    risk_level,
    ai_insight,
    backlogs,
  } = dashboardData;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Dynamic Header Background */}
        <View style={styles.topBackground}>
          <Text style={styles.greeting}>Good morning,</Text>
          <Text style={styles.name}>{student_name}</Text>
        </View>

        {/* Floating Risk Card */}
        <View style={styles.cardContainer}>
          <View
            style={[
              styles.riskCard,
              risk_level === 'HIGH' ? styles.riskHigh : styles.riskLow,
            ]}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>AI Risk Assessment</Text>
              <Text style={styles.icon}>
                {risk_level === 'HIGH' ? '⚠️' : '✅'}
              </Text>
            </View>
            <Text
              style={[
                styles.riskBadge,
                risk_level === 'HIGH' ? styles.textHigh : styles.textLow,
              ]}
            >
              {risk_level ? risk_level.toUpperCase() : 'UNKNOWN'} RISK
            </Text>
            <Text style={styles.insightText}>{ai_insight}</Text>
          </View>
        </View>

        {/* Quick Stats Grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{attendance_percentage}%</Text>
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
  topBackground: {
    backgroundColor: '#0D6EFD',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 80,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: { fontSize: 18, color: '#E9ECEF', opacity: 0.9 },
  name: { fontSize: 36, fontWeight: '900', color: '#FFFFFF', marginTop: 4 },
  cardContainer: {
    paddingHorizontal: 20,
    marginTop: -60,
  },
  riskCard: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  riskHigh: { borderTopWidth: 6, borderTopColor: '#FA5252' },
  riskLow: { borderTopWidth: 6, borderTopColor: '#40C057' },
  textHigh: { color: '#FA5252' },
  textLow: { color: '#40C057' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#868E96',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  icon: { fontSize: 20 },
  riskBadge: { fontSize: 36, fontWeight: '900', marginBottom: 15 },
  insightText: {
    fontSize: 15,
    color: '#495057',
    lineHeight: 22,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#212529',
    marginHorizontal: 24,
    marginTop: 30,
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statBox: {
    backgroundColor: '#FFFFFF',
    width: '30%',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#212529',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#868E96',
    fontWeight: '600',
    textAlign: 'center',
  },
});
