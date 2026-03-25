import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator
} from "react-native";
import { supabase } from "../utils/supabase"; // <-- Ensure this path points to the file we made earlier!

export default function LoginScreen({ navigation }: any) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false); // Added loading state

  // --- THE NEW AUTHENTICATION LOGIC ---
  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        // Create a new user in Supabase
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: { name: name, full_name: name, role: role },
          },
        });

        if (error) throw error;
        Alert.alert("Success!", "Account created. You can now sign in.");
        setIsSignup(false); // Switch back to login mode

      } else {
        // Log an existing user in
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });

        if (authError) throw authError;

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.session.user.id)
          .single();

        if (profile?.role === 'teacher') {
          navigation.replace("TeacherTabs");
        } else {
          navigation.replace("StudentTabs");
        }
      }
    } catch (error: any) {
      Alert.alert("Authentication Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2563EB" />

      <View style={styles.header}>
        <Text style={styles.appName}>AcadAlert</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>{isSignup ? "Create Account" : "Welcome Back"}</Text>

        {isSignup && (
          <>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} />

            <Text style={styles.label}>I am a...</Text>
            <View style={{ flexDirection: 'row', marginBottom: 15, gap: 10 }}>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'student' && styles.roleBtnActive]}
                onPress={() => setRole('student')}
              >
                <Text style={role === 'student' ? { color: 'white', fontWeight: 'bold' } : {}}>Student</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleBtn, role === 'teacher' && styles.roleBtnActive]}
                onPress={() => setRole('teacher')}
              >
                <Text style={role === 'teacher' ? { color: 'white', fontWeight: 'bold' } : {}}>Teacher</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={styles.label}>Email Address</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />

        <Text style={styles.label}>Password</Text>
        <TextInput secureTextEntry style={styles.input} value={password} onChangeText={setPassword} />

        {/* Action Button */}
        <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>{isSignup ? "Create Account" : "Sign In"}</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.switchContainer} onPress={() => setIsSignup(!isSignup)}>
          <Text style={styles.switchLink}>{isSignup ? "Switch to Sign In" : "Don't have an account? Sign Up"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ... keep all your existing styles exactly as they were ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { backgroundColor: "#2563EB", paddingVertical: 60, alignItems: "center" },
  appName: { color: "white", fontSize: 34, fontWeight: "bold" },
  card: { backgroundColor: "white", margin: 20, padding: 25, borderRadius: 22, marginTop: -35, elevation: 6 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontWeight: "600", marginBottom: 6, color: "#374151" },
  input: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 14, padding: 14, marginBottom: 15, backgroundColor: "#F9FAFB" },
  button: { backgroundColor: "#2563EB", padding: 16, borderRadius: 14, marginTop: 10 },
  buttonText: { color: "white", textAlign: "center", fontWeight: "bold", fontSize: 16 },
  switchContainer: { marginTop: 18, alignItems: 'center' },
  switchLink: { color: "#2563EB", fontWeight: "bold" },
  roleBtn: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 10, alignItems: 'center' },
  roleBtnActive: { backgroundColor: '#2563EB', borderColor: '#2563EB' },
});