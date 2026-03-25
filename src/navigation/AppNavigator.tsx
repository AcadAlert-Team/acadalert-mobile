import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import all screens
import LoginScreen from "../screens/LoginScreen"; 
import DashboardScreen from "../screens/DashboardScreen";
import SelfAttendanceScreen from "../screens/SelfAttendanceScreen";
import AttendanceScreen from "../screens/AttendanceScreen"; 
import TimetableScreen from "../screens/TimetableScreen";
// 👇 IMPORT YOUR NEW TEACHER DASHBOARD HERE
import TeacherDashboardScreen from "../screens/TeacherDashboardScreen"; 

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Student Tabs (Untouched - Exactly as you wrote it!)
function StudentTabs() {
  const insets = useSafeAreaInsets(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconText = '📋';
          if (route.name === 'Home') iconText = '🏠';
          else if (route.name === 'Analysis') iconText = '📈'; 
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
      <Tab.Screen name="Log Classes" component={SelfAttendanceScreen} />
      <Tab.Screen name="Timetable" component={TimetableScreen} />
    </Tab.Navigator>
  );
}

// 2. Teacher Tabs (Replacing the placeholder!)
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
    </Tab.Navigator>
  );
}

// 3. The Main App Navigator Stack
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* App starts here at the Login Screen */}
        <Stack.Screen name="Login" component={LoginScreen} />
        
        <Stack.Screen name="StudentTabs" component={StudentTabs} />
        <Stack.Screen name="TeacherTabs" component={TeacherTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}