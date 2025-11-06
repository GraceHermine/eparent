import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4A6BFF" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.avatar}
          />
          <View>
            <Text style={styles.name}>DEDJENE Hermine</Text>
            <Text style={styles.class}>Second C</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>15,22</Text>
          <Text style={styles.statLabel}>Moyenne</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>94%</Text>
          <Text style={styles.statLabel}>Présence</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>8</Text>
          <Text style={styles.statLabel}>Retards</Text>
        </View>
      </View>

      {/* Menu rapide */}
      <View style={styles.quickMenu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/EmploiScreen')}>
          <Text style={styles.menuTitle}>Emploi du temps</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/ForumScreen')}>
          <Text style={styles.menuTitle}>Forums</Text>
        </TouchableOpacity>
         <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/InfoScreen')}>
          <Text style={styles.menuTitle}>Mes notes</Text>
        </TouchableOpacity>
      </View>

      {/* Cours récents */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Cours Récents</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Tout voir</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.coursesContainer}>
          <TouchableOpacity style={styles.courseCard} onPress={() => router.push('/InfoScreen')}>
            <MaterialCommunityIcons name="book-open-page-variant" size={28} color="#6C5CE7" />
            <Text style={styles.courseTitle}>Mathématiques</Text>
            <Text style={styles.courseGrade}>16/20</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.courseCard, { backgroundColor: '#E3F2FD' }]}>
            <MaterialCommunityIcons name="translate" size={28} color="#1E88E5" />
            <Text style={styles.courseTitle}>Anglais</Text>
            <Text style={styles.courseGrade}>17/20</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Mes Notes */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle} onPress={() => router.push('/InfoScreen')}>Mes Notes</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Tout voir</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#4A6BFF" />
          <Text style={styles.navLabelActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="book-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Cours</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="person-outline" size={24} color="#888" />
          <Text style={styles.navLabel}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#4A6BFF',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  class: {
    color: '#E0E7FF',
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#4A6BFF',
    marginTop: -10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  statCard: {
    alignItems: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#E0E7FF',
    fontSize: 12,
    marginTop: 4,
  },
  quickMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: -12,
  },
  menuItem: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 6,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  menuTitle: {
    fontWeight: '600',
    color: '#333',
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    color: '#4A6BFF',
    fontSize: 14,
  },
  coursesContainer: {
    flexDirection: 'row',
  },
  courseCard: {
    backgroundColor: '#F3E8FF',
    padding: 16,
    borderRadius: 16,
    width: 120,
    marginRight: 12,
    alignItems: 'center',
  },
  courseTitle: {
    marginTop: 8,
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
  },
  courseGrade: {
    marginTop: 4,
    fontSize: 13,
    color: '#6C5CE7',
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navItem: {
    alignItems: 'center',
  },
  navLabelActive: {
    color: '#4A6BFF',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  navLabel: {
    color: '#888',
    fontSize: 12,
    marginTop: 4,
  },
});