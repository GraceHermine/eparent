// app/(prof)/screens/Remarques.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { coreService } from '../../services/core';

export default function Remarques() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const classId = params.classId as string;
  const subjectId = params.subjectId as string;

  const [students, setStudents] = useState<any[]>([]);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) loadStudents();
  }, [classId]);

  const loadStudents = async () => {
    try {
      const data = await coreService.getClassStudents(classId);
      setStudents(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleChange = (id: string, text: string) => {
    setRemarks(prev => ({ ...prev, [id]: text }));
  };

  const handleSave = async () => {
    if (!subjectId) {
      Alert.alert("Erreur", "Matière introuvable.");
      return;
    }

    // Filter students who have a remark text
    const entries = Object.entries(remarks).filter(([k, v]) => v.trim().length > 0);
    if (entries.length === 0) {
      Alert.alert("Info", "Aucune remarque à enregistrer.");
      return;
    }

    try {
      setLoading(true);
      for (const [studentId, text] of entries) {
        await coreService.createObservation({
          student: studentId,
          subject: subjectId,
          text: text
        });
      }
      Alert.alert('Succès', 'Remarques enregistrées avec succès !');
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erreur", "Échec de l'enregistrement des remarques.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.studentCard}>
      <Text style={styles.studentName}>{item.first_name} {item.last_name}</Text>
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
      {loading && <View style={styles.loadingOverlay}><ActivityIndicator size="large" color="#3D22D4" /></View>}
      {/* Header avec bouton retour */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#3D22D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Remarques</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Liste des élèves avec champs de remarques */}
      <FlatList
        data={students}
        keyExtractor={item => item.id.toString()}
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
  loadingOverlay: { position: 'absolute', zIndex: 10, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)' },
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
