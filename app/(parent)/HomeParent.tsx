import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  RefreshControl, 
  Alert 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { authService } from '../../services/authService';
import { coreService } from '../../services/core';
import { notificationsService } from '../../services/notification'; //
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// --- INTERFACES ---
interface Child {
  id: number;
  first_name: string;
  last_name: string;
  classroom_name?: string;
}

interface Grade {
  date: string;
  subject_name: string;
  student_name?: string;
  value: number;
}

interface Attendance {
  date: string;
  status: string;
  status_display: string;
  student_name?: string;
  subject_name?: string;
}

export default function HomeParents() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<Child[]>([]);
  const [recentGrades, setRecentGrades] = useState<Grade[]>([]);
  const [recentAbsences, setRecentAbsences] = useState<Attendance[]>([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0); //
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileImage, setProfileImage] = useState('https://i.pravatar.cc/150?img=3');

  // --- FONCTION : CHANGER LA PHOTO ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Nous avons besoin d\'accéder à vos photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const loadData = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);

      // Récupération Profil
      const userData = await authService.getMe(); //
      setUser(userData);

      // Récupération Compteur Notifications
      const notifData = await notificationsService.getUnreadCount(); //
      setUnreadNotifCount(notifData.count || 0);

      // Récupération Enfants
      const childrenData = await coreService.getMyChildren();
      setChildren(childrenData);

      if (childrenData && childrenData.length > 0) {
        // Chargement des Notes
        const gradesPromises = childrenData.map(async (child: Child) => {
          const data = await coreService.getStudentGrades(child.id);
          return data.map((g: any) => ({
            ...g,
            student_name: `${child.first_name} ${child.last_name}`
          }));
        });

        // Chargement des Absences
        const absencesPromises = childrenData.map(async (child: Child) => {
          const data = await coreService.getStudentAttendances(child.id);
          return data.map((a: any) => ({
            ...a,
            student_name: `${child.first_name} ${child.last_name}`
          }));
        });

        const gradesResults = await Promise.all(gradesPromises);
        const absencesResults = await Promise.all(absencesPromises);

        setRecentGrades(gradesResults.flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4));
        setRecentAbsences(absencesResults.flat().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 4));
      }
    } catch (error) {
      console.error("Erreur chargement données accueil:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#3D22D4" />
        <Text style={styles.loaderText}>Chargement de votre espace...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* --- SECTION HAUTE --- */}
        <View style={styles.topSection}>
          <View style={styles.header}>
            <View style={styles.profile}>
              <TouchableOpacity onPress={pickImage} activeOpacity={0.8}>
                <Image source={{ uri: profileImage }} style={styles.avatar} />
                <View style={styles.cameraIconBadge}>
                    <Ionicons name="camera" size={12} color="#fff" />
                </View>
              </TouchableOpacity>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>{user ? `${user.first_name} ${user.last_name}` : 'Parent'}</Text>
                <Text style={styles.role}>Espace Parent</Text>
              </View>
            </View>
            
            {/* BOUTON NOTIFICATION AVEC BADGE */}
            <TouchableOpacity style={styles.notificationButton}
              onPress={() => router.push('/(screens)/notification' as any)}
            >
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              {unreadNotifCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{unreadNotifCount > 9 ? '9+' : unreadNotifCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* ACTIONS RAPIDES */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(forums)/ForumScreen' as any)}>
              <View style={styles.actionIcon}><Ionicons name="chatbubbles-outline" size={24} color="#3D22D4" /></View>
              <Text style={styles.actionText}>Forums</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(parent)/MessageScreen' as any)}>
              <View style={styles.actionIcon}><Ionicons name="mail-outline" size={24} color="#3D22D4" /></View>
              <Text style={styles.actionText}>Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(screens)/ListeEnfants' as any)}>
              <View style={styles.actionIcon}><Ionicons name="stats-chart-outline" size={24} color="#3D22D4" /></View>
              <Text style={styles.actionText}>Résultats</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ANNONCE */}
        <View style={styles.messageCard}>
          <View style={styles.messageHeader}>
            <Ionicons name="megaphone-outline" size={20} color="#3D22D4" />
            <Text style={styles.messageTitle}>Information Scolaire</Text>
          </View>
          <Text style={styles.messageText}>Les congés de Noël sont prévus du 19 Décembre 2025 au 05 Janvier 2026.</Text>
        </View>

        {/* --- SECTION NOTES --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notes récentes</Text>
            <TouchableOpacity onPress={() => router.push('/(screens)/ListeEnfants' as any)}>
              <Text style={styles.seeAll}>Détails</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.grid}>
            {recentGrades.length > 0 ? recentGrades.map((grade, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.studentLabel}>{grade.student_name}</Text>
                <Text style={styles.cardDate}>{new Date(grade.date).toLocaleDateString('fr-FR')}</Text>
                <Text style={styles.cardSubject} numberOfLines={1}>{grade.subject_name}</Text>
                <Text style={styles.cardValue}>{grade.value}/20</Text>
              </View>
            )) : <Text style={styles.emptyText}>Aucune note récente.</Text>}
          </View>
        </View>

        {/* --- SECTION ABSENCES --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Absences & Retards</Text>
          </View>
          <View style={styles.grid}>
            {recentAbsences.length > 0 ? recentAbsences.map((absence, index) => (
              <View key={index} style={styles.card}>
                <View style={[styles.statusDot, { backgroundColor: absence.status === 'ABSENT' ? '#EF4444' : '#F59E0B' }]} />
                <Text style={styles.studentLabel}>{absence.student_name}</Text>
                <Text style={styles.subjectLabel} numberOfLines={1}>
                    {absence.subject_name || "Matière"} 
                </Text>
                <Text style={styles.cardDate}>{new Date(absence.date).toLocaleDateString('fr-FR')}</Text>
                <Text style={styles.statusLabel}>{absence.status_display}</Text>
              </View>
            )) : <Text style={styles.emptyText}>Aucun incident signalé.</Text>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 12, color: '#64748B' },
  topSection: { backgroundColor: '#3D22D4', borderBottomLeftRadius: 32, borderBottomRightRadius: 32, paddingBottom: 40, elevation: 8 },
  header: { paddingHorizontal: 20, paddingVertical: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profile: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)' },
  cameraIconBadge: { position: 'absolute', bottom: 0, right: 12, backgroundColor: '#3D22D4', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff' },
  profileInfo: { flex: 1 },
  name: { color: '#fff', fontSize: 18, fontWeight: '700' },
  role: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  notificationButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  notifBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: '#EF4444', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#3D22D4' },
  notifBadgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 20 },
  actionButton: { alignItems: 'center', backgroundColor: '#fff', paddingVertical: 16, borderRadius: 20, width: '30%', elevation: 4 },
  actionIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { fontSize: 11, color: '#3D22D4', fontWeight: '700', textAlign: 'center' },
  messageCard: { marginHorizontal: 20, backgroundColor: '#fff', padding: 16, borderRadius: 20, elevation: 4, marginTop: -25, borderWidth: 1, borderColor: '#E2E8F0' },
  messageHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 8 },
  messageTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B' },
  messageText: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1E293B' },
  seeAll: { fontSize: 13, color: '#3D22D4', fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', padding: 14, borderRadius: 16, width: '48%', marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#F1F5F9' },
  studentLabel: { color: '#3D22D4', fontWeight: 'bold', fontSize: 11, marginBottom: 2 },
  subjectLabel: { color: '#6366F1', fontSize: 11, fontWeight: '700', marginBottom: 2 },
  cardDate: { fontSize: 10, color: '#94A3B8', marginBottom: 4 },
  cardSubject: { fontSize: 14, color: '#1E293B', fontWeight: '600', marginBottom: 4 },
  cardValue: { fontSize: 18, color: '#3D22D4', fontWeight: '800' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginBottom: 8 },
  statusLabel: { fontSize: 11, fontWeight: '700', color: '#64748B', marginTop: 4 },
  emptyText: { color: '#94A3B8', fontSize: 12, fontStyle: 'italic', paddingVertical: 10 }
});