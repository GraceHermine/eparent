import React, { useState } from "react";
import { 
  View, Text, StyleSheet, SafeAreaView, StatusBar, 
  TouchableOpacity, ScrollView, Switch, Alert 
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ParentProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Infos parent
  const parent = {
    name: "Mme Dedjene",
    email: "parent.dedjene@exemple.com",
    phone: "+225 07 22 33 44 55",
    role: "Représentante légale",
  };

  // Infos enfant
  const child = {
    name: "Hermine Dedjene",
    class: "Seconde C",
    school: "Lycée Victor Hugo",
    birthDate: "15 Mars 2009",
  };

  // Statistiques
  const stats = {
    average: 15.22,
    attendance: 94,
    behavior: "Bon",
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Voulez-vous vraiment vous déconnecter ?", [
      { text: "Annuler", style: "cancel" },
      { text: "Déconnexion", style: "destructive", onPress: () => router.push("/") }
    ]);
  };

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

          <InfoRow icon="person" label="Nom" value={parent.name} color="#8B5CF6" />
          <Divider />
          <InfoRow icon="mail" label="Email" value={parent.email} color="#3B82F6" />
          <Divider />
          <InfoRow icon="call" label="Téléphone" value={parent.phone} color="#10B981" />
          <Divider />
          <InfoRow icon="briefcase" label="Rôle" value={parent.role} color="#F97316" />
        </View>

        {/******** SECTION ENFANT ********/}
        <View style={styles.card}>
          <Text style={styles.title}>Enfant Suivi</Text>

          <InfoRow icon="school" label="Nom" value={child.name} color="#8B5CF6" />
          <Divider />
          <InfoRow icon="calendar" label="Date de naissance" value={child.birthDate} color="#3B82F6" />
          <Divider />
          <InfoRow icon="book" label="Classe" value={child.class} color="#10B981" />
          <Divider />
          <InfoRow icon="business" label="École" value={child.school} color="#F59E0B" />
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
