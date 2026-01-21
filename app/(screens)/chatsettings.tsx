import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  Alert, 
  SafeAreaView, 
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ChatSettings() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isEphemeral, setIsEphemeral] = useState(false);

  const handleDelete = () => {
    Alert.alert(
      "Supprimer la conversation",
      "Voulez-vous vraiment supprimer tout l'historique ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Supprimer", 
          style: "destructive", 
          onPress: () => {
            router.replace('/(parent)/MessageScreen'); 
          } 
        }
      ]
    );
  };

  // Le composant interne pour chaque ligne de paramètre
  const SettingItem = ({ icon, title, subtitle, onPress, rightElement, color = "#000" }: any) => (
    <TouchableOpacity 
      style={styles.item} 
      onPress={onPress} 
      disabled={!onPress && !rightElement}
    >
      <View style={styles.itemLeft}>
        <Ionicons name={icon} size={22} color={color} style={styles.icon} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.itemTitle, { color }]}>{title}</Text>
          {subtitle ? <Text style={styles.itemSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightElement ? rightElement : <Ionicons name="chevron-forward" size={18} color="#CCC" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#3D22D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Général</Text>
          <SettingItem 
            icon="search-outline" 
            title="Rechercher" 
            subtitle="Trouver un mot dans la discussion"
            onPress={() => Alert.alert("Recherche", "Fonctionnalité bientôt disponible")} 
          />
          <SettingItem 
            icon="color-palette-outline" 
            title="Thème & Fond d'écran" 
            subtitle="Personnaliser l'apparence du chat"
            onPress={() => router.push('/(screens)/apparence')} 
            />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications et Vie privée</Text>
          <SettingItem 
            icon="notifications-off-outline" 
            title="Mode silencieux" 
            rightElement={
              <Switch 
                value={isMuted} 
                onValueChange={setIsMuted} 
                trackColor={{ false: "#DDD", true: "#3D22D4" }}
                thumbColor={Platform.OS === 'android' ? "#FFF" : undefined}
              />
            }
          />
          <SettingItem 
            icon="timer-outline" 
            title="Messages éphémères" 
            rightElement={
              <Switch 
                value={isEphemeral} 
                onValueChange={setIsEphemeral} 
                trackColor={{ false: "#DDD", true: "#3D22D4" }}
                thumbColor={Platform.OS === 'android' ? "#FFF" : undefined}
              />
            }
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zone rouge</Text>
          <SettingItem 
            icon="trash-outline" 
            title="Supprimer la conversation" 
            color="#FF3B30"
            onPress={handleDelete} 
          />
        </View>

        <View style={{ paddingVertical: 30 }}>
           <Text style={styles.footerInfo}>Conversation ID: {id}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// CETTE PARTIE ÉTAIT SÛREMENT MANQUANTE OU MAL PLACÉE :
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  customHeader: {
    height: 70,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "bold",
    color: "#3D22D4" 
  },
  backBtn: { 
    width: 40 
  },
  section: { 
    marginTop: 20, 
    backgroundColor: '#FFF', 
    borderTopWidth: 0.5, 
    borderBottomWidth: 0.5, 
    borderColor: '#D1D1D6' 
  },
  sectionTitle: { 
    fontSize: 13, 
    color: '#6e6e73', 
    marginLeft: 15, 
    marginBottom: 8, 
    marginTop: 15,
    textTransform: 'uppercase' 
  },
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#E5E5EA' 
  },
  itemLeft: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1
  },
  icon: { 
    marginRight: 15, 
    width: 28, 
    textAlign: 'center' 
  },
  itemTitle: { 
    fontSize: 16, 
    fontWeight: '400' 
  },
  itemSubtitle: { 
    fontSize: 13, 
    color: '#8E8E93', 
    marginTop: 2 
  },
  footerInfo: { 
    textAlign: 'center', 
    color: '#AAA', 
    fontSize: 12 
  },
});