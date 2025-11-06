import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const pacoSchedule = [
    { time: '07h15 - 08h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '08h15 - 09h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '09h15 - 10h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '10h15 - 11h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '11h15 - 12h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '12h15 - 13h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
  ];

  const axelSchedule = [
    { time: '07h15 - 08h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '08h15 - 09h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '09h15 - 10h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '10h15 - 11h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '11h15 - 12h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
    { time: '12h15 - 13h00', lundi: '', mardi: '', mercredi: '', jeudi: '' },
  ];

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeu'];

  const renderTable = (name: string, schedule: typeof pacoSchedule) => (
    <View style={styles.tableContainer} >
      <Text style={styles.name}>{name}</Text>
      <View style={styles.table}>
        {/* En-tête */}
        <View style={styles.headerRow}>
          <View style={styles.timeHeaderCell}>
            <Text style={styles.timeHeaderText}>Heure</Text>
          </View>
          {days.map((day) => (
            <View key={day} style={styles.dayHeaderCell}>
              <Text style={styles.dayHeaderText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Lignes */}
        {schedule.map((row, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.timeCell}>
              <Text style={styles.timeText}>{row.time}</Text>
            </View>
            {days.map((day) => {
              const dayKey = day.toLowerCase() as keyof typeof row;
              return (
                <View
                  key={day}
                  style={[
                    styles.cell,
                    row[dayKey] ? { backgroundColor: '#e0f7fa' } : { backgroundColor: '#fff' },
                  ]}
                >
                  <Text style={styles.cellText}>{row[dayKey]}</Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Emploi du temps</Text>
        {renderTable('Paco', pacoSchedule)}
        <View style={styles.separator} />
        {renderTable('Axel', axelSchedule)}
      </ScrollView>
    </SafeAreaView>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
  },
  tableContainer: {
    marginBottom: 24,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  timeHeaderCell: {
    width: 100,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  timeHeaderText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#555',
  },
  dayHeaderCell: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  dayHeaderText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#555',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timeCell: {
    width: 100,
    padding: 10,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    backgroundColor: '#fafafa',
  },
  timeText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    padding: 10,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
  },
  separator: {
    height: 32,
  },
});