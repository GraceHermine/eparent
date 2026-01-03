// app/TakeAttendance.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter, SearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSearchParams } from 'expo-router/build/hooks';

import { coreService } from '../../services/core';

export default function TakeAttendance() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) loadStudents();
  }, [classId]);

  const loadStudents = async () => {
    try {
      const data = await coreService.getClassStudents(classId);
      // Map API data to local state with 'present' flag (default true or false? let's say present by default)
      const mapped = data.map((s: any) => ({ ...s, present: true, name: `${s.first_name} ${s.last_name}` }));
      setStudents(mapped);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (id: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const saveAttendance = async () => {
    try {
      // Loop through students (or filter modified ones)
      setLoading(true);
      const absents = students.filter(s => !s.present);

      // We only Create Attendance for ABSENTS? Or we send status for all?
      // Assuming backend creates "Attendance" entry for absents/delays.
      // If present, no entry needed usually, unless we track presence explicitly.
      // Let's assume we log ABSENCES.

      for (const student of absents) {
        await coreService.createAttendance({
          student: student.id,
          status: 'ABSENT', // Defaulting to absent for now
          reason: 'Non justifié',
          date: new Date().toISOString().split('T')[0]
        });
      }

      Alert.alert('Succès', 'Présences enregistrées !');
      router.back();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible d\'enregistrer');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: { id: string; name: string; present: boolean } }) => (
    <TouchableOpacity
      style={[
        styles.studentCard,
        item.present && styles.presentCard
      ]}
      onPress={() => toggleAttendance(item.id)}
    >
      <View style={styles.studentInfo}>
        <View style={[
          styles.avatar,
          item.present && styles.presentAvatar
        ]}>
          <Text style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.studentName}>{item.name}</Text>
      </View>
      <View style={[
        styles.statusIndicator,
        item.present ? styles.presentIndicator : styles.absentIndicator
      ]}>
        <Ionicons
          name={item.present ? 'checkmark' : 'close'}
          size={18}
          color="#FFFFFF"
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading && <View style={{ position: 'absolute', zIndex: 10, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)' }}><ActivityIndicator size="large" color="#3D22D4" /></View>}
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#3D22D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prise de présence</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {students.filter(s => s.present).length}
          </Text>
          <Text style={styles.statLabel}>Présents</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {students.filter(s => !s.present).length}
          </Text>
          <Text style={styles.statLabel}>Absents</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{students.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Liste des élèves */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Bouton enregistrer */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={saveAttendance}
      >
        <Text style={styles.saveButtonText}>Enregistrer la présence</Text>
        <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 3, elevation: 2,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B', letterSpacing: -0.3 },
  headerSpacer: { width: 40 },
  statsContainer: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', marginHorizontal: 20, marginTop: 20, borderRadius: 16, padding: 20, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#F1F5F9',
  },
  listContainer: {
    padding: 20,
    paddingTop: 16,
  },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  presentCard: {
    backgroundColor: '#F0FDF4',
    borderColor: '#D1FAE5',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  presentAvatar: {
    backgroundColor: '#D1FAE5',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  statusIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  presentIndicator: {
    backgroundColor: '#10B981',
  },
  absentIndicator: {
    backgroundColor: '#EF4444',
  },
  saveButton: {
    backgroundColor: '#3D22D4',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    margin: 20,
    borderRadius: 16,
    shadowColor: '#3D22D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    gap: 8,
  },
  saveButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', letterSpacing: -0.3 },
});