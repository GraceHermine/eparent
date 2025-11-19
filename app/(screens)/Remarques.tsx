// app/(prof)/screens/Remarques.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Remarques() {
  const router = useRouter();

  // Exemple : liste des élèves
  const students = [
    { id: '1', name: 'Alice Kouadio' },
    { id: '2', name: 'Jean Koffi' },
    { id: '3', name: 'Fatou Bamba' },
  ];

  // Stocke les remarques par élève
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});

  const handleChange = (id: string, text: string) => {
    setRemarks(prev => ({ ...prev, [id]: text }));
  };

  const handleSave = () => {
    console.log('Remarques enregistrées:', remarks);
    Alert.alert('Succès', 'Remarques enregistrées avec succès !');
  };

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <View style={styles.studentCard}>
      <Text style={styles.studentName}>{item.name}</Text>
      <TextInput
        style={styles.input}
        placeholder="Écrire une remarque..."
        value={remarks[item.id] || ''}
        onChangeText={text => handleChange(item.id, text)}
        multiline
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#3D22D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Remarques</Text>
        <View style={{ width: 28 }} /> {/* Placeholder */}
      </View>

      {/* Liste des élèves avec champs de remarques */}
      <FlatList
        data={students}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Bouton enregistrer */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: 'space-between',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#3D22D4' },
  listContainer: { padding: 16, paddingBottom: 80 },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  studentName: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 8 },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    minHeight: 50,
    textAlignVertical: 'top',
  },
  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#3D22D4',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
