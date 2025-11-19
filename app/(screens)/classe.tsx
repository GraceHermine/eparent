// app/SelectClass.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SelectClass() {
  const router = useRouter();

  const classes = [
    { id: '1', name: '6ieme 2' },
    { id: '2', name: 'Tle D1' },
    { id: '3', name: 'Seconde C' },
    { id: '4', name: '3ieme 4' },
  ];

  const handleAction = (classId: string, action: 'presence' | 'note' | 'remarque') => {
    switch (action) {
      case 'presence':
        router.push('/(screens)/ListeClasse');
        break;
      case 'note':
        router.push('/(screens)/note');
        break;
      case 'remarque':
        router.push('/(screens)/Remarques');
        break;
    }
  };

  const renderItem = ({ item }: { item: { id: string; name: string } }) => (
    <View style={styles.classCard}>
      <Text style={styles.className}>{item.name}</Text>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction(item.id, 'presence')}>
          <Text style={styles.actionText}>Présence</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction(item.id, 'note')}>
          <Text style={styles.actionText}>Noter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction(item.id, 'remarque')}>
          <Text style={styles.actionText}>Remarque</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={28} color="#3D22D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sélectionnez la classe</Text>
        <View style={{ width: 28 }} />
      </View>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
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
  classCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  className: { fontSize: 16, fontWeight: '700', color: '#1F2937', textAlign: 'center', marginBottom: 12 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around' },
  actionButton: {
    backgroundColor: '#3D22D4',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  actionText: { color: '#fff', fontWeight: '600' },
});
