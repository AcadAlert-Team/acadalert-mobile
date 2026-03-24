import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  FlatList, Modal, SafeAreaView, Platform, Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Define the subjects based on your college config
const SUBJECTS = ['CGIP', 'CD', 'IEFT', 'AAD', 'ELEC', 'NETWORKING'];

type Assignment = {
  id: string;
  subject: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'submitted';
  submittedDate?: Date;
};

export default function AssignmentsScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  
  // Modal & Form State
  const [modalVisible, setModalVisible] = useState(false);
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [newSubject, setNewSubject] = useState(SUBJECTS[0]);
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Filter assignments based on the active tab
  const displayedAssignments = assignments.filter(a => a.status === activeTab);

  const handleCreateAssignment = () => {
    if (!newDescription.trim()) {
      Alert.alert("Missing Information", "Please enter a description!");
      return;
    }

    const newAssignment: Assignment = {
      id: Date.now().toString(),
      subject: newSubject,
      description: newDescription,
      dueDate: newDueDate,
      status: 'pending',
    };

    setAssignments([newAssignment, ...assignments]);
    setModalVisible(false);
    setNewDescription('');
    setNewDueDate(new Date());
  };

  const markAsSubmitted = (id: string) => {
    setAssignments(prev => 
      prev.map(assignment => 
        assignment.id === id 
          ? { ...assignment, status: 'submitted', submittedDate: new Date() } 
          : assignment
      )
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📝 Assignments</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'submitted' && styles.activeTabSubmitted]} 
          onPress={() => setActiveTab('submitted')}
        >
          <Text style={[styles.tabText, activeTab === 'submitted' && styles.activeTabText]}>Submitted</Text>
        </TouchableOpacity>
      </View>

      {/* Assignment List */}
      <FlatList
        data={displayedAssignments}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No {activeTab} assignments found.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.subjectBadge}>{item.subject}</Text>
              {item.status === 'pending' ? (
                <Text style={styles.dueText}>Due: {formatDate(item.dueDate)}</Text>
              ) : (
                <Text style={styles.submittedText}>✓ Done on {formatDate(item.submittedDate!)}</Text>
              )}
            </View>
            <Text style={styles.description}>{item.description}</Text>
            
            {item.status === 'pending' && (
              <TouchableOpacity 
                style={styles.submitButton} 
                onPress={() => markAsSubmitted(item.id)}
              >
                <Text style={styles.submitButtonText}>Mark as Submitted</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Floating Action Button (Only show on pending tab) */}
      {activeTab === 'pending' && (
        <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>
      )}

      {/* CREATE ASSIGNMENT MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Assignment</Text>

            {/* Subject Dropdown Trigger */}
            <Text style={styles.label}>Subject</Text>
            <TouchableOpacity style={styles.input} onPress={() => setSubjectModalVisible(true)}>
              <Text style={{ color: '#212529' }}>{newSubject}</Text>
            </TouchableOpacity>

            {/* Description Input */}
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="e.g. Chapter 4 Exercises"
              placeholderTextColor="#ADB5BD"
              value={newDescription}
              onChangeText={setNewDescription}
              multiline
            />

            {/* Date Picker Trigger */}
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: '#212529' }}>{formatDate(newDueDate)}</Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newDueDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS, close on Android
                  if (selectedDate) setNewDueDate(selectedDate);
                }}
              />
            )}

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleCreateAssignment}>
                <Text style={styles.saveBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SUBJECT SELECTOR MODAL (Mini Dropdown) */}
      <Modal visible={subjectModalVisible} animationType="fade" transparent={true}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSubjectModalVisible(false)}>
          <View style={styles.dropdownContent}>
            {SUBJECTS.map(sub => (
              <TouchableOpacity 
                key={sub} 
                style={styles.dropdownItem}
                onPress={() => {
                  setNewSubject(sub);
                  setSubjectModalVisible(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: { padding: 20 },
  title: { fontSize: 26, fontWeight: '800', color: '#212529' },
  
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', backgroundColor: '#E9ECEF', borderRadius: 8, marginHorizontal: 4 },
  activeTab: { backgroundColor: '#0D6EFD' },
  activeTabSubmitted: { backgroundColor: '#40C057' },
  tabText: { fontWeight: '600', color: '#495057' },
  activeTabText: { color: '#FFFFFF' },

  listContent: { paddingHorizontal: 20, paddingBottom: 80 },
  emptyText: { textAlign: 'center', color: '#868E96', marginTop: 40, fontSize: 16 },
  
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 3 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  subjectBadge: { backgroundColor: '#E9ECEF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontWeight: '700', color: '#495057', fontSize: 12 },
  dueText: { color: '#FA5252', fontWeight: '600', fontSize: 13 },
  submittedText: { color: '#40C057', fontWeight: '600', fontSize: 13 },
  description: { fontSize: 16, color: '#343A40', marginBottom: 15 },
  
  submitButton: { backgroundColor: '#EBFBEE', paddingVertical: 10, borderRadius: 8, alignItems: 'center', borderWidth: 1, borderColor: '#D3F9D8' },
  submitButtonText: { color: '#2B8A3E', fontWeight: '700' },

  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#0D6EFD', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', shadowColor: '#0D6EFD', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 },
  fabIcon: { color: 'white', fontSize: 30, fontWeight: '400', marginTop: -2 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20, color: '#212529' },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 6 },
  input: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 20, marginRight: 10 },
  cancelBtnText: { color: '#868E96', fontWeight: '600', fontSize: 16 },
  saveBtn: { backgroundColor: '#0D6EFD', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },

  dropdownContent: { backgroundColor: '#FFFFFF', borderRadius: 12, overflow: 'hidden', marginHorizontal: 40 },
  dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
  dropdownItemText: { fontSize: 16, color: '#212529', textAlign: 'center' }
});