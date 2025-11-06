import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'];
  
  const timeSlots = [
    '07h15 - 08h00',
    '08h15 - 09h00',
    '09h15 - 10h00',
    '10h15 - 11h00',
    '11h15 - 12h00',
    '12h15 - 13h00',
  ];

  // Exemple de données (vide ici)
  const schedule: Record<string, string> = {
    'Lundi-07h15 - 08h00': '',
    'Lundi-08h15 - 09h00': '',
    // ... tu peux remplir plus tard
  };

  const getCellContent = (day: string, time: string) => {
    return schedule[`${day}-${time}`] || '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Emploi du temps de Pacome</Text>

        <View style={styles.tableContainer}>
          {/* Tableau principal */}
          <View style={styles.table}>
            {/* En-tête : Jours */}
            <View style={styles.headerRow}>
              <View style={styles.cornerCell} />
              {days.map((day) => (
                <View key={day} style={styles.dayHeaderCell}>
                  <Text style={styles.dayHeaderText}>{day}</Text>
                </View>
              ))}
            </View>

            {/* Lignes : Heures + cellules */}
            {timeSlots.map((time, index) => (
              <View key={time} style={styles.row}>
                {/* Cellule d'heure (à gauche) */}
                <View style={styles.timeCell}>
                  <Text style={styles.timeText}>{time}</Text>
                </View>

                {/* Cellules des jours */}
                {days.map((day) => (
                  <View key={day} style={styles.cell}>
                    <Text style={styles.cellText}>
                      {getCellContent(day, time)}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  tableContainer: {
    alignSelf: 'center',
    width: '100%',
    maxWidth: 400,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cornerCell: {
    width: 90,
    height: 50,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dayHeaderCell: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dayHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#444',
  },
  row: {
    flexDirection: 'row',
  },
  timeCell: {
    width: 90,
    paddingVertical: 8,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  timeText: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    lineHeight: 14,
  },
  cell: {
    flex: 1,
    minHeight: 60,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cellText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
});