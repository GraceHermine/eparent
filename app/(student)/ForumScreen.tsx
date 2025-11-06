import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Forum {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap; // Pour les icônes dynamiques
  description?: string; // Optionnel pour plus de détails
}

const forumsData: Forum[] = [
  {
    id: '1',
    title: 'Big Family',
    icon: 'people-outline',
    description: 'Forum pour parents, profs, administrateur et échanges quotidiens (inspiré des communautés comme Happy Family).',
  },
  {
    id: '2',
    title: 'Groupe des parents de la Second C',
    icon: 'school-outline',
    description: 'Discussions sur la scolarité et événements de la classe.',
  },
  {
    id: '3',
    title: 'Conseils - École & Famille',
    icon: 'chatbubble-ellipses-outline',
    description: 'Forum officiel pour parents d\'élèves (échanges et conseils).',
  },
  {
    id: '4',
    title: 'Association Des délègueés',
    icon: 'home-outline',
    description: 'Chers chefs de classe, partages et débats sur tout les sujets.',
  },
  // Ajoute-en d'autres ou charge dynamiquement
];

interface Props {
  navigation?: {
    goBack: () => void;
  };
}

export default function ForumsScreen({ navigation }: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [newForumTitle, setNewForumTitle] = useState('');

  const renderForumItem = ({ item }: { item: Forum }) => (
    <TouchableOpacity
      style={styles.forumItem}
      onPress={() => {
        router.push('/screens/ForumDetailScreen')}}
      
    >
      <Ionicons name={item.icon} size={24} color="#4A6BFF" />
      <View style={styles.forumContent}>
        <Text style={styles.forumTitle}>{item.title}</Text>
        {item.description && <Text style={styles.forumDescription}>{item.description}</Text>}
      </View>
    </TouchableOpacity>
  );

  const handleCreateForum = () => {
    if (newForumTitle.trim()) {
      // Ajoute le nouveau forum (ex: via API ou state global)
      Alert.alert('Forum créé', `"${newForumTitle}" ajouté !`);
      setNewForumTitle('');
      setModalVisible(false);
    } else {
      Alert.alert('Erreur', 'Entrez un nom pour le forum.');
    }
  };

  const loadMoreForums = () => {
    // Logique pour charger plus (ex: API call)
    console.log('Chargement de plus de forums...');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="arrow-back" size={28} color="#4A6BFF" />
        </TouchableOpacity>

        <Text style={styles.title}>Forums</Text>

        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={32} color="#4A6BFF" />
        </TouchableOpacity>
      </View>

      {/* Liste des forums */}
      <FlatList
        data={forumsData}
        renderItem={renderForumItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreForums}
        onEndReachedThreshold={0.5}
      />

      {/* Modal Créer un forum */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau Forum</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Nom du forum (ex: Groupe Maths)"
              value={newForumTitle}
              onChangeText={setNewForumTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.buttonCancel}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonCreate}
                onPress={handleCreateForum}
              >
                <Text style={[styles.buttonText, styles.buttonTextPrimary]}>Créer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  listContainer: {
    padding: 20,
  },
  forumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#4A6BFF',
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#4A6BFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  forumContent: {
    flex: 1,
    marginLeft: 12,
  },
  forumTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  forumDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonCancel: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  buttonCreate: {
    flex: 1,
    padding: 12,
    backgroundColor: '#4A6BFF',
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonText: {
    color: '#333',
    fontWeight: '500',
  },
  buttonTextPrimary: {
    color: '#fff',
  },
});