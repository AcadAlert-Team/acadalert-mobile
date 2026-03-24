import React, { useEffect } from "react";
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from "./src/navigation/AppNavigator";
import messaging from '@react-native-firebase/messaging';
import { supabase } from './src/utils/supabase';

export default function App() {

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const currentUser = session?.user;

        if (currentUser) {
          console.log('User detected! Setting up push notifications for:', currentUser.id);
          await setupPushNotifications(currentUser.id);
        }
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived in the foreground!', JSON.stringify(remoteMessage));

      const title = remoteMessage.notification?.title || 'AcadAlert Update';
      const body = remoteMessage.notification?.body || 'Check your dashboard for new information.';

      Alert.alert(title, body, [{ text: 'Got it!' }]);
    });

    return unsubscribe;
  }, []);

  async function setupPushNotifications(userId: string) {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token generated');

        await fetch('http://192.168.1.16:5001/api/notifications/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            fcmToken: token,
          }),
        });

        console.log('Token successfully paired with user in database!');
      } catch (error) {
        console.error('Failed to register FCM token:', error);
      }
    }
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}