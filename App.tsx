import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
// 1. Import SafeAreaProvider AND the insets hook
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

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

const AttendanceScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.dummyText}>Team: Build Attendance Form Here!</Text>
  </View>
);

// --- NAVIGATION SETUP ---
const Tab = createBottomTabNavigator();

// 2. Create a separate component just for the Navigator so we can use hooks
const MyTabs = () => {
  // 3. Call the hook here, inside a component that is a child of SafeAreaProvider
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.duoGreen,
          height: 100, // Chunky, friendly header
          borderBottomWidth: 4,
          borderBottomColor: '#46A302', // 3D shadow effect
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 24,
          textTransform: 'uppercase', // Very Duolingo
        },
        tabBarStyle: {
          backgroundColor: colors.duoBackground,
          borderTopWidth: 2,
          borderTopColor: colors.duoGray,
          // 4. Use the insets dynamically here to push the tabs up!
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
        component={AttendanceScreen} 
        options={{ title: 'Log Class' }} 
      />
    </Tab.Navigator>
  );
}

// --- DUOLINGO COLOR PALETTE ---
const colors = {
  duoGreen: '#58CC02',
  duoBackground: '#FFFFFF',
  duoGray: '#E5E5E5',
  duoTextDark: '#4B4B4B',
};

// 5. Wrap everything in SafeAreaProvider in your main App export
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
  // Removed the unused navContainer style
  screenContainer: {
    flex: 1,
    backgroundColor: colors.duoBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dummyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.duoTextDark,
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
    backgroundColor: '#58CC02',
    borderBottomWidth: 6, // The Duolingo chunky shadow
    borderBottomColor: '#46A302',
  },
  cardGray: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderBottomWidth: 6,
    borderBottomColor: '#E5E5E5',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  riskText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 10,
  },
  insightText: {
    color: '#FFFFFF',
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
    color: '#4B4B4B',
    fontSize: 24,
    fontWeight: '900',
  }
});