import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack"; // <-- NEW!
import { Text } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import all screens
import LoginScreen from "../screens/LoginScreen"; // <-- Make sure to import Login!
import DashboardScreen from "../screens/DashboardScreen";
import SelfAttendanceScreen from "../screens/SelfAttendanceScreen";
import AttendanceScreen from "../screens/AttendanceScreen"; 
import TimetableScreen from "../screens/TimetableScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); // <-- Create the Stack

// 1. We put your exact Tab Navigator into its own component
function StudentTabs() {
  const insets = useSafeAreaInsets(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
          let iconText = '📄';
          if (route.name === 'Home') iconText = '🏠';
          else if (route.name === 'Analysis') iconText = '📊'; 
          else if (route.name === 'Log Classes') iconText = '📝';
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

function TeacherTabs() {
  return <Text>Teacher UI goes here</Text>;
}

// 2. The Main App Navigator is now a Stack that holds Login AND the Tabs
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