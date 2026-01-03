import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, SafeAreaView, StatusBar,
  TouchableOpacity, ScrollView, Switch, Alert
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { authService } from '../../services/authService';
import { coreService } from '../../services/core';

export default function ParentProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Stats par défaut (simulées pour l'instant car l'API ne renvoie pas encore de stats agrégées)
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
      const userData = await authService.getMe();
      setUser(userData);

      const children = await coreService.getMyChildren();
      if (children.length > 0) {
        setChild(children[0]); // Affiche le premier enfant par défaut

        // Calcul rapide de la moyenne (exemple)
        const grades = await coreService.getStudentGrades(children[0].id);
        if (grades.length > 0) {
          const sum = grades.reduce((acc: number, g: any) => acc + parseFloat(g.value), 0);
          const avg = sum / grades.length;
          setStats(prev => ({ ...prev, average: parseFloat(avg.toFixed(2)) }));
        }
      }
    } catch (error) {
      console.error("Erreur profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Déconnexion", style: "destructive", onPress: async () => {
          await authService.logout();
          router.replace("/");
        }
      }
    ]);
  };

  if (loading) return <View style={styles.container}><Text>Chargement...</Text></View>;

  // Valeurs d'affichage
  const parentName = user ? `${user.first_name} ${user.last_name}` : "Non connecté";
  const parentEmail = user ? user.email : "";
  const parentRole = user ? (user.role === 'PARENT' ? "Parent" : user.role) : "";

  const childName = child ? `${child.first_name} ${child.last_name}` : "Aucun enfant";
  const childClass = child?.current_class ? `${child.current_class.name}` : "Non assigné";
  const childSchool = child?.current_class ? child.current_class.school_name : "Non assigné";
  const childBirth = child ? new Date(child.date_of_birth).toLocaleDateString() : "";

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
          <Text style={styles.title}>Informations du Parent</Text>

          <InfoRow icon="person" label="Nom" value={parentName} color="#8B5CF6" />
          <Divider />
          <InfoRow icon="mail" label="Email" value={parentEmail} color="#3B82F6" />
          <Divider />
          <InfoRow icon="briefcase" label="Rôle" value={parentRole} color="#F97316" />
        </View>

        {/******** SECTION ENFANT ********/}
        <View style={styles.card}>
          <Text style={styles.title}>Enfant Suivi</Text>

          <InfoRow icon="school" label="Nom" value={childName} color="#8B5CF6" />
          <Divider />
          <InfoRow icon="calendar" label="Date de naissance" value={childBirth} color="#3B82F6" />
          <Divider />
          <InfoRow icon="book" label="Classe" value={childClass} color="#10B981" />
          <Divider />
          <InfoRow icon="business" label="École" value={childSchool} color="#F59E0B" />
        </View>

        {/******** STATISTIQUES ENFANT ********/}
        <Text style={[styles.title, { marginTop: 20, marginLeft: 20 }]}>Suivi scolaire</Text>

        <View style={styles.statsContainer}>
          <StatCard
            icon="star"
            label="Moyenne"
            value={stats.average.toString()}
            color="#8B5CF6"
          />
          <StatCard
            icon="checkmark-circle"
            label="Présence"
            value={stats.attendance + '%'}
            color="#10B981"
          />
          <StatCard
            icon="heart"
            label="Comportement"
            value={stats.behavior}
            color="#F59E0B"
          />
        </View>

        {/******** PARAMÈTRES ********/}
        <View style={[styles.card, { marginTop: 20 }]}>
          <Text style={styles.title}>Paramètres</Text>

          {/* Mot de passe */}
          <SettingRow
            icon="lock-closed"
            label="Changer le mot de passe"
            color="#3B82F6"
            onPress={() => router.push("/(auth)/PasswordScreen")}
          />

          <Divider />

          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: "#FEF3C7" }]}>
                <Ionicons name="notifications" size={18} color="#F59E0B" />
              </View>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>

            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#D1D5DB", true: "#8B5CF6" }}
            />
          </View>

          <Divider />

          {/* Déconnexion */}
          <SettingRow
            icon="log-out"
            label="Déconnexion"
            color="#EF4444"
            onPress={handleLogout}
            red
          />
        </View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/******************* COMPONENTS *******************/

type InfoRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
};

const InfoRow = ({ icon, label, value, color }: InfoRowProps) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <View style={[styles.infoIcon, { backgroundColor: color + "22" }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  onPress: () => void;
  red?: boolean;
};

const SettingRow = ({ icon, label, color, onPress, red = false }: SettingRowProps) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress}>
    <View style={styles.settingLeft}>
      <View style={[styles.settingIcon, { backgroundColor: color + "22" }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
      <Text style={[styles.settingLabel, red && { color }]}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={red ? "#EF4444" : "#9CA3AF"} />
  </TouchableOpacity>
);

type StatCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color: string;
};

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <View style={styles.statCard}>
    <Ionicons name={icon} size={26} color={color} />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const Divider = () => <View style={styles.divider} />;


/******************* STYLES *******************/
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomColor: "#E5E7EB",
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40, height: 40, backgroundColor: "#F3F4F6",
    borderRadius: 20, justifyContent: "center", alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1F2937" },

  card: {
    backgroundColor: "white",
    marginTop: 20,
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 18,
    elevation: 2,
  },
  title: { fontSize: 17, fontWeight: "700", marginBottom: 12, color: "#1F2937" },

  infoRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingVertical: 14,
  },
  infoLeft: { flexDirection: "row", alignItems: "center" },
  infoIcon: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: "center", alignItems: "center", marginRight: 10,
  },
  infoLabel: { fontSize: 14, color: "#6B7280", width: 130 },
  infoValue: { fontSize: 14, fontWeight: "600", color: "#1F2937", flexShrink: 1, textAlign: "right" },
  divider: { height: 1, backgroundColor: "#F3F4F6" },

  statsContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginTop: 10 },
  statCard: {
    width: "30%", backgroundColor: "white",
    borderRadius: 16, paddingVertical: 16, alignItems: "center",
    elevation: 2,
  },
  statValue: { fontSize: 18, fontWeight: "700", color: "#1F2937", marginTop: 6 },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  settingRow: {
    flexDirection: "row", justifyContent: "space-between",
    alignItems: "center", paddingVertical: 14,
  },
  settingLeft: { flexDirection: "row", alignItems: "center" },
  settingIcon: {
    width: 36, height: 36, borderRadius: 18,
    justifyContent: "center", alignItems: "center", marginRight: 10,
  },
  settingLabel: { fontSize: 15, fontWeight: "600", color: "#1F2937" },

  buttonDetails: {
    marginTop: 16,
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDetailsText: { color: "white", fontWeight: "700", marginRight: 10 },
});