import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardScreen from "../screens/DashboardScreen";
import SelfAttendanceScreen from "../screens/SelfAttendanceScreen";
import AttendanceScreen from "../screens/AttendanceScreen"; 
import TimetableScreen from "../screens/TimetableScreen";
// 1. Added the import for the new Teacher Dashboard
import TeacherDashboardScreen from "../screens/TeacherDashboardScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const insets = useSafeAreaInsets(); 

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Faculty" // 2. Forces the app to open the Faculty tab first
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconText = '📄';
            if (route.name === 'Home') iconText = '🏠';
            else if (route.name === 'Analysis') iconText = '📊'; 
            else if (route.name === 'Log Classes') iconText = '📝';
            else if (route.name === 'Timetable') iconText = '📅';
            else if (route.name === 'Faculty') iconText = '👨‍🏫'; // 3. Added an icon for the new tab
            
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
        {/* 4. Added the Faculty tab right here. All your other code remains untouched! */}
        <Tab.Screen name="Faculty" component={TeacherDashboardScreen} />
        
        <Tab.Screen name="Home" component={DashboardScreen} />
        <Tab.Screen name="Analysis" component={AttendanceScreen} /> 
        <Tab.Screen name="Log Classes" component={SelfAttendanceScreen} />
        <Tab.Screen name="Timetable" component={TimetableScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}