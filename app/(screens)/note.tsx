import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { coreService } from '../../services/core';

// Interfaces adaptées à l'API actuelle
interface Grade {
  subject: number;   // ID matière
  value: number;
  date: string;
  comment?: string;
}

interface Attendance {
  date: string;
  status: 'ABSENT' | 'RETARD' | string;
  status_display: string;
}

interface StudentDataState {
  grades: Grade[];
  attendances: Attendance[];
  remarks: any[];
}

export default function StudentInfoScreen() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams();

  const [activeTab, setActiveTab] = useState<'notes' | 'absences'>('notes');
  const [studentData, setStudentData] = useState<StudentDataState>({
    grades: [],
    attendances: [],
    remarks: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawStudentId = Array.isArray(studentId) ? studentId[0] : studentId;

    if (!rawStudentId || isNaN(Number(rawStudentId))) {
      setLoading(false); // si ID invalide
      return;
    }

    const loadAllData = async () => {
      try {
        setLoading(true);
        const sId = Number(rawStudentId);

        const gradesResponse = await coreService.getStudentGrades(sId);
        const attendancesResponse = await coreService.getStudentAttendances(sId);

        // Mapping simple pour correspondre à ce que l'écran attend
        const rawGrades = gradesResponse?.results ?? gradesResponse ?? [];
        const grades: Grade[] = rawGrades.map((g: any) => ({
          subject: g.subject,        // ID matière
          value: g.value,
          date: g.date,
          comment: g.comment,
        }));

        const attendances: Attendance[] = attendancesResponse?.results ?? attendancesResponse ?? [];

        setStudentData({
          grades,
          attendances,
          remarks: grades.filter(g => g.comment),
        });
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de charger les données.');
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [studentId]);

  // Groupement des notes par matière (fallback sur "Matière ID" si nom non disponible)
  const groupedGrades = useMemo(() => {
    return studentData.grades.reduce((acc, grade) => {
      const key = `Matière ${grade.subject}`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(grade);
      return acc;
    }, {} as Record<string, Grade[]>);
  }, [studentData.grades]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Suivi Scolaire</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => setActiveTab('notes')}
        >
          <Text style={[styles.tabText, activeTab === 'notes' && styles.activeTabText]}>
            Notes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'absences' && styles.activeTab]}
          onPress={() => setActiveTab('absences')}
        >
          <Text style={[styles.tabText, activeTab === 'absences' && styles.activeTabText]}>
            Absences
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === 'notes' ? (
          Object.keys(groupedGrades).length > 0 ? (
            Object.entries(groupedGrades).map(([subject, grades], idx) => (
              <View key={idx} style={styles.subjectSection}>
                <Text style={styles.subjectHeader}>{subject}</Text>
                <View style={styles.gradesGrid}>
                  {grades.map((g, i) => (
                    <View key={i} style={styles.gradeCircle}>
                      <Text style={styles.gradeValueText}>{g.value}</Text>
                      <Text style={styles.gradeDateText}>
                        {new Date(g.date).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                        })}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>Aucune note enregistrée</Text>
          )
        ) : studentData.attendances.length > 0 ? (
          studentData.attendances.map((a, i) => (
            <View key={i} style={styles.attendanceCard}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: a.status === 'ABSENT' ? '#EF4444' : '#F59E0B' },
                ]}
              />
              <View>
                <Text style={styles.attendanceDate}>
                  {new Date(a.date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                  })}
                </Text>
                <Text style={styles.attendanceStatus}>{a.status_display}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Aucune absence ou retard</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', padding: 16, alignItems: 'center', backgroundColor: '#FFF' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  backBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 10 },
  tabBar: { flexDirection: 'row', margin: 16, backgroundColor: '#E2E8F0', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  activeTab: { backgroundColor: '#FFF', elevation: 2 },
  tabText: { fontWeight: '600', color: '#64748B' },
  activeTabText: { color: '#6366F1' },
  scrollContent: { padding: 16 },
  subjectSection: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  subjectHeader: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  gradesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  gradeCircle: { alignItems: 'center', justifyContent: 'center', width: 60, height: 60, borderRadius: 30, backgroundColor: '#EEF2FF', borderWidth: 1, borderColor: '#C7D2FE' },
  gradeValueText: { fontWeight: 'bold', color: '#4338CA', fontSize: 16 },
  gradeDateText: { fontSize: 10, color: '#64748B' },
  attendanceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  statusIndicator: { width: 4, height: 40, borderRadius: 2, marginRight: 12 },
  attendanceDate: { fontWeight: '600', color: '#1E293B' },
  attendanceStatus: { color: '#64748B', fontSize: 13 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#94A3B8' },
});
