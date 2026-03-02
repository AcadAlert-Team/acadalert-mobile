import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";

export default function LoginScreen({ navigation }: any) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2563EB" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>AcadAlert</Text>
        <Text style={styles.tagline}>
          Smart academic monitoring for students
        </Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.title}>
          {isSignup ? "Create Account" : "Welcome Back"}
        </Text>
        <Text style={styles.subtitle}>
          {isSignup
            ? "Sign up to start tracking your academics"
            : "Sign in to access your dashboard"}
        </Text>

        {/* Name (Signup only) */}
        {isSignup && (
          <>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              placeholder="e.g. Muhammed Safvan"
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
          </>
        )}

        {/* Email */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          placeholder="e.g. student@college.edu"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <TextInput
          placeholder="Minimum 6 characters"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {/* Action Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace("Dashboard")}
        >
          <Text style={styles.buttonText}>
            {isSignup ? "Create Account" : "Sign In"}
          </Text>
        </TouchableOpacity>

        {/* Switch Auth */}
        <TouchableOpacity
          style={styles.switchContainer}
          onPress={() => setIsSignup(!isSignup)}
        >
          <Text style={styles.switchText}>
            {isSignup
              ? "Already have an account? "
              : "Don't have an account? "}
          </Text>
          <Text style={styles.switchLink}>
            {isSignup ? "Sign In" : "Sign Up"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          🔒 Your academic data is safe and private
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },

  header: {
    backgroundColor: "#2563EB",
    paddingVertical: 60,
    alignItems: "center",
  },
  appName: {
    color: "white",
    fontSize: 34,
    fontWeight: "bold",
  },
  tagline: {
    color: "#DBEAFE",
    marginTop: 8,
    fontSize: 14,
  },

  card: {
    backgroundColor: "white",
    margin: 20,
    padding: 25,
    borderRadius: 22,
    marginTop: -35,
    elevation: 6,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    color: "#6B7280",
    marginBottom: 20,
  },

  label: {
    fontWeight: "600",
    marginBottom: 6,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 15,
    backgroundColor: "#F9FAFB",
  },

  button: {
    backgroundColor: "#2563EB",
    padding: 16,
    borderRadius: 14,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },
  switchText: {
    color: "#6B7280",
  },
  switchLink: {
    color: "#2563EB",
    fontWeight: "bold",
  },

  footerText: {
    textAlign: "center",
    marginTop: 15,
    color: "#6B7280",
    fontSize: 12,
  },
});
