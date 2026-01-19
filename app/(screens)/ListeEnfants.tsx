import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Import de votre service et de l'instance API
import { coreService } from '../../services/core';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  classroom_name?: string;
}

export default function ListeEnfants() {
  const router = useRouter();
  const [children, setChildren] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Utilisation de useCallback pour pouvoir rafraîchir proprement
  const loadChildren = useCallback(async () => {
    try {
      setRefreshing(true);
      const data = await coreService.getMyChildren();
      
      // TRI ALPHABÉTIQUE : Par Nom (last_name) puis par Prénom (first_name)
      const sortedData = data.sort((a: Student, b: Student) => {
        const lastNameCompare = (a.last_name || "").localeCompare(b.last_name || "");
        if (lastNameCompare !== 0) return lastNameCompare;
        return (a.first_name || "").localeCompare(b.first_name || "");
      });

      setChildren(sortedData);
    } catch (error: any) {
      console.error("Erreur chargement enfants:", error);

      // GESTION DE L'ERREUR 401 (Non autorisé / Token expiré)
      if (error.response && error.response.status === 401) {
        Alert.alert(
          "Session expirée", 
          "Votre session a expiré. Veuillez vous reconnecter.",
          [{ text: "OK", onPress: () => router.replace("/(auth)/LoginScreen") }]
        );
      } else {
        Alert.alert("Erreur", "Impossible de récupérer la liste des enfants.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [router]);

  useEffect(() => {
    loadChildren();
  }, [loadChildren]);

  const renderChild = ({ item }: { item: Student }) => (
    <TouchableOpacity 
      activeOpacity={0.85}
      style={styles.childCard}
      onPress={() =>
        router.push({
          pathname: "/(screens)/note",
          params: { studentId: item.id },
        })
      }
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.last_name ? item.last_name[0].toUpperCase() : "?"}
          {item.first_name ? item.first_name[0].toUpperCase() : ""}
        </Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.childName}>
          {item.last_name?.toUpperCase()} {item.first_name}
        </Text>

        <View style={styles.classBadge}>
          <Ionicons name="school-outline" size={13} color="#64748B" />
          <Text style={styles.className}>
            {item.classroom_name || 'Classe non assignée'}
          </Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#CBD5E1" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={15}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Mes Enfants</Text>
          <Text style={styles.headerSubtitle}>Suivi de la scolarité</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#3D22D4" />
          <Text style={styles.loadingText}>Vérification de la session...</Text>
        </View>
      ) : (
        <FlatList
          data={children}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderChild}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={loadChildren}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={80} color="#E2E8F0" />
              <Text style={styles.emptyText}>
                Aucun enfant rattaché à ce compte ou erreur de connexion.
              </Text>
              <TouchableOpacity onPress={loadChildren} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    // marginTop: StatusBar.currentHeight || 0,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  listContent: { padding: 20 },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3D22D4',
  },
  infoContainer: { flex: 1 },
  childName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
    alignSelf: 'flex-start'
  },
  className: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
  emptyContainer: { alignItems: 'center', marginTop: 80, paddingHorizontal: 40 },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#94A3B8',
    fontSize: 15,
    lineHeight: 22,
  },
  retryButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#3D22D4',
    fontWeight: '700',
  }
});