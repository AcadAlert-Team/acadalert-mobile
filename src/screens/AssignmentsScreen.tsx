import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../utils/supabase'; // Assuming you use this for auth

type TabType = 'Pending' | 'Submitted';

export default function AssignmentsScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('Pending');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);

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

  useFocusEffect(
    useCallback(() => {
      // 1. GUARD: Do not run the fetch if we don't know who the student is yet!
      if (!studentId) return;

      let isActive = true;
      setLoading(true);

      // 2. FIX: Set this to JUST the base API path
      const backendURL = `https://carly-homozygous-federico.ngrok-free.dev/api`;

      // Now this cleanly evaluates to: /api/student/assignments/S04
      fetch(`${backendURL}/student/assignments/${studentId}`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
          'ngrok-skip-browser-warning': 'true',
        },
      })
        .then(res => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then(data => {
          if (isActive) {
            setAssignments(data);
            setLoading(false);
          }
        })
        .catch(err => {
          console.error('Failed to load assignments:', err);
          if (isActive) setLoading(false);
        });

      return () => {
        isActive = false;
      };
    }, [studentId]),
  );

  // Filter the list based on which tab is currently selected
  const displayedAssignments = assignments.filter(a => a.status === activeTab);

  const renderAssignmentCard = ({ item }: { item: any }) => (
    <View
      style={[
        styles.card,
        { borderLeftColor: item.status === 'Pending' ? '#FD7E14' : '#40C057' },
      ]}
    >
      <Text style={styles.cardSubject}>{item.subject}</Text>
      <Text style={styles.cardDesc}>{item.description}</Text>

      <View style={styles.cardFooter}>
        {item.status === 'Pending' ? (
          <Text style={styles.pendingDate}>📅 Due: {item.dueDate}</Text>
        ) : (
          // Check if the teacher assigned a score, otherwise just show "Submitted"
          <Text style={styles.submittedDate}>
            {item.score !== null
              ? `🏆 Score: ${item.score} / 7.5`
              : `✅ Submitted (Pending Grade)`}
          </Text>
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
          <Text
            style={[
              styles.tabText,
              activeTab === 'Pending' && styles.activeTabText,
            ]}
          >
            ⏳ Pending
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'Submitted' && styles.activeTab]}
          onPress={() => setActiveTab('Submitted')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Submitted' && styles.activeTabText,
            ]}
          >
            ✅ Submitted
          </Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0D6EFD"
          style={{ marginTop: 50 }}
        />
      ) : displayedAssignments.length === 0 ? (
        <Text style={styles.emptyText}>
          {activeTab === 'Pending'
            ? "You're all caught up! 🎉"
            : 'No assignments submitted yet.'}
        </Text>
      ) : (
        <FlatList
          data={displayedAssignments}
          keyExtractor={item => item.id}
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E9ECEF',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: { fontSize: 15, fontWeight: '600', color: '#6C757D' },
  activeTabText: { color: '#212529', fontWeight: 'bold' },

  // List & Card Styles
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  emptyText: {
    textAlign: 'center',
    color: '#868E96',
    fontSize: 16,
    marginTop: 40,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardSubject: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 22,
    marginBottom: 12,
  },
  cardFooter: { borderTopWidth: 1, borderTopColor: '#F1F3F5', paddingTop: 12 },
  pendingDate: { fontSize: 14, fontWeight: '700', color: '#FD7E14' },
  submittedDate: { fontSize: 14, fontWeight: '700', color: '#40C057' },
});
