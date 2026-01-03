// app/ManageGrades.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter, SearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSearchParams } from 'expo-router/build/hooks';

import { coreService } from '../../services/core';

export default function ManageGrades() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get('classId');
  const subjectId = searchParams.get('subjectId');

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load students on mount
  React.useEffect(() => {
    if (classId) loadStudents();
  }, [classId]);

  const loadStudents = async () => {
    try {
      const data = await coreService.getClassStudents(classId);
      // Init empty grades for UI
      const mapped = data.map((s: any) => ({
        ...s,
        devoir1: '', devoir2: '', devoir3: '', interrogation1: '', bonus: ''
      }));
      setStudents(mapped);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleChange = (id: string, field: string, value: string) => {
    setStudents(prev =>
      prev.map(student => student.id === id ? { ...student, [field]: value } : student)
    );
  };

  const handleSave = async () => {
    if (!subjectId) {
      alert("Erreur: Aucune matière détectée via la classe sélectionnée.");
      return;
    }
    setLoading(true);
    try {
      // Iterate students and check for filled grades
      for (const student of students) {
        if (student.devoir1) await sendGrade(student.id, 'DEVOIR', 'Devoir 1', student.devoir1);
        if (student.devoir2) await sendGrade(student.id, 'DEVOIR', 'Devoir 2', student.devoir2);
        if (student.devoir3) await sendGrade(student.id, 'DEVOIR', 'Devoir 3', student.devoir3);
        if (student.interrogation1) await sendGrade(student.id, 'INTERROGATION', 'Interro 1', student.interrogation1);
        if (student.bonus) await sendGrade(student.id, 'BONUS', 'Bonus', student.bonus);
      }
      alert('Notes enregistrées avec succès !');
      router.back();
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const sendGrade = async (studentId: any, type: string, description: string, value: string) => {
    await coreService.createGrade({
      student: studentId,
      subject: subjectId,
      value: parseFloat(value),
      type: type,
      coef: 1,
      description: description,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 1 }]}>{item.matricule || '?'}</Text>
      <Text style={[styles.cell, { flex: 2 }]}>{item.first_name} {item.last_name}</Text>
      <TextInput style={styles.input} keyboardType="numeric" value={item.devoir1} onChangeText={(v) => handleChange(item.id, 'devoir1', v)} placeholder="-" />
      <TextInput style={styles.input} keyboardType="numeric" value={item.devoir2} onChangeText={(v) => handleChange(item.id, 'devoir2', v)} placeholder="-" />
      <TextInput style={styles.input} keyboardType="numeric" value={item.devoir3} onChangeText={(v) => handleChange(item.id, 'devoir3', v)} placeholder="-" />
      <TextInput style={styles.input} keyboardType="numeric" value={item.interrogation1} onChangeText={(v) => handleChange(item.id, 'interrogation1', v)} placeholder="-" />
      <TextInput style={styles.input} keyboardType="numeric" value={item.bonus} onChangeText={(v) => handleChange(item.id, 'bonus', v)} placeholder="-" />
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && <View style={{ position: 'absolute', zIndex: 10, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)' }}><ActivityIndicator size="large" color="#3D22D4" /></View>}
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
            <Text style={[styles.cell, { flex: 1, }]}>Matricule</Text>
            <Text style={[styles.cell, { flex: 2, }]}>Nom</Text>
            <Text style={styles.cell}>D1</Text>
            <Text style={styles.cell}>D2</Text>
            <Text style={styles.cell}>D3</Text>
            <Text style={styles.cell}>I1</Text>
            <Text style={styles.cell}>Bonus</Text>
          </View>

          <FlatList
            data={students}
            keyExtractor={(item) => item.id.toString()}
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
