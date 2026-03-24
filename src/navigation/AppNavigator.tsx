import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardScreen from "../screens/DashboardScreen";
import SelfAttendanceScreen from "../screens/SelfAttendanceScreen";
import AttendanceScreen from "../screens/AttendanceScreen"; 
import TimetableScreen from "../screens/TimetableScreen";
import AssignmentsScreen from "../screens/AssignmentsScreen"; 
// 1. Import the new Marks Screen
import MarksScreen from "../screens/MarksScreen"; 

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const insets = useSafeAreaInsets(); 

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconText = '❓'; 
            if (route.name === 'Home') iconText = '🏠';
            else if (route.name === 'Analysis') iconText = '📊'; 
            else if (route.name === 'Log Classes') iconText = '📝';
            else if (route.name === 'Timetable') iconText = '📅';
            else if (route.name === 'Assignments') iconText = '📚'; 
            // 2. Add an icon for the Marks tab
            else if (route.name === 'Marks') iconText = '📈'; 
            
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
        <Tab.Screen name="Assignments" component={AssignmentsScreen} />
        {/* 3. Add the Marks Screen to the tab list */}
        <Tab.Screen name="Marks" component={MarksScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}