import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../services/authService';
import { notificationsService } from '../../services/notification';
import { coreService } from '../../services/core';

export default function HomeTeacher() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userData = await authService.getMe();
      setUser(userData);

      const countData = await notificationsService.getUnreadCount();
      setUnreadCount(countData.count);

      const statsData = await coreService.getTeacherStats();
      setStats([
        { label: "Absences", value: statsData.absences, color: "#EF4444" },
        { label: "Notes ajoutées", value: statsData.grades, color: "#10B981" },
        { label: "Devoirs", value: statsData.assignments, color: "#F59E0B" },
      ]);
    } catch (error) {
      console.error("Erreur chargement HomeProf:", error);
    } finally {
      setLoading(false);
    }
  };

  const [stats, setStats] = useState([
    { label: "Absences", value: 0, color: "#EF4444" },
    { label: "Notes ajoutées", value: 0, color: "#10B981" },
    { label: "Devoirs", value: 0, color: "#F59E0B" },
  ]);

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#3D22D4" style={{ marginTop: 50 }} /></View>

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.topSection}>
          <View style={styles.header}>
            <View style={styles.profile}>
              <View style={[styles.avatar, { backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#3D22D4' }}>
                  {user?.first_name?.charAt(0) || "P"}
                </Text>
              </View>
              {/* <Image source={{ uri: "..." }} style={styles.avatar} /> */}
              <View>
                <Text style={styles.name}>{user ? `${user.first_name} ${user.last_name}` : "Enseignant"}</Text>
                <Text style={styles.role}>Professeur</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => {/* Screen notif */ }}>
              <Ionicons name="notifications-outline" size={28} color="#fff" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Stats rapides */}
          <View style={styles.statsContainer}>
            {stats.map((stat, idx) => (
              <View key={idx} style={[styles.statCard, { backgroundColor: stat.color }]}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Message du jour - Placeholder ou API? */}
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Message</Text>
          <Text style={styles.messageText}>Bienvenue sur votre espace enseignant. Gérez vos classes et élèves facilement.</Text>
        </View>

        {/* ACTIVITé principales */}
        {/* <Text style={styles.sectionTitle}>Actions</Text> */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(screens)/classe')}>
            <Ionicons name="people-outline" size={28} color="#3D22D4" />
            <Text style={styles.actionLabel}>Éléve</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(forums)/ForumScreen')}>
            <Ionicons name="chatbox-ellipses-outline" size={28} color="#3D22D4" />
            <Text style={styles.actionLabel}>Forum</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/')}>
            <Ionicons name="calendar-outline" size={28} color="#3D22D4" />
            <Text style={styles.actionLabel}>Emploi du temps</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(screens)/note')}>
            <Ionicons name="book-outline" size={28} color="#3D22D4" />
            <Text style={styles.actionLabel}>Notes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(screens)/Remarques')}>
            <Ionicons name="pencil-outline" size={28} color="#3D22D4" />
            <Text style={styles.actionLabel}>Remarques</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  topSection: { backgroundColor: '#3D22D4', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, paddingBottom: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  profile: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 60, height: 60, borderRadius: 30, marginRight: 12, borderWidth: 2, borderColor: '#fff' },
  name: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  role: { color: '#e0d0ff', fontSize: 13 },
  notificationBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: '#EF4444', borderRadius: 10, width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
  notificationText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10, paddingHorizontal: 16, },
  statCard: { backgroundColor: '#688ce7', borderRadius: 16, padding: 16, marginHorizontal: 4, alignItems: 'center', width: '30%', },
  statValue: { fontSize: 22, fontWeight: '700', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 14, color: '#fff', fontWeight: '600', textAlign: 'center' },
  messageCard: { marginHorizontal: 20, backgroundColor: '#fff', padding: 16, borderRadius: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, marginTop: -30 },
  messageTitle: { fontSize: 16, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  messageText: { fontSize: 14, color: '#555', lineHeight: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#000', marginTop: 24, marginLeft: 20 },
  actionsContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginHorizontal: 20 },
  actionCard: { width: '48%', backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 8, borderRadius: 16, marginVertical: 8, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, marginTop: 25 },
  actionLabel: { fontSize: 14, fontWeight: '600', color: '#1F2937', marginTop: 8, textAlign: 'center' },
});