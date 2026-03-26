import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../utils/supabase';
// 1. We define exactly what the valid subject IDs are
type SubjectKey = 'CGIP' | 'CD' | 'IEFT' | 'AAD' | 'ELEC';

// 2. We tell TypeScript the exact shape of our subjects array
const subjects: { id: SubjectKey; name: string }[] = [
  { id: 'CGIP', name: 'Computer Graphics' },
  { id: 'CD', name: 'Compiler Design' },
  { id: 'IEFT', name: 'Industrial Economics' },
  { id: 'AAD', name: 'Algorithm Analysis' },
  { id: 'ELEC', name: 'Elective' },
];

export default function SelfAttendanceScreen() {
  const [attendanceData, setAttendanceData] = useState<
    Record<SubjectKey, string>
  >({
    CGIP: '',
    CD: '',
    IEFT: '',
    AAD: '',
    ELEC: '',
  });
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);

  const backendURL = 'https://carly-homozygous-federico.ngrok-free.dev/api';
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setStudentId(user.id);
      } else {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // NEW: Fetch previous data when the screen opens
  useEffect(() => {
    if (!studentId) return;

    fetch(`${backendURL}/attendance/${studentId}`, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json',
      },
    })
      .then(async res => {
        // 1. Grab the raw text response first to see what the server is saying!
        const rawText = await res.text();
        console.log('🚨 THE SECRET SERVER MESSAGE:', rawText);

        // 2. Try to parse it normally
        return JSON.parse(rawText);
      })
      .then(data => {
        if (data.cgip_attended !== undefined) {
          setAttendanceData({
            CGIP: data.cgip_attended.toString(),
            CD: data.cd_attended.toString(),
            IEFT: data.ieft_attended.toString(),
            AAD: data.aad_attended.toString(),
            ELEC: data.elec_attended.toString(),
          });
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load previous data', err);
        setLoading(false);
      });
  }, [studentId]);

  const handleInputChange = (subjectId: SubjectKey, value: string) => {
    setAttendanceData(prev => ({ ...prev, [subjectId]: value }));
  };

  const handleSubmit = async () => {
    if (!studentId) {
      Alert.alert('Not Signed In', 'Please sign in before syncing attendance.');
      return;
    }

    try {
      // 1. Force the studentId into the data package!
      const payload = {
        CGIP: attendanceData.CGIP,
        CD: attendanceData.CD,
        IEFT: attendanceData.IEFT,
        AAD: attendanceData.AAD,
        ELEC: attendanceData.ELEC,
        student_id: studentId, // This is what Express is looking for!
      };

      const response = await fetch(`${backendURL}/sync-attendance`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // 2. Send the combined package
      });

      const data = await response.json();
      Alert.alert(
        'Data Synced',
        'Your attendance has been successfully updated on the server.',
      );
    } catch (error) {
      Alert.alert('Network Error', 'Could not reach the server.');
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#0D6EFD" style={{ flex: 1 }} />
    );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Self Attendance</Text>
        <Text style={styles.subtitle}>
          Initialize your current semester attendance records.
        </Text>
      </View>

      <View style={styles.formContainer}>
        {subjects.map(sub => (
          <View key={sub.id} style={styles.inputGroup}>
            <Text style={styles.label}>{sub.name}</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor="#999"
                value={attendanceData[sub.id]}
                onChangeText={val => handleInputChange(sub.id, val)}
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
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6C757D',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F5',
    paddingBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343A40',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DEE2E6',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#212529',
    width: 80,
    textAlign: 'center',
  },
  suffix: {
    marginLeft: 12,
    fontSize: 15,
    color: '#6C757D',
  },
  button: {
    backgroundColor: '#0D6EFD',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#0D6EFD',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
