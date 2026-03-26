import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { supabase } from '../utils/supabase'; // Assuming you use this for auth

type TabType = 'Pending' | 'Submitted';

export default function AssignmentsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('Pending');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🚨 MOCK DATA: Replace this fetch with your actual backend call later!
  useEffect(() => {
    // Simulating a backend fetch delay
    setTimeout(() => {
      setAssignments([
        {
          id: '1',
          subject: 'Compiler Design',
          description: 'Build a basic lexical analyzer in C. Ensure it can identify keywords, identifiers, and operators.',
          dueDate: '2026-04-10',
          status: 'Pending',
        },
        {
          id: '2',
          subject: 'Algorithm Analysis',
          description: 'Implement Dijkstra’s Algorithm and write a 1-page report on its time complexity.',
          dueDate: '2026-04-15',
          status: 'Pending',
        },
        {
          id: '3',
          subject: 'Computer Graphics',
          description: 'Draw a moving car using the OpenGL graphics library.',
          dueDate: '2026-03-15',
          submittedOn: '2026-03-14',
          status: 'Submitted',
        },
        {
          id: '4',
          subject: 'Industrial Economics',
          description: 'Submit the case study report on market structures.',
          dueDate: '2026-02-28',
          submittedOn: '2026-02-27',
          status: 'Submitted',
        }
      ]);
      setLoading(false);
    }, 800);
  }, []);

  // Filter the list based on which tab is currently selected
  const displayedAssignments = assignments.filter(a => a.status === activeTab);

  const renderAssignmentCard = ({ item }: { item: any }) => (
    <View style={[
      styles.card, 
      { borderLeftColor: item.status === 'Pending' ? '#FD7E14' : '#40C057' } // Orange for pending, Green for submitted
    ]}>
      <Text style={styles.cardSubject}>{item.subject}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>
      
      <View style={styles.cardFooter}>
        {item.status === 'Pending' ? (
          <Text style={styles.pendingDate}>📅 Due: {item.dueDate}</Text>
        ) : (
          <Text style={styles.submittedDate}>✅ Submitted on: {item.submittedOn}</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Assignments</Text>
      </View>

      {/* Segmented Control (Tabs) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Pending' && styles.activeTab]}
          onPress={() => setActiveTab('Pending')}
        >
          <Text style={[styles.tabText, activeTab === 'Pending' && styles.activeTabText]}>
            ⏳ Pending
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Submitted' && styles.activeTab]}
          onPress={() => setActiveTab('Submitted')}
        >
          <Text style={[styles.tabText, activeTab === 'Submitted' && styles.activeTabText]}>
            ✅ Submitted
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {loading ? (
        <ActivityIndicator size="large" color="#0D6EFD" style={{ marginTop: 50 }} />
      ) : displayedAssignments.length === 0 ? (
        <Text style={styles.emptyText}>
          {activeTab === 'Pending' ? "You're all caught up! 🎉" : "No assignments submitted yet."}
        </Text>
      ) : (
        <FlatList
          data={displayedAssignments}
          keyExtractor={(item) => item.id}
          renderItem={renderAssignmentCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6F8' },
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 15 },
  title: { fontSize: 28, fontWeight: '800', color: '#212529' },
  
  // Tab Styles
  tabContainer: { flexDirection: 'row', backgroundColor: '#E9ECEF', marginHorizontal: 20, borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 15, fontWeight: '600', color: '#6C757D' },
  activeTabText: { color: '#212529', fontWeight: 'bold' },
  
  // List & Card Styles
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyText: { textAlign: 'center', color: '#868E96', fontSize: 16, marginTop: 40, fontWeight: '500' },
  card: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, marginBottom: 16, borderLeftWidth: 6, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 3 },
  cardSubject: { fontSize: 18, fontWeight: 'bold', color: '#212529', marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#495057', lineHeight: 22, marginBottom: 12 },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F3F5', paddingTop: 12 },
  pendingDate: { fontSize: 14, fontWeight: '700', color: '#FD7E14' },
  submittedDate: { fontSize: 14, fontWeight: '700', color: '#40C057' },
});