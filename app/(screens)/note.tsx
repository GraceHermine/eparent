// app/ManageGrades.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, SearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSearchParams } from 'expo-router/build/hooks';

export default function ManageGrades() {
  const router = useRouter();
  const { classI }: any = useSearchParams();

  // Exemple d'élèves
  const [students, setStudents] = useState([
    { id: '1', matricule: '16352157B', name: 'Ali Koné', devoir1: '', devoir2: '', devoir3: '', interrogation1: '', bonus: '' },
    { id: '2', matricule: 'MAT002', name: 'Fatou Diallo', devoir1: '', devoir2: '', devoir3: '', interrogation1: '', bonus: '' },
    { id: '3', matricule: 'MAT003', name: 'Mamadou Traoré', devoir1: '', devoir2: '', devoir3: '', interrogation1: '', bonus: '' },
  ]);

  const handleChange = (id: string, field: string, value: string) => {
    setStudents(prev =>
      prev.map(student => student.id === id ? { ...student, [field]: value } : student)
    );
  };

  const handleSave = () => {
    console.log('Notes enregistrées pour la classe', classI, students);
    alert('Notes enregistrées avec succès !');
    router.back();
  };

  const renderItem = ({ item }: { item: typeof students[0] }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 1 }]}>{item.matricule}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={item.devoir1} onChangeText={(v) => handleChange(item.id, 'devoir1', v)} placeholder="0" />
      <TextInput style={styles.input} keyboardType="numeric" value={item.devoir2} onChangeText={(v) => handleChange(item.id, 'devoir2', v)} placeholder="0" />
      <TextInput style={styles.input} keyboardType="numeric" value={item.devoir3} onChangeText={(v) => handleChange(item.id, 'devoir3', v)} placeholder="0" />
      <TextInput style={styles.input} keyboardType="numeric" value={item.interrogation1} onChangeText={(v) => handleChange(item.id, 'interrogation1', v)} placeholder="0" />
      <TextInput style={styles.input} keyboardType="numeric" value={item.bonus} onChangeText={(v) => handleChange(item.id, 'bonus', v)} placeholder="0" />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#3D22D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestion des notes</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView horizontal>
        <View>
          {/* Header du tableau */}
          <View style={styles.row}>
            <Text style={[styles.cell, { flex: 1,  }]}>Matricule</Text>
            <Text style={[styles.cell, { flex: 2,  }]}>Nom</Text>
            <Text style={styles.cell}>D1</Text>
            <Text style={styles.cell}>D2</Text>
            <Text style={styles.cell}>D3</Text>
            <Text style={styles.cell}>I1</Text>
            <Text style={styles.cell}>Bonus</Text>
          </View>

          <FlatList
            data={students}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
          />
        </View>
      </ScrollView>

      {/* Bouton Enregistrer */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Enregistrer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingBottom: 100 },
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 12,
  },
  cell: {
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  input: {
    width: 50,
    height: 40,
    borderWidth: 1,
    borderColor: '#3D22D4',
    borderRadius: 8,
    textAlign: 'center',
    marginHorizontal: 4,
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
  saveButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
