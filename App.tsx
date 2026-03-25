import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import messaging from '@react-native-firebase/messaging';
import { supabase } from './src/utils/supabase';
import { LogBox } from 'react-native';
import { API_BASE_URL } from './src/utils/api';

// This hides the Firebase yellow warnings
LogBox.ignoreLogs(['This method is deprecated (as well as all React Native Firebase']);

export default function App() {

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        const currentUser = session?.user;

        if (currentUser) {
          console.log('User detected! Setting up push notifications for:', currentUser.id);
          setupPushNotifications(currentUser.id);
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

        await supabase
          .from('students')
          .update({ fcm_token: token })
          .eq('id', userId);

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