import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function App() {
  // Données simulées
  const todaySchedule = [
    { time: '08:00', subject: 'Mathématiques', room: 'Salle 204', color: '#8B5CF6' },
    { time: '10:00', subject: 'Physique', room: 'Labo 1', color: '#3B82F6' },
    { time: '14:00', subject: 'Anglais', room: 'Salle 101', color: '#10B981' },
  ];

  const upcomingTasks = [
    { subject: 'Maths', title: 'Devoir Maison', dueDate: 'Demain', type: 'homework', priority: 'high' },
    { subject: 'SVT', title: 'Exposé Chapitre 3', dueDate: 'Vendredi', type: 'presentation', priority: 'medium' },
    { subject: 'Histoire', title: 'Contrôle Guerre Froide', dueDate: 'Lundi', type: 'exam', priority: 'high' },
  ];

  const announcements = [
    { title: 'Sortie pédagogique', content: 'Musée des Sciences - 15 Nov', icon: 'bus', color: '#F59E0B' },
    { title: 'Résultats disponibles', content: 'Trimestre 1 publiés', icon: 'trophy', color: '#10B981' },
  ];

  const subjectProgress = [
    { name: 'Maths', grade: 15.2, progress: 0.76, color: '#8B5CF6' },
    { name: 'Français', grade: 14.8, progress: 0.74, color: '#EC4899' },
    { name: 'Anglais', grade: 17.0, progress: 0.85, color: '#10B981' },
    { name: 'Physique', grade: 13.5, progress: 0.68, color: '#3B82F6' },
  ];

  const badges = [
    { title: 'Assidu', icon: 'calendar-check', color: '#10B981' },
    { title: 'Top 5', icon: 'trophy', color: '#F59E0B' },
    { title: 'Progression', icon: 'trending-up', color: '#8B5CF6' },
  ];

  const yearProgress = 0.42; // 42% de l'année écoulée

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header avec gradient subtil */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/women/44.jpg' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.greeting}>Bonjour 👋</Text>
              <Text style={styles.name}>Hermine Dedjene</Text>
              <Text style={styles.class}>Seconde C • Lycée Victor Hugo</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color="#1F2937" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards avec nouveau design */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: '#F0F9FF' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#3B82F6' }]}>
              <MaterialCommunityIcons name="chart-line" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>15,22</Text>
            <Text style={styles.statLabel}>Moyenne</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#10B981' }]}>
              <Ionicons name="checkmark-circle" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>94%</Text>
            <Text style={styles.statLabel}>Présence</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: '#FFF7ED' }]}>
            <View style={[styles.statIcon, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="time" size={20} color="white" />
            </View>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Retards</Text>
          </View>
        </View>

        {/* Progression de l'année */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progression de l'année</Text>
          <View style={styles.yearProgressCard}>
            <View style={styles.yearProgressHeader}>
              <Text style={styles.yearProgressLabel}>Année scolaire 2024-2025</Text>
              <Text style={styles.yearProgressPercent}>{Math.round(yearProgress * 100)}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBarFill, { width: `${yearProgress * 100}%` }]} />
            </View>
            <Text style={styles.yearProgressSubtext}>135 jours écoulés • 185 jours restants</Text>
          </View>
        </View>

        {/* Badges de performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tes badges</Text>
          <View style={styles.badgesRow}>
            {badges.map((badge, index) => (
              <View key={index} style={styles.badgeCard}>
                <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20' }]}>
                  <MaterialCommunityIcons
                    name={badge.icon as any}    // ou as unknown as string
                    size={24}
                    color={badge.color}
                  />
                </View>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Messages importants / Annonces */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Annonces</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllBtn}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          {announcements.map((announcement, index) => (
            <TouchableOpacity key={index} style={styles.announcementCard}>
              <View style={[styles.announcementIcon, { backgroundColor: announcement.color + '20' }]}>
                <MaterialCommunityIcons name={announcement.icon as any} size={22} color={announcement.color} />
              </View>
              <View style={styles.announcementContent}>
                <Text style={styles.announcementTitle}>{announcement.title}</Text>
                <Text style={styles.announcementText}>{announcement.content}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Emploi du temps du jour */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Aujourd'hui</Text>
            <TouchableOpacity onPress={() => router.push('/EmploiScreen')}>
              <Text style={styles.seeAllBtn}>Emploi complet</Text>
            </TouchableOpacity>
          </View>
          {todaySchedule.map((course, index) => (
            <View key={index} style={styles.scheduleCard}>
              <View style={[styles.scheduleIndicator, { backgroundColor: course.color }]} />
              <View style={styles.scheduleContent}>
                <View style={styles.scheduleHeader}>
                  <Text style={styles.scheduleSubject}>{course.subject}</Text>
                  <Text style={styles.scheduleTime}>{course.time}</Text>
                </View>
                <View style={styles.scheduleFooter}>
                  <Ionicons name="location-outline" size={14} color="#6B7280" />
                  <Text style={styles.scheduleRoom}>{course.room}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Devoirs et évaluations à venir */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>À faire</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllBtn}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          {upcomingTasks.map((task, index) => (
            <TouchableOpacity key={index} style={styles.taskCard}>
              <View style={styles.taskLeft}>
                <View style={[
                  styles.taskIconContainer,
                  { backgroundColor: task.priority === 'high' ? '#FEE2E2' : '#FEF3C7' }
                ]}>
                  <MaterialCommunityIcons 
                    name={task.type === 'exam' ? 'file-document-edit' : task.type === 'presentation' ? 'presentation' : 'notebook'} 
                    size={20} 
                    color={task.priority === 'high' ? '#EF4444' : '#F59E0B'} 
                  />
                </View>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskSubject}>{task.subject}</Text>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                </View>
              </View>
              <View style={styles.taskRight}>
                <Text style={[
                  styles.taskDueDate,
                  { color: task.priority === 'high' ? '#EF4444' : '#F59E0B' }
                ]}>
                  {task.dueDate}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Progression par matière */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes matières</Text>
            <TouchableOpacity onPress={() => router.push('/screens/InfoScreen')}>
              <Text style={styles.seeAllBtn}>Notes détaillées</Text>
            </TouchableOpacity>
          </View>
          {subjectProgress.map((subject, index) => (
            <View key={index} style={styles.subjectCard}>
              <View style={styles.subjectHeader}>
                <View style={styles.subjectLeft}>
                  <View style={[styles.subjectColorDot, { backgroundColor: subject.color }]} />
                  <Text style={styles.subjectName}>{subject.name}</Text>
                </View>
                <Text style={styles.subjectGrade}>{subject.grade}/20</Text>
              </View>
              <View style={styles.subjectProgressBar}>
                <View 
                  style={[
                    styles.subjectProgressFill, 
                    { width: `${subject.progress * 100}%`, backgroundColor: subject.color }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Accès rapide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accès rapide</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => router.push('/ForumScreen')}
            >
              <View style={[styles.quickAccessIcon, { backgroundColor: '#EDE9FE' }]}>
                <MaterialCommunityIcons name="forum" size={24} color="#8B5CF6" />
              </View>
              <Text style={styles.quickAccessLabel}>Forum</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={[styles.quickAccessIcon, { backgroundColor: '#DBEAFE' }]}>
                <MaterialCommunityIcons name="book-open-variant" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.quickAccessLabel}>Cours</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={[styles.quickAccessIcon, { backgroundColor: '#D1FAE5' }]}>
                <MaterialCommunityIcons name="calendar-month" size={24} color="#10B981" />
              </View>
              <Text style={styles.quickAccessLabel}>Calendrier</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickAccessCard}>
              <View style={[styles.quickAccessIcon, { backgroundColor: '#FED7AA' }]}>
                <MaterialCommunityIcons name="file-document" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.quickAccessLabel}>Documents</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#FAFAFA',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    borderWidth: 3,
    borderColor: '#E5E7EB',
  },
  profileInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  class: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },

  // Stats Cards
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },

  // Sections générales
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  seeAllBtn: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '600',
  },

  // Progression de l'année
  yearProgressCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  yearProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  yearProgressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  yearProgressPercent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },
  yearProgressSubtext: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Badges
  badgesRow: {
    flexDirection: 'row',
    gap: 12,
  },
  badgeCard: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },

  // Annonces
  announcementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  announcementIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  announcementContent: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 3,
  },
  announcementText: {
    fontSize: 13,
    color: '#6B7280',
  },

  // Emploi du temps
  scheduleCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  scheduleIndicator: {
    width: 5,
  },
  scheduleContent: {
    flex: 1,
    padding: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleSubject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  scheduleTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },
  scheduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleRoom: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
  },

  // Tâches à faire
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  taskInfo: {
    flex: 1,
  },
  taskSubject: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
    marginBottom: 3,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  taskRight: {
    alignItems: 'flex-end',
  },
  taskDueDate: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Progression matières
  subjectCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  subjectLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subjectColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  subjectName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  subjectGrade: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  subjectProgressBar: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjectProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Accès rapide
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessCard: {
    width: '47%',
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickAccessIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickAccessLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },

});
