import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Switch, Alert, Dimensions, ActivityIndicator} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { authService } from '../../services/authService';
import { coreService } from '../../services/core';


const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40; // Largeur de la carte avec marges

export default function ParentProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    average: 0,
    attendance: 0,
    behavior: "Bon",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const userData = await authService.getMe();
      setUser(userData);

      const childrenData = await coreService.getMyChildren();
      setChildren(childrenData);

      if (childrenData.length > 0) {
        updateChildStats(childrenData[0].id);
      }
    } catch (error) {
      console.error("Erreur profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateChildStats = async (studentId: number) => {
    try {
      // On récupère les notes pour calculer la moyenne
      const grades = await coreService.getStudentGrades(studentId);
      const attendances = await coreService.getStudentAttendances(studentId);

      let avg = 0;
      if (grades.length > 0) {
        const sum = grades.reduce((acc: number, g: any) => acc + parseFloat(g.value), 0);
        avg = sum / grades.length;
      }

      // Simulation de présence (basée sur le nombre d'absences par exemple)
      const attendanceRate = Math.max(0, 100 - (attendances.length * 5));

      setStats({
        average: parseFloat(avg.toFixed(2)),
        attendance: attendanceRate,
        behavior: "Bon",
      });
    } catch (e) {
      console.error("Erreur stats enfant:", e);
    }
  };

  const handleScroll = (event: any) => {
    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / CARD_WIDTH);
    if (index !== activeIndex && index < children.length) {
      setActiveIndex(index);
      updateChildStats(children[index].id);
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion", style: "destructive", onPress: async () => {
          await authService.logout();
          router.replace("/(auth)/LoginScreen");
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/******** HEADER ********/}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#1F2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profil Parent</Text>
          <View style={{ width: 40 }} />
        </View>

        {/******** SECTION PARENT ********/}
        <View style={styles.card}>
          <Text style={styles.title}>Informations Personnelles</Text>
          <InfoRow icon="person" label="Nom" value={`${user?.first_name} ${user?.last_name}`} color="#8B5CF6" />
          <Divider />
          <InfoRow icon="mail" label="Email" value={user?.email} color="#3B82F6" />
          <Divider />
          <InfoRow icon="briefcase" label="Rôle" value="Parent" color="#F97316" />
        </View>

        {/******** SECTION ENFANTS (CARROUSEL) ********/}
        <View style={{ marginTop: 25,  marginBottom: 25}}>
          <View style={styles.sectionHeader}>
            <Text style={styles.title}>Enfant(s) suivi(s)</Text>
            {children.length > 1 && (
              <View style={styles.paginationDots}>
                {children.map((_, i) => (
                  <View key={i} style={[styles.dot, activeIndex === i && styles.activeDot]} />
                ))}
              </View>
            )}
          </View>

          <ScrollView horizontal pagingEnabled  showsHorizontalScrollIndicator={false}  onMomentumScrollEnd={handleScroll}  snapToInterval={CARD_WIDTH + 20}
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: 20 }} >
            {children.length > 0 ? (
              children.map((item) => (
                <View key={item.id} style={styles.carouselItem}>
                  <View style={styles.childCardInternal}>
                    <InfoRow icon="school" label="Prénom & Nom" value={`${item.first_name} ${item.last_name}`} color="#8B5CF6" />
                    <Divider />
                    <InfoRow icon="calendar" label="Naissance" value={new Date(item.date_of_birth).toLocaleDateString()} color="#3B82F6" />
                    <Divider />
                    <InfoRow icon="book" label="Classe" value={item.current_class?.name || "Non assigné"} color="#10B981" />
                    
                    <TouchableOpacity 
                      style={styles.buttonDetails}
                      onPress={() => router.push({ pathname: "/(screens)/InfoScreen" as any, params: { studentId: item.id } })}
                    >
                      <Text style={styles.buttonDetailsText}>Consulter le carnet</Text>
                      <Ionicons name="chevron-forward" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={[styles.carouselItem, styles.emptyCard]}>
                <Text style={{ color: '#9CA3AF' }}>Aucun enfant rattaché</Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/******** STATISTIQUES DYNAMIQUE ********/}
        <Text style={[styles.title, { marginTop: 25, marginLeft: 20 }]}>Performances actuelles</Text>
        <View style={styles.statsContainer}>
          <StatCard icon="star" label="Moyenne" value={stats.average.toString()} color="#8B5CF6" />
          <StatCard icon="checkmark-circle" label="Présence" value={stats.attendance + '%'} color="#10B981" />
          <StatCard icon="heart" label="Comportement" value={stats.behavior} color="#F59E0B" />
        </View>

        {/******** PARAMÈTRES ********/}
        <View style={[styles.card, { marginTop: 25, marginBottom: 40 }]}>
          <Text style={styles.title}>Paramètres du compte</Text>
          <SettingRow icon="lock-closed" label="Changer de mot passe" color="#3B82F6" onPress={() => {}} />
          <Divider />
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="notifications" size={18} color="#F59E0B" />
              </View>
              <Text style={styles.settingLabel}>Notification</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#D1D5DB", true: "#8B5CF6" }}
            />
          </View>
          <Divider />
          <SettingRow icon="log-out" label="Déconnexion" color="#EF4444" onPress={handleLogout} red />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- SOUS-COMPOSANTS ---

const InfoRow = ({ icon, label, value, color }: any) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <View style={[styles.infoIcon, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
  </View>
);

const SettingRow = ({ icon, label, color, onPress, red }: any) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress}>
    <View style={styles.settingLeft}>
      <View style={[styles.settingIcon, { backgroundColor: color + "15" }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.settingLabel, red && { color }]}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={red ? color : "#9CA3AF"} />
  </TouchableOpacity>
);

const StatCard = ({ icon, label, value, color }: any) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconCircle, { backgroundColor: color + "15" }]}>
      <Ionicons name={icon} size={22} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;

// --- STYLES ---

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA", marginTop: 20 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    padding: 20, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F3F4F6'
  },
  backButton: { width: 40, height: 40, backgroundColor: "#F3F4F6", borderRadius: 20, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937" },
  
  card: { backgroundColor: "white", marginTop: 20, marginHorizontal: 20, padding: 16, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  title: { fontSize: 17, fontWeight: "700", color: "#1F2937", marginBottom: 15 },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20 },
  paginationDots: { flexDirection: 'row', gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#D1D5DB' },
  activeDot: { width: 15, backgroundColor: '#8B5CF6' },

  carouselItem: { width: CARD_WIDTH, marginRight: 20, marginBottom: 20 },
  childCardInternal: { backgroundColor: "white", padding: 16, borderRadius: 22, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, borderWidth: 1, borderColor: '#F3F4F6' },
  emptyCard: { height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 20, borderStyle: 'dashed', borderWidth: 1 },
  
  infoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  infoLeft: { flexDirection: "row", alignItems: "center" },
  infoIcon: { width: 34, height: 34, borderRadius: 10, justifyContent: "center", alignItems: "center", marginRight: 12 },
  infoLabel: { fontSize: 14, color: "#6B7280" },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#1F2937" },
  divider: { height: 1, backgroundColor: "#F9FAFB", marginVertical: 2 },

  statsContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10 },
  statCard: { width: "31%", backgroundColor: "white", borderRadius: 20, padding: 15, alignItems: "center", elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 },
  statIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 16, fontWeight: "700", color: "#1F2937" },
  statLabel: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  settingLeft: { flexDirection: "row", alignItems: "center" },
  settingIcon: { width: 36, height: 36, borderRadius: 12, justifyContent: "center", alignItems: "center", marginRight: 12 },
  settingLabel: { fontSize: 15, fontWeight: "600", color: "#1F2937" },

  buttonDetails: { marginTop: 15, backgroundColor: "#8B5CF6", paddingVertical: 12, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  buttonDetailsText: { color: "white", fontWeight: "700", fontSize: 14 },
});