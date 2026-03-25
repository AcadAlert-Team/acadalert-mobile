import React, { useCallback, useState, useEffect } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../utils/supabase';
import { LineChart } from 'react-native-chart-kit';
import { API_BASE_URL } from '../utils/api';

const screenWidth = Dimensions.get('window').width;

export default function DashboardScreen() {
  const navigation = useNavigation<any>();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setStudentId(user.id);
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      if (!studentId) return;

      const backendURL = `${API_BASE_URL}/dashboard/${studentId}`;

      // Add this line to catch the exact URL!
      console.log("🚨 EXACT DASHBOARD URL:", backendURL);

      fetch(backendURL, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      })
        .then(async (res) => {
          const rawText = await res.text();
          console.log('🚨 DASHBOARD RAW RESPONSE:', rawText);
          return JSON.parse(rawText);
        })
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
    }, [studentId]),
  );

  // Show a loading spinner while waiting for the ML model
  if (loading || !studentId) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#0D6EFD" />
        <Text style={{ marginTop: 15, color: '#6C757D', fontWeight: '600' }}>Loading AI Dashboard...</Text>
      </SafeAreaView>
    );
  }

  // Show error if ngrok is down
  if (!dashboardData || dashboardData.error) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FA5252', fontSize: 16, fontWeight: 'bold' }}>⚠️ Failed to connect to server.</Text>
        <Text style={{ color: '#6C757D', marginTop: 10 }}>Check your backend connection.</Text>
      </SafeAreaView>
    );
  }

  const { student_name, attendance_percentage, risk_level, ai_insight, backlogs } = dashboardData;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          try {
            await supabase.auth.signOut();
            navigation.replace('Login');
          } catch (error) {
            console.error('Logout failed', error);
          }
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBackground}>
          <Text style={styles.name}>{student_name || 'Student'}</Text>
        </View>

        <View style={styles.cardContainer}>
          <View style={[
            styles.riskCard,
            risk_level === 'HIGH'
              ? styles.riskHigh
              : risk_level === 'MEDIUM'
              ? styles.riskMedium
              : styles.riskLow,
          ]}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>AI Risk Assessment</Text>
              <Text style={styles.icon}>
                {risk_level === 'HIGH' ? '⚠️' : risk_level === 'MEDIUM' ? '👀' : '✅'}
              </Text>
            </View>
            <Text style={[
              styles.riskBadge,
              risk_level === 'HIGH'
                ? styles.textHigh
                : risk_level === 'MEDIUM'
                ? styles.textMedium
                : styles.textLow,
            ]}>
              {risk_level ? risk_level.toUpperCase() : 'UNKNOWN'} RISK
            </Text>
            <Text style={styles.insightText}>{ai_insight}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{attendance_percentage}%</Text>
            <Text style={styles.statLabel}>Overall</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{backlogs}</Text>
            <Text style={styles.statLabel}>Backlogs</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Days Left</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Performance Trend</Text>
        <View style={styles.chartWrapper}>
          <LineChart
            data={{
              labels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Now"],
              datasets: [
                {
                  data: [88, 72, 65, 78, attendance_percentage || 0],
                },
              ],
            }}
            width={screenWidth - 40}
            height={180}
            yAxisSuffix="%"
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(13, 110, 253, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(108, 117, 125, ${opacity})`,
              style: { borderRadius: 16 },
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#0D6EFD" },
            }}
            bezier
            style={{ borderRadius: 16 }}
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  topBackground: { backgroundColor: '#0D6EFD', paddingHorizontal: 20, paddingTop: 45, paddingBottom: 60, borderBottomLeftRadius: 25, borderBottomRightRadius: 25 },
  name: { fontSize: 28, fontWeight: '900', color: '#FFFFFF' },
  cardContainer: { paddingHorizontal: 20, marginTop: -45 },
  riskCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  riskHigh: { borderTopWidth: 6, borderTopColor: '#FA5252' },
  riskMedium: { borderTopWidth: 6, borderTopColor: '#FAB005' },
  riskLow: { borderTopWidth: 6, borderTopColor: '#40C057' },
  textHigh: { color: '#FA5252' },
  textMedium: { color: '#FAB005' },
  textLow: { color: '#40C057' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 13, fontWeight: '700', color: '#868E96', textTransform: 'uppercase', letterSpacing: 1 },
  icon: { fontSize: 20 },
  riskBadge: { fontSize: 32, fontWeight: '900', marginBottom: 10 },
  insightText: { fontSize: 14, color: '#495057', lineHeight: 20, fontWeight: '500' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 20, marginBottom: 20 },
  statBox: { backgroundColor: '#FFFFFF', width: '31%', paddingVertical: 15, borderRadius: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  statValue: { fontSize: 22, fontWeight: '800', color: '#212529', marginBottom: 4 },
  statLabel: { fontSize: 11, color: '#868E96', fontWeight: '600', textAlign: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#212529', marginHorizontal: 24, marginBottom: 15 },
  chartWrapper: { marginHorizontal: 20, backgroundColor: '#FFFFFF', borderRadius: 16, paddingVertical: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  logoutButton: { position: 'absolute', top: 40, right: 20, backgroundColor: '#FEF2F2', borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: 'bold' },
});