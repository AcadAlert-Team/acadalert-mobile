import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { API_BASE_URL } from '../utils/api';
import { supabase } from '../utils/supabase';

type SubjectKey = 'CGIP' | 'CD' | 'IEFT' | 'AAD' | 'ELEC';

const subjects: { id: SubjectKey; name: string }[] = [
  { id: 'CGIP', name: 'Computer Graphics' },
  { id: 'CD', name: 'Compiler Design' },
  { id: 'IEFT', name: 'Industrial Economics' },
  { id: 'AAD', name: 'Algorithm Analysis' },
  { id: 'ELEC', name: 'Elective' }
];

export default function TeacherAssignmentsScreen() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal Visibility States
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);

  // Grading Modal States
  const [gradingStudent, setGradingStudent] = useState<any>(null);
  const [markInput, setMarkInput] = useState('');

  // Create Assignment Form States
  const [subject, setSubject] = useState<SubjectKey | ''>('');
  const [description, setDescription] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Calendar States
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const backendURL = API_BASE_URL;

  useEffect(() => {
    fetchStudents();
    fetchAssignments();
  }, []);

  const fetchStudents = () => {
    fetch(`${backendURL}/faculty/students`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch students:", err);
        setLoading(false);
      });
  };

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('due_date', { ascending: false });

      if (error) throw error;

      if (data) {
        const liveAssignments = data.map((item, index) => ({
          id: item.assignment_id ? item.assignment_id.toString() : `fallback-${index}`,
          subject: item.subject || 'Assignment',
          description: item.description || 'No description provided.',
          dueDate: item.due_date || 'No Date',
          submissions: item.submissions || {},
        }));

        setAssignments(liveAssignments);
      }
    } catch (err) {
      console.error("Error fetching live assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleCreateAssignment = async () => {
    if (!subject || !description) {
      Alert.alert("Missing Fields", "Please fill out all fields.");
      return;
    }

    const formattedDate = dueDate.toISOString().split('T')[0];
    const subjectName = subjects.find(s => s.id === subject)?.name;

    const newAssignment = {
      id: `temp-${Date.now()}`,
      assignment_id: `temp-${Date.now()}`,
      subject: subjectName,
      description,
      dueDate: formattedDate,
      submissions: {}
    };

    setAssignments([newAssignment, ...assignments]);

    const { error } = await supabase
      .from('assignments')
      .insert([
        {
          subject: subjectName,
          description: description,
          due_date: formattedDate,
        },
      ]);

    if (error) {
      console.error("Failed to save assignment:", error);
      Alert.alert("Database Error", error.message || JSON.stringify(error));
      return;
    }
    
    setSubject('');
    setDescription('');
    setDueDate(new Date());
    setCreateModalVisible(false);
    Alert.alert("Success", "Assignment Published to all students!");
  };

  // --- OPEN GRADING POPUP ---
  const openGradingModal = (student: any) => {
    setGradingStudent(student);
    // If they already have a mark, pre-fill the input
    const existingMark = selectedAssignment.submissions[student.id];
    setMarkInput(existingMark !== undefined ? String(existingMark) : '');
  };

  // --- SAVE MARK LOGIC ---
  const saveMark = async () => {
    const updatedSubmissions = { ...selectedAssignment.submissions };
    let isGraded = false;

    if (markInput.trim() === '') {
      delete updatedSubmissions[gradingStudent.id];
    } else {
      const mark = parseFloat(markInput);
      if (isNaN(mark) || mark < 0 || mark > 7.5) {
        Alert.alert("Invalid Mark", "Please enter a valid number between 0 and 7.5");
        return;
      }
      updatedSubmissions[gradingStudent.id] = mark;
      isGraded = true;
    }

    const updatedAssignment = { ...selectedAssignment, submissions: updatedSubmissions };
    setSelectedAssignment(updatedAssignment);
    setAssignments(assignments.map(a => a.id === updatedAssignment.id ? updatedAssignment : a));

    const assignmentTitle = `${selectedAssignment.subject} - ${selectedAssignment.description}`;

    const { error } = await supabase
      .from('pending_assignments')
      .update({ is_completed: isGraded })
      .eq('user_id', gradingStudent.id)
      .eq('title', assignmentTitle);

    if (error) {
      console.error("Failed to update student database:", error);
      Alert.alert("Database Error", "Could not sync grade to student's dashboard.");
    } else {
      console.log(`✅ Successfully marked assignment as completed for student!`);
    }

    setGradingStudent(null);
    setMarkInput('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBackground}>
        <Text style={styles.greeting}>Manage Classwork</Text>
        <Text style={styles.name}>Assignments</Text>
      </View>

      <View style={styles.listContainer}>
        <TouchableOpacity style={styles.createButton} onPress={() => setCreateModalVisible(true)}>
          <Text style={styles.createButtonText}>+ Create New Assignment</Text>
        </TouchableOpacity>

        {assignments.length === 0 ? (
          <Text style={styles.emptyText}>No assignments created yet.</Text>
        ) : (
          <FlatList
            data={assignments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => setSelectedAssignment(item)}>
                <Text style={styles.cardSubject}>{item.subject}</Text>
                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={styles.cardDate}>📅 Due: {item.dueDate}</Text>
                  {/* 👈 Calculate how many students are graded using Object.keys */}
                  <Text style={styles.cardCount}>{Object.keys(item.submissions).length} / {students.length} Graded</Text>
                </View>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* CREATE ASSIGNMENT MODAL */}
      <Modal visible={isCreateModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>New Assignment</Text>
            <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.label}>Select Subject</Text>
            <TouchableOpacity style={styles.dropdownToggle} onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
              <Text style={subject ? styles.inputText : styles.placeholderText}>
                {subject ? subjects.find(s => s.id === subject)?.name : "Choose a subject..."}
              </Text>
              <Text style={styles.inputText}>▼</Text>
            </TouchableOpacity>

            {isDropdownOpen && (
              <View style={styles.dropdownMenu}>
                {subjects.map(sub => (
                  <TouchableOpacity 
                    key={sub.id} 
                    style={styles.dropdownItem}
                    onPress={() => { setSubject(sub.id); setIsDropdownOpen(false); }}
                  >
                    <Text style={styles.inputText}>{sub.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter assignment details..."
              placeholderTextColor="#ADB5BD"
              multiline
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.inputText}>{dueDate.toDateString()}</Text>
              <Text style={styles.inputText}>📅</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            
            {Platform.OS === 'ios' && showDatePicker && (
               <TouchableOpacity 
                 style={{ alignSelf: 'flex-end', padding: 10, marginBottom: 10 }}
                 onPress={() => setShowDatePicker(false)}
               >
                 <Text style={{ color: '#0D6EFD', fontWeight: 'bold' }}>Done</Text>
               </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.submitBtn} onPress={handleCreateAssignment}>
              <Text style={styles.submitBtnText}>Publish Assignment</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* VIEW SUBMISSIONS MODAL */}
      <Modal visible={selectedAssignment !== null} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle}>{selectedAssignment?.subject}</Text>
              <Text style={styles.modalSubtitle}>Due: {selectedAssignment?.dueDate}</Text>
            </View>
            <TouchableOpacity onPress={() => setSelectedAssignment(null)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.descBox}>
            <Text style={styles.descText}>{selectedAssignment?.description}</Text>
          </View>

          <View style={styles.studentListHeader}>
            <Text style={styles.label}>Student Submissions</Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#0D6EFD" />
          ) : (
            <FlatList
              data={students}
              keyExtractor={item => item.id.toString()}
              contentContainerStyle={{ padding: 20 }}
              renderItem={({ item }) => {
                // 👈 Check if student has a mark in the dictionary
                const studentMark = selectedAssignment?.submissions[item.id];
                const isGraded = studentMark !== undefined;

                return (
                  <View style={styles.studentRow}>
                    <View>
                      <Text style={styles.studentName}>{item.name}</Text>
                      <Text style={styles.studentId}>ID: {item.id}</Text>
                      {/* 👈 Display the score if they are graded */}
                      {isGraded && (
                        <Text style={styles.scoreDisplay}>Score: {studentMark} / 7.5</Text>
                      )}
                    </View>
                    <TouchableOpacity 
                      style={[styles.markBtn, isGraded ? styles.markBtnActive : null]}
                      onPress={() => openGradingModal(item)}
                    >
                      <Text style={[styles.markBtnText, isGraded ? styles.markBtnTextActive : null]}>
                        {isGraded ? 'Edit Mark' : 'Mark'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          )}

          {/* 👈 NEW GRADING POPUP (Nested Overlay) */}
          {gradingStudent && (
            <View style={styles.overlay}>
              <View style={styles.popup}>
                <Text style={styles.popupTitle}>Grade {gradingStudent.name}</Text>
                <Text style={styles.popupSubtitle}>Enter a score out of 7.5</Text>
                
                <TextInput
                  style={styles.scoreInput}
                  keyboardType="decimal-pad"
                  placeholder="0.0"
                  placeholderTextColor="#ADB5BD"
                  value={markInput}
                  onChangeText={setMarkInput}
                  autoFocus
                />

                <View style={styles.popupActions}>
                  <TouchableOpacity style={styles.cancelBtn} onPress={() => setGradingStudent(null)}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.saveBtn} onPress={saveMark}>
                    <Text style={styles.saveBtnText}>Save Mark</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

        </SafeAreaView>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  topBackground: { backgroundColor: '#0D6EFD', padding: 24, paddingTop: 40, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  greeting: { fontSize: 18, color: '#E9ECEF', opacity: 0.9 },
  name: { fontSize: 32, fontWeight: '900', color: '#FFFFFF', marginTop: 4 },
  listContainer: { flex: 1, paddingHorizontal: 20, marginTop: 20 },
  
  createButton: { backgroundColor: '#212529', padding: 16, borderRadius: 14, alignItems: 'center', marginBottom: 20 },
  createButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  emptyText: { textAlign: 'center', color: '#6C757D', marginTop: 40, fontSize: 16 },
  
  card: { backgroundColor: '#FFF', padding: 18, borderRadius: 16, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  cardSubject: { fontSize: 18, fontWeight: 'bold', color: '#212529' },
  cardDesc: { color: '#6C757D', marginTop: 6, fontSize: 14, lineHeight: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F3F5' },
  cardDate: { color: '#FA5252', fontWeight: '600', fontSize: 13 },
  cardCount: { color: '#0D6EFD', fontWeight: 'bold', fontSize: 13 },

  modalContainer: { flex: 1, backgroundColor: '#F8F9FA' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: '#EAEAEA' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#212529' },
  modalSubtitle: { fontSize: 14, color: '#6C757D', marginTop: 4 },
  closeText: { fontSize: 16, color: '#0D6EFD', fontWeight: 'bold' },
  modalContent: { padding: 20 },
  
  label: { fontSize: 16, fontWeight: 'bold', color: '#343A40', marginBottom: 8, marginTop: 10 },
  input: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 10, padding: 14, fontSize: 16, marginBottom: 15, color: '#212529' },
  textArea: { height: 100, textAlignVertical: 'top' },
  
  dropdownToggle: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 10, padding: 14, marginBottom: 5 },
  dropdownMenu: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 10, marginBottom: 15, elevation: 3 },
  dropdownItem: { padding: 14, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
  
  datePickerButton: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#FFF', borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 10, padding: 14, marginBottom: 15 },
  
  placeholderText: { color: '#ADB5BD', fontSize: 16 },
  inputText: { color: '#212529', fontSize: 16 },
  
  submitBtn: { backgroundColor: '#0D6EFD', padding: 16, borderRadius: 14, alignItems: 'center', marginTop: 10, marginBottom: 40 },
  submitBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },

  descBox: { backgroundColor: '#FFF', padding: 20, borderBottomWidth: 1, borderColor: '#EAEAEA' },
  descText: { fontSize: 15, color: '#495057', lineHeight: 22 },
  studentListHeader: { padding: 20, paddingBottom: 0 },
  
  studentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 10, elevation: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: '#212529' },
  studentId: { fontSize: 13, color: '#868E96', marginTop: 2 },
  scoreDisplay: { fontSize: 14, fontWeight: 'bold', color: '#0D6EFD', marginTop: 4 },
  
  markBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#F1F3F5', borderWidth: 1, borderColor: '#DEE2E6' },
  markBtnActive: { backgroundColor: '#EBFBEE', borderColor: '#40C057' },
  markBtnText: { fontSize: 14, fontWeight: 'bold', color: '#495057' },
  markBtnTextActive: { color: '#40C057' },

  // Grading Popup Styles
  overlay: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  popup: { width: '80%', backgroundColor: '#FFF', padding: 24, borderRadius: 16, elevation: 10 },
  popupTitle: { fontSize: 20, fontWeight: 'bold', color: '#212529', textAlign: 'center' },
  popupSubtitle: { fontSize: 14, color: '#6C757D', textAlign: 'center', marginTop: 4, marginBottom: 20 },
  scoreInput: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 10, padding: 16, fontSize: 24, textAlign: 'center', fontWeight: 'bold', color: '#212529', marginBottom: 20 },
  popupActions: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#F1F3F5', marginRight: 10, alignItems: 'center' },
  cancelBtnText: { color: '#495057', fontWeight: 'bold', fontSize: 16 },
  saveBtn: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: '#0D6EFD', marginLeft: 10, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});