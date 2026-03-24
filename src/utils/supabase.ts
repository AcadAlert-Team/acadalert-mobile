import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fbbiznahthcjrjlvwfud.supabase.co'; // Get this from Supabase Dashboard
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYml6bmFodGhjanJqbHZ3ZnVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyODk4NTAsImV4cCI6MjA4Nzg2NTg1MH0.NAyRqtP9GTXlSfHNgyWSUTwvQ-TtJdzv_pkWq9dopks'; // Get this from Supabase Dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});