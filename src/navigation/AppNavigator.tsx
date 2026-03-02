import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import SelfAttendanceScreen from "../screens/SelfAttendanceScreen";
import TimetableScreen from "../screens/TimetableScreen";
import AssignmentsScreen from "../screens/AssignmentsScreen";
import StudyLogScreen from "../screens/StudyLogScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="SelfAttendance" component={SelfAttendanceScreen} />
        <Stack.Screen name="Timetable" component={TimetableScreen} />
        <Stack.Screen name="Assignments" component={AssignmentsScreen} />
        <Stack.Screen name="StudyLog" component={StudyLogScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
