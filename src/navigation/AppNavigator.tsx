import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ==========================================
// 📥 IMPORT ALL SCREENS
// ==========================================
import LoginScreen from "../screens/LoginScreen"; 

// Student Screens
import DashboardScreen from "../screens/DashboardScreen";
import AttendanceScreen from "../screens/AttendanceScreen"; 
import AssignmentsScreen from "../screens/AssignmentsScreen"; // 👈 New Student Assignments
import SelfAttendanceScreen from "../screens/SelfAttendanceScreen";

// Teacher Screens
import TeacherDashboardScreen from "../screens/TeacherDashboardScreen"; 
import TeacherAssignmentsScreen from "../screens/TeacherAssignmentsScreen";

// Shared Screens
import TimetableScreen from "../screens/TimetableScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// ==========================================
// 🎓 STUDENT TABS NAVIGATOR
// ==========================================
function StudentTabs() {
  const insets = useSafeAreaInsets(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconText = '📋';
          if (route.name === 'Home') iconText = '🏠';
          else if (route.name === 'Analysis') iconText = '📈'; 
          else if (route.name === 'Assignments') iconText = '📝'; // 👈 Icon for new tab
          else if (route.name === 'Log Classes') iconText = '✍️';
          else if (route.name === 'Timetable') iconText = '📅';
          
          return <Text style={{ fontSize: 20, opacity: color === '#0D6EFD' ? 1 : 0.5 }}>{iconText}</Text>;
        },
        tabBarActiveTintColor: '#0D6EFD',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { 
          height: 65 + (insets.bottom > 0 ? insets.bottom : 0), 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10, 
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#EAEAEA'
        }
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Analysis" component={AttendanceScreen} /> 
      <Tab.Screen name="Assignments" component={AssignmentsScreen} />
      <Tab.Screen name="Log Classes" component={SelfAttendanceScreen} />
      <Tab.Screen name="Timetable" component={TimetableScreen} />
    </Tab.Navigator>
  );
}

// ==========================================
// 👨‍🏫 TEACHER TABS NAVIGATOR
// ==========================================
function TeacherTabs() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#0D6EFD',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: { 
          height: 65 + (insets.bottom > 0 ? insets.bottom : 0), 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10, 
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#EAEAEA'
        }
      }}
    >
      <Tab.Screen 
        name="Faculty Portal" 
        component={TeacherDashboardScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, opacity: color === '#0D6EFD' ? 1 : 0.5 }}>👨‍🏫</Text>
          )
        }}
      />
      <Tab.Screen 
        name="Assignments" 
        component={TeacherAssignmentsScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, opacity: color === '#0D6EFD' ? 1 : 0.5 }}>📝</Text>
          )
        }}
      />
      <Tab.Screen 
        name="Timetable" 
        component={TimetableScreen} 
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 20, opacity: color === '#0D6EFD' ? 1 : 0.5 }}>📅</Text>
          )
        }}
      />
    </Tab.Navigator>
  );
}

// ==========================================
// 🚀 MAIN APP NAVIGATOR (STACK)
// ==========================================
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* The app boots up to the Login Screen */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        {/* Once logged in, it routes to one of these based on role */}
        <Stack.Screen name="StudentTabs" component={StudentTabs} />
        <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}