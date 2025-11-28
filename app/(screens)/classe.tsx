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
        <TouchableOpacity 
          style={[styles.actionButton, styles.presenceButton]} 
          onPress={() => handleAction(item.id, 'presence')}
        >
          <Text style={styles.actionText}>Présence</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.noteButton]} 
          onPress={() => handleAction(item.id, 'note')}
        >
          <Text style={styles.actionText}>Noter</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.remarqueButton]} 
          onPress={() => handleAction(item.id, 'remarque')}
        >
          <Text style={styles.actionText}>Remarque</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#3D22D4" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sélectionnez la classe</Text>
        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={classes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  headerSpacer: { 
    width: 40 
  },
  listContainer: { 
    padding: 20,
    paddingTop: 24,
  },
  classCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  className: { 
    fontSize: 17, 
    fontWeight: '700', 
    color: '#1E293B', 
    textAlign: 'center', 
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  actionsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  presenceButton: {
    backgroundColor: '#10B981',
  },
  noteButton: {
    backgroundColor: '#3D22D4',
  },
  remarqueButton: {
    backgroundColor: '#F59E0B',
  },
  actionText: { 
    color: '#FFFFFF', 
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: -0.2,
  },
});