import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// --- DUOLINGO COLOR PALETTE ---
const colors = {
  duoGreen: '#58CC02',
  duoBackground: '#FFFFFF',
  duoGray: '#E5E5E5',
  duoTextDark: '#4B4B4B',
  duoBlue: '#1CB0F6',
  duoBlueShadow: '#1899D6',
};

// --- DATA ---
const subjects = [
  { id: 'CGIP', name: 'Computer Graphics' },
  { id: 'CD', name: 'Compiler Design' },
  { id: 'IEFT', name: 'Industrial Economics' },
  { id: 'AAD', name: 'Algorithm Analysis' },
  { id: 'ELEC', name: 'Elective' }
];

const DashboardScreen = () => {
  // Fake data for Tuesday's demo
  const studentName = "Adinath";
  const riskLevel = "LOW RISK"; 
  const attendance = "85%";

  return (
    <View style={styles.screenContainer}>
      {/* The Duolingo-Style Risk Card */}
      <View style={[styles.card, styles.cardGreen]}>
        <Text style={styles.cardTitle}>Current Status</Text>
        <Text style={styles.riskText}>{riskLevel}</Text>
        <Text style={styles.insightText}>
          Great job, {studentName}! Keep the grind.
        </Text>
      </View>

      {/* Stats Container */}
      <View style={styles.statsRow}>
        <View style={[styles.smallCard, styles.cardGray]}>
          <Text style={styles.statLabel}>Attendance</Text>
          <Text style={styles.statValue}>{attendance}</Text>
        </View>
        <View style={[styles.smallCard, styles.cardGray]}>
          <Text style={styles.statLabel}>Pending Tasks</Text>
          <Text style={styles.statValue}>1</Text>
        </View>
      </View>
    </View>
  );
};

const LogClassScreen = () => {
  const [attendanceData, setAttendanceData] = useState({
    CGIP: '', CD: '', IEFT: '', AAD: '', ELEC: ''
  });

  const handleInputChange = (subjectId, value) => {
    setAttendanceData(prev => ({ ...prev, [subjectId]: value }));
  };

  const handleSubmit = () => {
    // This is where you will send the POST request to your Express server!
    console.log("Sending to Express:", attendanceData);
    alert("Attendance synced to AcadAlert Backend!");
  };

  return (
    <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
      <Text style={styles.headerText}>Initialize Semester</Text>
      <Text style={styles.subText}>Enter the number of classes you have attended so far to calibrate the prediction model.</Text>

      {subjects.map((sub) => (
        <View key={sub.id} style={styles.subjectCard}>
          <Text style={styles.subjectTitle}>{sub.name}</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#AFAFAF"
              value={attendanceData[sub.id]}
              onChangeText={(val) => handleInputChange(sub.id, val)}
            />
            <Text style={styles.totalText}> Classes Attended</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>SYNC DATA</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// --- NAVIGATION SETUP ---
const Tab = createBottomTabNavigator();

const MyTabs = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.duoGreen,
          height: 100, 
          borderBottomWidth: 4,
          borderBottomColor: '#46A302', 
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 24,
          textTransform: 'uppercase', 
        },
        tabBarStyle: {
          backgroundColor: colors.duoBackground,
          borderTopWidth: 2,
          borderTopColor: colors.duoGray,
          height: 70 + (insets.bottom > 0 ? insets.bottom : 0), 
          paddingBottom: (insets.bottom > 0 ? insets.bottom : 10),
        },
        tabBarActiveTintColor: colors.duoGreen,
        tabBarInactiveTintColor: '#AFAFAF',
        tabBarLabelStyle: {
          fontWeight: 'bold',
          fontSize: 12,
        }
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={DashboardScreen} 
        options={{ title: 'AcadAlert' }} 
      />
      <Tab.Screen 
        name="Log" 
        component={LogClassScreen} 
        options={{ title: 'Log Class' }} 
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <MyTabs />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

// --- GLOBAL STYLES ---
const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.duoBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: colors.duoBackground,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.duoTextDark,
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#AFAFAF',
    fontWeight: '600',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardGreen: {
    backgroundColor: colors.duoGreen,
    borderBottomWidth: 6,
    borderBottomColor: '#46A302',
  },
  cardGray: {
    backgroundColor: colors.duoBackground,
    borderWidth: 2,
    borderColor: colors.duoGray,
    borderBottomWidth: 6,
    borderBottomColor: colors.duoGray,
  },
  cardTitle: {
    color: colors.duoBackground,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  riskText: {
    color: colors.duoBackground,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
  },
  insightText: {
    color: colors.duoBackground,
    fontSize: 16,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  smallCard: {
    width: '48%',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
  },
  statLabel: {
    color: '#AFAFAF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  statValue: {
    color: colors.duoTextDark,
    fontSize: 24,
    fontWeight: '900',
  },
  subjectCard: {
    backgroundColor: colors.duoBackground,
    borderWidth: 2,
    borderColor: colors.duoGray,
    borderBottomWidth: 6,
    borderBottomColor: colors.duoGray,
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.duoTextDark,
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 2,
    borderColor: colors.duoGray,
    borderRadius: 10,
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.duoTextDark,
    width: 70,
    textAlign: 'center',
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#AFAFAF',
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: colors.duoBlue,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 6,
    borderBottomColor: colors.duoBlueShadow,
  },
  submitButtonText: {
    color: colors.duoBackground,
    fontSize: 18,
    fontWeight: '900',
  }
});