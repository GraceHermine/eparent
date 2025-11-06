import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Données simulées de l'élève
  const studentData = {
    name: 'Hermine Dedjene',
    fullName: 'DEDJENE Hermine Marie',
    class: 'Seconde C',
    school: 'Lycée Victor Hugo',
    matricule: 'LVH-2024-1542',
    birthDate: '15 Mars 2009',
    email: 'hermine.dedjene@lycee.edu',
    parentContact: '+225 07 XX XX XX XX',
    gender: 'Féminin',
    mainTeacher: 'M. KOUASSI Jean',
    classRank: 5,
    totalSubjects: 12,
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
  };

  const statistics = {
    average: 15.22,
    attendance: 94,
    lateCount: 8,
  };

  const trimesterData = [
    { period: 'Trimestre 1', average: 14.8, rank: 6, maxRank: 35 },
    { period: 'Trimestre 2', average: 15.5, rank: 5, maxRank: 35 },
    { period: 'En cours', average: 15.22, rank: 5, maxRank: 35 },
  ];

  const badges = [
    { id: 1, title: 'Élève Assidu', icon: 'calendar-check', color: '#10B981', earned: true },
    { id: 2, title: 'Top 5 Classe', icon: 'trophy', color: '#F59E0B', earned: true },
    { id: 3, title: 'Progression +', icon: 'trending-up', color: '#8B5CF6', earned: true },
    { id: 4, title: 'Excellence', icon: 'star', color: '#EF4444', earned: false },
    { id: 5, title: 'Participation', icon: 'hand-right', color: '#3B82F6', earned: true },
    { id: 6, title: 'Travail Équipe', icon: 'account-group', color: '#EC4899', earned: false },
  ];

  const handleEditProfile = () => {
    Alert.alert('Modifier le profil', 'Fonctionnalité en développement');
  };

  const handleChangePassword = () => {
    Alert.alert('Changer le mot de passe', 'Redirection vers la page de sécurité');
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => router.push('/') }
      ]
    );
  };

  const handleHelp = () => {
    Alert.alert('Aide & Support', 'Contactez support@lycee.edu');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec photo de profil */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#1F2937" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Mon Profil</Text>
          
          <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
            <Ionicons name="create-outline" size={24} color="#8B5CF6" />
          </TouchableOpacity>
        </View>

        {/* Section Photo et Infos principales */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: studentData.profileImage }} 
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={18} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.studentName}>{studentData.name}</Text>
          <Text style={styles.studentClass}>{studentData.class} • {studentData.school}</Text>
          <Text style={styles.studentMatricule}>Matricule: {studentData.matricule}</Text>
        </View>

        {/* Statistiques rapides */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#F0F9FF' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#3B82F6' }]}>
              <MaterialCommunityIcons name="chart-line" size={22} color="white" />
            </View>
            <Text style={styles.statValue}>{statistics.average}</Text>
            <Text style={styles.statLabel}>Moyenne</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(statistics.average / 20) * 100}%`, backgroundColor: '#3B82F6' }]} />
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#F0FDF4' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#10B981' }]}>
              <Ionicons name="checkmark-circle" size={22} color="white" />
            </View>
            <Text style={styles.statValue}>{statistics.attendance}%</Text>
            <Text style={styles.statLabel}>Présence</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${statistics.attendance}%`, backgroundColor: '#10B981' }]} />
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FFF7ED' }]}>
            <View style={[styles.statIconContainer, { backgroundColor: '#F59E0B' }]}>
              <Ionicons name="time" size={22} color="white" />
            </View>
            <Text style={styles.statValue}>{statistics.lateCount}</Text>
            <Text style={styles.statLabel}>Retards</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '40%', backgroundColor: '#F59E0B' }]} />
            </View>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <View style={styles.infoCard}>
            <InfoRow 
              icon="person" 
              label="Nom complet" 
              value={studentData.fullName}
              iconColor="#8B5CF6"
            />
            <View style={styles.divider} />
            
            <InfoRow 
              icon="calendar" 
              label="Date de naissance" 
              value={studentData.birthDate}
              iconColor="#3B82F6"
            />
            <View style={styles.divider} />
            
            <InfoRow 
              icon="mail" 
              label="Email" 
              value={studentData.email}
              iconColor="#10B981"
            />
            <View style={styles.divider} />
            
            <InfoRow 
              icon="call" 
              label="Contact parent" 
              value={studentData.parentContact}
              iconColor="#F59E0B"
            />
            <View style={styles.divider} />
            
            <InfoRow 
              icon="male-female" 
              label="Sexe" 
              value={studentData.gender}
              iconColor="#EC4899"
              isMaterial
            />
          </View>
        </View>

        {/* Section scolaire */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations scolaires</Text>
          
          <View style={styles.infoCard}>
            <InfoRow 
              icon="school" 
              label="Classe actuelle" 
              value={studentData.class}
              iconColor="#8B5CF6"
            />
            <View style={styles.divider} />
            
            <InfoRow 
              icon="person" 
              label="Professeur principal" 
              value={studentData.mainTeacher}
              iconColor="#3B82F6"
            />
            <View style={styles.divider} />
            
            <InfoRow 
              icon="trophy" 
              label="Rang dans la classe" 
              value={`${studentData.classRank}ème / 35`}
              iconColor="#F59E0B"
            />
            <View style={styles.divider} />
            
            <InfoRow 
              icon="book" 
              label="Matières suivies" 
              value={`${studentData.totalSubjects} matières`}
              iconColor="#10B981"
            />
          </View>
        </View>

        {/* Mon Parcours - Moyennes par trimestre */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mon Parcours</Text>
          
          {trimesterData.map((trimester, index) => (
            <View key={index} style={styles.trimesterCard}>
              <View style={styles.trimesterHeader}>
                <View>
                  <Text style={styles.trimesterPeriod}>{trimester.period}</Text>
                  <Text style={styles.trimesterRank}>Rang: {trimester.rank}ème / {trimester.maxRank}</Text>
                </View>
                <View style={styles.trimesterAverageContainer}>
                  <Text style={styles.trimesterAverage}>{trimester.average}</Text>
                  <Text style={styles.trimesterAverageLabel}>/20</Text>
                </View>
              </View>
              <View style={styles.trimesterProgressBar}>
                <View 
                  style={[
                    styles.trimesterProgressFill, 
                    { width: `${(trimester.average / 20) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          ))}
        </View>

        {/* Badges académiques */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes badges</Text>
          
          <View style={styles.badgesGrid}>
            {badges.map((badge) => (
              <View 
                key={badge.id} 
                style={[
                  styles.badgeCard,
                  { opacity: badge.earned ? 1 : 0.4 }
                ]}
              >
                <View style={[styles.badgeIconContainer, { backgroundColor: badge.color + '20' }]}>
                  <MaterialCommunityIcons 
                    name={badge.icon as any} 
                    size={28} 
                    color={badge.earned ? badge.color : '#9CA3AF'} 
                  />
                </View>
                <Text style={styles.badgeTitle}>{badge.title}</Text>
                {badge.earned && (
                  <View style={styles.earnedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={badge.color} />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Paramètres et Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres</Text>
          
          <View style={styles.settingsCard}>
            <TouchableOpacity style={styles.settingRow} onPress={handleChangePassword}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#DBEAFE' }]}>
                  <Ionicons name="lock-closed" size={20} color="#3B82F6" />
                </View>
                <Text style={styles.settingLabel}>Changer le mot de passe</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEF3C7' }]}>
                  <Ionicons name="notifications" size={20} color="#F59E0B" />
                </View>
                <Text style={styles.settingLabel}>Notifications</Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#D1D5DB', true: '#8B5CF6' }}
                thumbColor={notificationsEnabled ? '#FFFFFF' : '#F3F4F6'}
              />
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={handleHelp}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#D1FAE5' }]}>
                  <Ionicons name="help-circle" size={20} color="#10B981" />
                </View>
                <Text style={styles.settingLabel}>Aide & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEE2E2' }]}>
                  <Ionicons name="log-out" size={20} color="#EF4444" />
                </View>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Déconnexion</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Accueil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="book-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Cours</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="chatbubble-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navLabel}>Messages</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.navIconActive}>
            <Ionicons name="person" size={24} color="#8B5CF6" />
          </View>
          <Text style={styles.navLabelActive}>Profil</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

interface InfoRowProps {
  icon: string;
  label: string;
  value: string | number;
  iconColor: string;
  isMaterial?: boolean;
}

// Composant réutilisable pour les lignes d'information
const InfoRow = ({ icon, label, value, iconColor, isMaterial = false }: InfoRowProps) => {
  const IconComponent = isMaterial ? MaterialCommunityIcons : Ionicons;
  
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={[styles.infoIcon, { backgroundColor: iconColor + '20' }]}>
          <IconComponent name={icon as any} size={18} color={iconColor} />
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Section Photo de profil
  profileSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#E5E7EB',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 6,
  },
  studentClass: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 4,
  },
  studentMatricule: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Statistiques
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
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
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 14,
  },

  // Card d'informations
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    marginLeft: 10,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginHorizontal: 14,
  },

  // Trimestre Cards
  trimesterCard: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  trimesterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  trimesterPeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  trimesterRank: {
    fontSize: 13,
    color: '#6B7280',
  },
  trimesterAverageContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  trimesterAverage: {
    fontSize: 28,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  trimesterAverageLabel: {
    fontSize: 16,
    color: '#9CA3AF',
    fontWeight: '600',
    marginLeft: 2,
  },
  trimesterProgressBar: {
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  trimesterProgressFill: {
    height: '100%',
    backgroundColor: '#8B5CF6',
    borderRadius: 4,
  },

  // Badges
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '30.5%',
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  badgeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  earnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  // Paramètres
  settingsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },

  // Bottom Navigation
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    paddingBottom: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  navIconActive: {
    backgroundColor: '#F3E8FF',
    padding: 8,
    borderRadius: 12,
    marginBottom: 4,
  },
  navLabelActive: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  navLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 8,
  },
});