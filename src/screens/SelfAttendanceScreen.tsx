import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';

type SubjectKey = 'CGIP' | 'CD' | 'IEFT' | 'AAD' | 'ELEC';

const subjects: { id: SubjectKey; name: string }[] = [
  { id: 'CGIP', name: 'Computer Graphics' },
  { id: 'CD', name: 'Compiler Design' },
  { id: 'IEFT', name: 'Industrial Economics' },
  { id: 'AAD', name: 'Algorithm Analysis' },
  { id: 'ELEC', name: 'Elective' }
];

// CHANGED: Moved these constants OUTSIDE the component so they don't re-render unnecessarily
const backendURL = 'https://overcaptious-jacquline-impatiently.ngrok-free.dev/api';
const studentId = 'S04'; 

export default function SelfAttendanceScreen() {
  const [attendanceData, setAttendanceData] = useState<Record<SubjectKey, string>>({
    CGIP: '', CD: '', IEFT: '', AAD: '', ELEC: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${backendURL}/attendance/${studentId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
      }
    })
      // CHANGED: Bulletproof response handling
      .then(async res => {
        const textResponse = await res.text();
        
        // Check if ngrok sent an HTML error page instead of JSON
        if (textResponse.trim().startsWith('<')) {
          console.error("Ngrok Error: Received HTML instead of JSON. Your ngrok URL might have expired or the backend crashed.");
          throw new Error("Received HTML instead of JSON");
        }

        // If it's a 404, it just means no attendance data exists yet. Don't crash!
        if (res.status === 404) {
          return {}; 
        }

        if (!res.ok) throw new Error(`Network response was ${res.status}`);
        
        return JSON.parse(textResponse);
      })
      .then(data => {
        if (data && data.cgip_attended !== undefined) {
          setAttendanceData({
            CGIP: data.cgip_attended.toString(),
            CD: data.cd_attended.toString(),
            IEFT: data.ieft_attended.toString(),
            AAD: data.aad_attended.toString(),
            ELEC: data.elec_attended.toString()
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load previous data:", err.message);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (subjectId: SubjectKey, value: string) => {
    setAttendanceData(prev => ({ ...prev, [subjectId]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { 
        CGIP: attendanceData.CGIP,
        CD: attendanceData.CD,
        IEFT: attendanceData.IEFT,
        AAD: attendanceData.AAD,
        ELEC: attendanceData.ELEC,
        student_id: studentId 
      };
      
      const response = await fetch(`${backendURL}/sync-attendance`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify(payload), 
      });

      // CHANGED: Better error handling for the POST request
      const textResponse = await response.text();
      
      if (textResponse.trim().startsWith('<')) {
        throw new Error("Ngrok is offline or URL changed.");
      }

      if (!response.ok) {
        throw new Error(`Server rejected request: ${response.status}`);
      }

      Alert.alert("Data Synced", "Your attendance has been successfully updated on the server.");
    } catch (error: any) {
      console.error("Sync Error:", error.message);
      Alert.alert("Network Error", "Could not reach the server. Check your backend console.");
    }
  };

  if (loading) return <ActivityIndicator size="large" color="#0D6EFD" style={{flex: 1}} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Self Attendance</Text>
        <Text style={styles.subtitle}>Initialize your current semester attendance records.</Text>
      </View>

      <View style={styles.formContainer}>
        {subjects.map((sub) => (
          <View key={sub.id} style={styles.inputGroup}>
            <Text style={styles.label}>{sub.name}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
                value={attendanceData[sub.id]}
                onChangeText={(val) => handleInputChange(sub.id, val)}
              />
              <Text style={styles.suffix}>classes attended</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Sync Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 24, paddingBottom: 40 },
  header: { marginBottom: 32, marginTop: 10 },
  title: { fontSize: 28, fontWeight: '700', color: '#212529', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#6C757D', lineHeight: 22 },
  formContainer: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 32 },
  inputGroup: { marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#F1F3F5', paddingBottom: 15 },
  label: { fontSize: 16, fontWeight: '600', color: '#343A40', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center' },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 15, fontSize: 16, color: '#212529', width: 80, textAlign: 'center' },
  suffix: { marginLeft: 12, fontSize: 15, color: '#6C757D' },
  button: { backgroundColor: '#0D6EFD', borderRadius: 10, paddingVertical: 16, alignItems: 'center', shadowColor: '#0D6EFD', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 }
});