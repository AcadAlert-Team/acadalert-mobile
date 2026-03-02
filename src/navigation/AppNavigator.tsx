import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from 'react-native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import DashboardScreen from "../screens/DashboardScreen";
import SelfAttendanceScreen from "../screens/SelfAttendanceScreen";
import AttendanceScreen from "../screens/AttendanceScreen"; // We are adding this back!
import TimetableScreen from "../screens/TimetableScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const insets = useSafeAreaInsets(); // Grabs your phone's bottom button height

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconText = '📄';
            if (route.name === 'Home') iconText = '🏠';
            else if (route.name === 'Analysis') iconText = '📊'; // New Icon
            else if (route.name === 'Log Classes') iconText = '📝';
            else if (route.name === 'Timetable') iconText = '📅';
            
            return <Text style={{ fontSize: 20, opacity: color === '#0D6EFD' ? 1 : 0.5 }}>{iconText}</Text>;
          },
          tabBarActiveTintColor: '#0D6EFD',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarStyle: { 
            // This dynamically pushes the bar up above the Android home buttons!
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
    </NavigationContainer>
  );
}