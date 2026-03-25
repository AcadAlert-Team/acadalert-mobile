import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView
} from 'react-native';
// 🚀 NEW: Import navigation and Supabase for the logout function!
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabase';

type SubjectKey = 'CGIP' | 'CD' | 'IEFT' | 'AAD' | 'ELEC';

const subjects: { id: SubjectKey; name: string }[] = [
  { id: 'CGIP', name: 'Computer Graphics' },
  { id: 'CD', name: 'Compiler Design' },
  { id: 'IEFT', name: 'Industrial Economics' },
  { id: 'AAD', name: 'Algorithm Analysis' },
  { id: 'ELEC', name: 'Elective' }
];

export default function TeacherDashboardScreen() {
  // 🚀 NEW: Grab the navigation object
  const navigation = useNavigation<any>();
  
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal States
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<Record<SubjectKey, string>>({
    CGIP: '', CD: '', IEFT: '', AAD: '', ELEC: ''
  });
  const [modalLoading, setModalLoading] = useState(false);

  const backendURL = `http://192.168.1.12:5001/api`;

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    fetch(`${backendURL}/faculty/students`)
      .then(async (res) => {
        const rawText = await res.text();
        try {
          return JSON.parse(rawText);
        } catch (e) {
          console.error("🚨 TEACHER DASHBOARD SECRET MESSAGE:", rawText);
          throw new Error("Server sent text instead of JSON");
        }
      })
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch students:", err);
        setLoading(false);
      });
  };

  const getRiskColor = (risk: string) => {
    if (!risk) return '#ADB5BD';
    switch (risk.toLowerCase()) {
      case 'low': return '#40C057';
      case 'medium': return '#FD7E14';
      case 'high': return '#FA5252';
      default: return '#ADB5BD';
    }
  };

  const openStudentEditor = (student: any) => {
    setEditingStudent(student);
    setModalLoading(true);
    
    setAttendanceData({ CGIP: '', CD: '', IEFT: '', AAD: '', ELEC: '' });

    fetch(`${backendURL}/subject-analysis/${student.id}`)
      .then(async (res) => {
        const rawText = await res.text();
        try {
          return JSON.parse(rawText);
        } catch (e) {
          console.error(`🚨 STUDENT ${student.id} SECRET MESSAGE:`, rawText);
          throw new Error("Server sent text instead of JSON");
        }
      })
      .then(data => {
        if (data && data.length > 0) {
          setAttendanceData({
            CGIP: data.find((d: any) => d.id === '1')?.attended.toString() || '0',
            CD: data.find((d: any) => d.id === '2')?.attended.toString() || '0',
            IEFT: data.find((d: any) => d.id === '3')?.attended.toString() || '0',
            AAD: data.find((d: any) => d.id === '4')?.attended.toString() || '0',
            ELEC: data.find((d: any) => d.id === '5')?.attended.toString() || '0'
          });
        }
        setModalLoading(false);
      })
      .catch(err => {
        console.error("Failed to load previous data", err);
        setModalLoading(false);
      });
  };

  const handleInputChange = (subjectId: SubjectKey, value: string) => {
    setAttendanceData(prev => ({ ...prev, [subjectId]: value }));
  };

  const handleSubmit = async () => {
    if (!editingStudent) return;

    try {
      const payload = { 
        CGIP: attendanceData.CGIP || '0',
        CD: attendanceData.CD || '0',
        IEFT: attendanceData.IEFT || '0',
        AAD: attendanceData.AAD || '0',
        ELEC: attendanceData.ELEC || '0',
        student_id: editingStudent.id 
      };
      
      const response = await fetch(`${backendURL}/sync-attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        Alert.alert("Success", `${editingStudent.name}'s attendance has been updated.`);
        setEditingStudent(null);
        fetchStudents(); 
      } else {
        Alert.alert("Error", "Failed to sync attendance.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not reach the server.");
    }
  };

  const renderStudentCard = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => openStudentEditor(item)}>
      <View style={styles.cardLeft}>
        <View style={[styles.statusIndicator, { backgroundColor: getRiskColor(item.risk) }]} />
        <View>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.studentId}>ID: {item.id}</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        <Text style={styles.attendanceText}>{item.attendance}%</Text>
        <Text style={[styles.riskBadge, { color: getRiskColor(item.risk) }]}>
          {item.risk} Risk
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 🚀 NEW: The Exact Same Logout Button from the Student Dashboard */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          try {
            await supabase.auth.signOut();
            navigation.replace('Login');
          } catch (error) {
            console.error('Logout failed', error);
          }
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Header Section */}
      <View style={styles.topBackground}>
        <Text style={styles.greeting}>Faculty Portal</Text>
        <Text style={styles.name}>Class Overview</Text>
      </View>

      {/* Main Student List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Tap a student to edit records</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0D6EFD" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={students}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderStudentCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>

      {/* ====== INDIVIDUAL STUDENT ATTENDANCE MODAL ====== */}
      <Modal visible={editingStudent !== null} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Update Records</Text>
              <Text style={styles.modalSubtitle}>{editingStudent?.name} ({editingStudent?.id})</Text>
            </View>
            <TouchableOpacity onPress={() => setEditingStudent(null)}>
              <Text style={styles.closeButton}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {modalLoading ? (
             <ActivityIndicator size="large" color="#0D6EFD" style={{ marginTop: 40 }} />
          ) : (
            <ScrollView style={styles.modalContent}>
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
          )}
        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Dashboard Styles
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  topBackground: {
    backgroundColor: '#0D6EFD',
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  greeting: { fontSize: 18, color: '#E9ECEF', opacity: 0.9 },
  name: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginTop: 4 },
  listContainer: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#6C757D', marginBottom: 15, textTransform: 'uppercase' },
  card: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
  studentName: { fontSize: 16, fontWeight: '700', color: '#343A40' },
  studentId: { fontSize: 13, color: '#868E96', marginTop: 2, fontWeight: '600' },
  cardRight: { alignItems: 'flex-end' },
  attendanceText: { fontSize: 18, fontWeight: '800', color: '#212529' },
  riskBadge: { fontSize: 12, fontWeight: '700', marginTop: 2, textTransform: 'uppercase' },
  
  // 🚀 NEW: Styles for the Logout Button
  logoutButton: { position: 'absolute', top: 40, right: 20, backgroundColor: '#FEF2F2', borderWidth: 1.5, borderColor: '#EF4444', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6, justifyContent: 'center', alignItems: 'center', zIndex: 100 },
  logoutText: { color: '#EF4444', fontSize: 12, fontWeight: 'bold' },

  // Modal / Form Styles
  modalContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  modalHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EAEAEA',
    backgroundColor: '#FFFFFF'
  },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#212529' },
  modalSubtitle: { fontSize: 15, color: '#6C757D', marginTop: 4 },
  closeButton: { fontSize: 16, color: '#0D6EFD', fontWeight: '600' },
  modalContent: { padding: 24, paddingBottom: 40 },
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
  label: { fontSize: 16, fontWeight: '600', color: '#343A40', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center' },
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
  suffix: { marginLeft: 12, fontSize: 15, color: '#6C757D' },
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
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', letterSpacing: 0.5 }
});