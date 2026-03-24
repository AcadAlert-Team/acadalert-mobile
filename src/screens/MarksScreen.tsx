import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, 
  FlatList, Modal, SafeAreaView, Alert 
} from 'react-native';

const SUBJECTS = ['CGIP', 'CD', 'IEFT', 'AAD', 'ELEC'];

type MarkEntry = {
  id: string;
  subject: string;
  score: number;
  uploadedDate: Date;
};

export default function MarksScreen() {
  const [activeTab, setActiveTab] = useState<'upload' | 'history'>('upload');
  const [marksHistory, setMarksHistory] = useState<MarkEntry[]>([]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]);
  const [scoreInput, setScoreInput] = useState('');

  const handleUploadMark = () => {
    const numericScore = parseFloat(scoreInput);

    if (isNaN(numericScore) || numericScore < 0 || numericScore > 100) {
      Alert.alert("Invalid Input", "Please enter a valid mark between 0 and 100.");
      return;
    }

    const newEntry: MarkEntry = {
      id: Date.now().toString(),
      subject: selectedSubject,
      score: numericScore,
      uploadedDate: new Date(),
    };

    setMarksHistory([newEntry, ...marksHistory]);
    setModalVisible(false);
    setScoreInput('');
    Alert.alert("Success", `Mark for ${selectedSubject} uploaded!`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const displayedMarks = activeTab === 'history' ? marksHistory : [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Internal Marks</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upload' && styles.activeTab]} 
          onPress={() => setActiveTab('upload')}
        >
          <Text style={[styles.tabText, activeTab === 'upload' && styles.activeTabText]}>New Upload</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTabHistory]} 
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>View History</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayedMarks}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {activeTab === 'upload' ? "Tap the + to upload a mark" : "No marks history found."}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.subjectText}>{item.subject}</Text>
              <Text style={styles.dateText}>Uploaded: {formatDate(item.uploadedDate)}</Text>
            </View>
            <View style={[styles.scoreBadge, item.score >= 40 ? styles.bgGreen : styles.bgRed]}>
              <Text style={styles.scoreText}>{item.score}/100</Text>
            </View>
          </View>
        )}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Marks</Text>

            <Text style={styles.label}>Choose Subject</Text>
            <TouchableOpacity style={styles.inputField} onPress={() => setSubjectModalVisible(true)}>
              <Text style={{ color: '#212529' }}>{selectedSubject}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Enter Mark (0 - 100)</Text>
            <TextInput
              style={styles.inputField}
              placeholder="e.g. 85"
              keyboardType="numeric"
              maxLength={3}
              value={scoreInput}
              onChangeText={setScoreInput}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleUploadMark}>
                <Text style={styles.saveBtnText}>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={subjectModalVisible} animationType="fade" transparent={true}>
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSubjectModalVisible(false)}>
          <View style={styles.dropdownBox}>
            {SUBJECTS.map(sub => (
              <TouchableOpacity 
                key={sub} 
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedSubject(sub);
                  setSubjectModalVisible(false);
                }}
              >
                <Text style={styles.dropdownText}>{sub}</Text>
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
  activeTabHistory: { backgroundColor: '#6C757D' },
  tabText: { fontWeight: '600', color: '#495057' },
  activeTabText: { color: '#FFFFFF' },
  listContent: { paddingHorizontal: 20, paddingBottom: 80 },
  emptyText: { textAlign: 'center', color: '#868E96', marginTop: 40 },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  cardInfo: { flex: 1 },
  subjectText: { fontSize: 18, fontWeight: '700', color: '#343A40' },
  dateText: { fontSize: 12, color: '#ADB5BD', marginTop: 4 },
  scoreBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  bgGreen: { backgroundColor: '#EBFBEE' },
  bgRed: { backgroundColor: '#FFF5F5' },
  scoreText: { fontWeight: '800', color: '#212529' },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#0D6EFD', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabIcon: { color: 'white', fontSize: 30 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#495057', marginBottom: 6 },
  inputField: { backgroundColor: '#F8F9FA', borderWidth: 1, borderColor: '#DEE2E6', borderRadius: 8, padding: 12, marginBottom: 16 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  cancelBtn: { paddingVertical: 12, paddingHorizontal: 20 },
  cancelBtnText: { color: '#868E96', fontWeight: '600' },
  saveBtn: { backgroundColor: '#0D6EFD', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  saveBtnText: { color: '#FFFFFF', fontWeight: '600' },
  dropdownBox: { backgroundColor: '#FFFFFF', borderRadius: 12, marginHorizontal: 50 },
  dropdownItem: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F3F5' },
  dropdownText: { textAlign: 'center', fontSize: 16, color: '#212529' }
});