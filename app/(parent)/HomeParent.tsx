// app/HomeParents.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { authService } from '../../services/authService';
import { coreService } from '../../services/core';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeParents() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);
  const [recentAbsences, setRecentAbsences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // 1. Récupérer l'utilisateur
      const userData = await authService.getMe();
      setUser(userData);

      // 2. Récupérer les enfants
      const childrenData = await coreService.getMyChildren();
      setChildren(childrenData);

      // 3. Récupérer les notes et absences pour chaque enfant (pour l'aperçu)
      if (childrenData.length > 0) {
        // On prend les données du premier enfant pour l'exemple, ou on aggregate
        // Ici on va charger les notes du premier enfant pour l'accueil
        const firstChild = childrenData[0];
        const grades = await coreService.getStudentGrades(firstChild.id);
        const absences = await coreService.getStudentAttendances(firstChild.id);

        setRecentGrades(grades.slice(0, 4)); // 4 dernières notes
        setRecentAbsences(absences.slice(0, 3)); // 3 dernières absences
      }
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bloc Principal */}
        <View style={styles.topSection}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profile}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.name}>
                  {user ? `${user.first_name} ${user.last_name}` : 'Chargement...'}
                </Text>
                <Text style={styles.role}>Parent d'élève</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(forums)/ForumScreen')}>
              <View style={styles.actionIcon}>
                <Ionicons name="document-text-outline" size={24} color="#3D22D4" />
              </View>
              <Text style={styles.actionText}>Forms</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(screens)/EmploiDetail')}>
              <View style={styles.actionIcon}>
                <Ionicons name="calendar-outline" size={24} color="#3D22D4" />
              </View>
              <Text style={styles.actionText}>Emploi du temps</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(screens)/InfoScreen')}>
              <View style={styles.actionIcon}>
                <Ionicons name="time-outline" size={24} color="#3D22D4" />
              </View>
              <Text style={styles.actionText}>Retards</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* Message du jour */}
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Message du jour</Text>
          <Text style={styles.messageText}>
            Les congés de nöel sont prévus pour le 19 Décembre 2025. merci!
          </Text>
        </View>

        {/* Les notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dernières notes</Text>
            <TouchableOpacity onPress={() => router.push('/(screens)/InfoScreen')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.notesGrid}>
            {recentGrades.length > 0 ? (
              recentGrades.map((grade, index) => (
                <View key={index} style={styles.noteCard}>
                  <Text style={styles.noteDate}>{new Date(grade.date).toLocaleDateString()}</Text>
                  <Text style={styles.noteSubject}>{grade.subject_name}</Text>
                  <Text style={styles.noteValue}>{grade.value}/20</Text>
                </View>
              ))
            ) : (
              <Text style={{ marginLeft: 20, color: '#666' }}>Aucune note récente.</Text>
            )}
          </View>
        </View>

        {/* Les absences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Absences récentes</Text>
            <TouchableOpacity onPress={() => router.push('/(screens)/InfoScreen')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.absencesGrid}>
            {recentAbsences.length > 0 ? (
              recentAbsences.map((absence, index) => (
                <View key={index} style={styles.absenceCard}>
                  <Text style={styles.absenceName}>{absence.student_name}</Text>
                  {/* Fallback si subject est null (ex: absence journée entière) */}
                  <Text style={styles.absenceSubject}>{absence.subject ? absence.subject : 'Journée'}</Text>
                  <Text style={styles.absenceTime}>{new Date(absence.date).toLocaleDateString()}</Text>
                </View>
              ))
            ) : (
              <Text style={{ marginLeft: 20, color: '#666' }}>Aucune absence récente.</Text>
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  topSection: {
    backgroundColor: '#3D22D4',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingBottom: 40,
    shadowColor: '#3D22D4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    backgroundColor: '#3D22D4',
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileInfo: {
    flex: 1,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 14,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  role: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
    paddingHorizontal: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderRadius: 20,
    width: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(61, 34, 212, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#3D22D4',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
  messageCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    marginTop: -30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  messageText: {
    fontSize: 14,
    color: '#4a5568',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 14,
    color: '#3D22D4',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  notesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noteCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  noteDate: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
    marginBottom: 6,
  },
  noteSubject: {
    fontSize: 14,
    color: '#1a1a1a',
    marginVertical: 4,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  noteValue: {
    fontSize: 17,
    color: '#3D22D4',
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  absencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  absenceCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 16,
    width: '48%',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  absenceName: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
    letterSpacing: -0.2, marginBottom: 4
  },
  absenceSubject: { fontSize: 13, color: '#3D22D4', marginVertical: 4, fontWeight: '500' },
  absenceTime: { fontSize: 11, color: '#94a3b8', fontWeight: '500', marginTop: 4, },
});