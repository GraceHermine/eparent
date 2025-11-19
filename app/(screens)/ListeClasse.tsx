// app/TakeAttendance.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useRouter, SearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSearchParams } from 'expo-router/build/hooks';

export default function TakeAttendance() {
  const router = useRouter();
  useSearchParams(); // récupère l'id de la classe

  // Exemple : liste des élèves par classe (à remplacer par API ou base de données)
  const [students, setStudents] = useState([
    { id: '1', name: 'Fatou Keita', present: false },
    { id: '2', name: 'Moussa Diallo', present: false },
    { id: '3', name: 'Awa Koné', present: false },
    { id: '4', name: 'Ibrahim Traoré', present: false },
  ]);

  const toggleAttendance = (id: string) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, present: !student.present } : student
      )
    );
  };

  const saveAttendance = () => {
    // Ici tu peux appeler ton API pour sauvegarder les présences
    Alert.alert('Succès', 'Présences enregistrées !');
  };

  const renderItem = ({ item }: { item: { id: string; name: string; present: boolean } }) => (
    <TouchableOpacity style={styles.studentCard} onPress={() => toggleAttendance(item.id)}>
      <Text style={styles.studentName}>{item.name}</Text>
      <Ionicons
        name={item.present ? 'checkmark-circle' : 'close-circle'}
        size={28}
        color={item.present ? '#10B981' : '#EF4444'}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#3D22D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Prise de présence</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Liste des élèves */}
      <FlatList
        data={students}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      {/* Bouton enregistrer */}
      <TouchableOpacity style={styles.saveButton} onPress={saveAttendance}>
        <Text style={styles.saveButtonText}>Enregistrer la présence</Text>
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
  listContainer: { padding: 16 },
  studentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  studentName: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  saveButton: {
    backgroundColor: '#3D22D4',
    padding: 16,
    margin: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
