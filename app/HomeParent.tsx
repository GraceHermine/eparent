// app/HomeParents.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeParents() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profile}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>DEDJENE Moulot Paul</Text>
              <Text style={styles.role}>Parent d'élève</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}  onPress={() => router.push('/ForumScreen')}>
            <Ionicons name="document-text-outline" size={28} color="#3D22D4" />
            <Text style={styles.actionText}>Forms</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/EmploiScreen')}>
            <Ionicons name="calendar-outline" size={28} color="#3D22D4" />
            <Text style={styles.actionText}>Emploi du temps</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/InfoScreen')}>
            <Ionicons name="time-outline" size={28} color="#3D22D4" />
            <Text style={styles.actionText}>Retards</Text>
          </TouchableOpacity>
        </View>

        {/* Message du jour */}
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Message du jour</Text>
          <Text style={styles.messageText}>
            azertyuiop^qsdfghjklmwxc vbhjklghjuyxghxc hvbh
          </Text>
        </View>

        {/* Les notes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Les notes</Text>
            <TouchableOpacity onPress={() => router.push('/InfoScreen')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.notesGrid}>
            <View style={styles.noteCard}>
              <Text style={styles.noteDate}>Date</Text>
              <Text style={styles.noteSubject}>Maths</Text>
              <Text style={styles.noteValue}>15/20</Text>
            </View>

            <View style={styles.noteCard}>
              <Text style={styles.noteDate}>Date</Text>
              <Text style={styles.noteSubject}>Anglais</Text>
              <Text style={styles.noteValue}>12/20</Text>
            </View>
          </View>
        </View>

        {/* Les absences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Les absences</Text>
            <TouchableOpacity onPress={() => router.push('/InfoScreen')}>
              <Text style={styles.seeAll}>Tout voir</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.absencesGrid}>
            <View style={styles.absenceCard}>
              <Text style={styles.absenceName}>Angelo</Text>
              <Text style={styles.absenceSubject}>Maths</Text>
              <Text style={styles.absenceTime}>07h30 - 10h05</Text>
            </View>

            <View style={styles.absenceCard}>
              <Text style={styles.absenceName}>Angelo</Text>
              <Text style={styles.absenceSubject}>Maths</Text>
              <Text style={styles.absenceTime}>07h30 - 10h05</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItemActive}>
          <Ionicons name="home" size={24} color="#3D22D4" />
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#666" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#666" />
          <Text style={styles.navText}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#3D22D4',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  role: {
    color: '#e0d0ff',
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 24,
    paddingHorizontal: 16,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    width: 100,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionText: {
    marginTop: 8,
    fontSize: 13,
    color: '#3D22D4',
    fontWeight: '600',
  },
  messageCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  messageText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#3D22D4',
    fontWeight: '600',
  },
  notesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  noteCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    width: '48%',
    elevation: 2,
  },
  noteDate: {
    fontSize: 12,
    color: '#999',
  },
  noteSubject: {
    fontSize: 14,
    color: '#333',
    marginVertical: 4,
    fontWeight: '600',
  },
  noteValue: {
    fontSize: 18,
    color: '#3D22D4',
    fontWeight: 'bold',
  },
  absencesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  absenceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    width: '48%',
    elevation: 2,
  },
  absenceName: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  absenceSubject: {
    fontSize: 13,
    color: '#3D22D4',
    marginVertical: 4,
  },
  absenceTime: {
    fontSize: 12,
    color: '#999',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navItemActive: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  navTextActive: {
    fontSize: 12,
    color: '#3D22D4',
    marginTop: 4,
    fontWeight: '600',
  },
});