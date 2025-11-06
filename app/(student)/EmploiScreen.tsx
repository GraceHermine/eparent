// EmploiScreen.tsx
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// === TYPES ===
type DayKey = 'lundi' | 'mardi' | 'mercredi' | 'jeudi' | 'vendredi';

type ScheduleCell = {
  course: string;
  teacher?: string;
  room?: string;
  type?: string;
};

type ScheduleRow = {
  time: string;
  lundi: ScheduleCell;
  mardi: ScheduleCell;
  mercredi: ScheduleCell;
  jeudi: ScheduleCell;
  vendredi: ScheduleCell;
};

// === CONSTANTES ===
const COLUMN_WIDTH = 120;
const TIME_COLUMN_WIDTH = 90;

const days: DayKey[] = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];

const courseColors: Record<string, string> = {
  math: '#4A6BFF',
  anglais: '#02AAE8',
  sport: '#95BB34',
  science: '#F59E0B',
  histoire: '#D946EF',
  musique: '#8B5CF6',
  art: '#F87171',
  labo: '#FBBF24',
  default: '#E0E7FF',
};

const courseIcons: Record<string, JSX.Element> = {
  sport: <MaterialCommunityIcons name="run-fast" size={16} color="#fff" />,
  musique: <MaterialCommunityIcons name="music-note" size={16} color="#fff" />,
  labo: <MaterialCommunityIcons name="flask" size={16} color="#fff" />,
  art: <MaterialCommunityIcons name="palette" size={16} color="#fff" />,
};

// === EXEMPLE DE PLANNING ===
const studentSchedule: ScheduleRow[] = [
  { time: '08h00 - 08h45', lundi: { course: 'Mathématiques', teacher: 'Mme Dupont', room: 'Salle 101', type: 'math' }, mardi: { course: 'Anglais', teacher: 'Mr Smith', room: 'Salle 202', type: 'anglais' }, mercredi: { course: 'Sport', teacher: 'Mr John', room: 'Gymnase', type: 'sport' }, jeudi: { course: 'Physique', teacher: 'Mme Curie', room: 'Lab 3', type: 'science' }, vendredi: { course: 'Histoire', teacher: 'Mme Martin', room: 'Salle 303', type: 'histoire' } },
  { time: '08h45 - 09h30', lundi: { course: 'Anglais', teacher: 'Mr Smith', room: 'Salle 202', type: 'anglais' }, mardi: { course: '', type: '' }, mercredi: { course: 'Mathématiques', teacher: 'Mme Dupont', room: 'Salle 101', type: 'math' }, jeudi: { course: '', type: '' }, vendredi: { course: 'Musique', teacher: 'Mr Claude', room: 'Salle 404', type: 'musique' } },
  { time: '09h30 - 10h15', lundi: { course: 'Sport', teacher: 'Mr John', room: 'Gymnase', type: 'sport' }, mardi: { course: 'Art', teacher: 'Mme Rose', room: 'Atelier', type: 'art' }, mercredi: { course: '', type: '' }, jeudi: { course: 'Mathématiques', teacher: 'Mme Dupont', room: 'Salle 101', type: 'math' }, vendredi: { course: 'Physique', teacher: 'Mme Curie', room: 'Lab 3', type: 'science' } },
  { time: '10h15 - 11h00', lundi: { course: 'Histoire', teacher: 'Mme Martin', room: 'Salle 303', type: 'histoire' }, mardi: { course: 'Mathématiques', teacher: 'Mme Dupont', room: 'Salle 101', type: 'math' }, mercredi: { course: 'Anglais', teacher: 'Mr Smith', room: 'Salle 202', type: 'anglais' }, jeudi: { course: 'Sport', teacher: 'Mr John', room: 'Gymnase', type: 'sport' }, vendredi: { course: '', type: '' } },
  { time: '11h00 - 11h45', lundi: { course: '', type: '' }, mardi: { course: 'Physique', teacher: 'Mme Curie', room: 'Lab 3', type: 'science' }, mercredi: { course: 'Musique', teacher: 'Mr Claude', room: 'Salle 404', type: 'musique' }, jeudi: { course: 'Art', teacher: 'Mme Rose', room: 'Atelier', type: 'art' }, vendredi: { course: 'Mathématiques', teacher: 'Mme Dupont', room: 'Salle 101', type: 'math' } },
  { time: '11h45 - 12h30', lundi: { course: 'Anglais', teacher: 'Mr Smith', room: 'Salle 202', type: 'anglais' }, mardi: { course: '', type: '' }, mercredi: { course: '', type: '' }, jeudi: { course: 'Histoire', teacher: 'Mme Martin', room: 'Salle 303', type: 'histoire' }, vendredi: { course: 'Sport', teacher: 'Mr John', room: 'Gymnase', type: 'sport' } },
  { time: '12h30 - 13h15', lundi: { course: '', type: '' }, mardi: { course: '', type: '' }, mercredi: { course: '', type: '' }, jeudi: { course: '', type: '' }, vendredi: { course: '', type: '' } }, // Pause déjeuner
  { time: '13h15 - 14h00', lundi: { course: 'Physique', teacher: 'Mme Curie', room: 'Lab 3', type: 'science' }, mardi: { course: 'Mathématiques', teacher: 'Mme Dupont', room: 'Salle 101', type: 'math' }, mercredi: { course: 'Anglais', teacher: 'Mr Smith', room: 'Salle 202', type: 'anglais' }, jeudi: { course: 'Sport', teacher: 'Mr John', room: 'Gymnase', type: 'sport' }, vendredi: { course: 'Art', teacher: 'Mme Rose', room: 'Atelier', type: 'art' } },
  { time: '14h00 - 14h45', lundi: { course: 'Musique', teacher: 'Mr Claude', room: 'Salle 404', type: 'musique' }, mardi: { course: 'Histoire', teacher: 'Mme Martin', room: 'Salle 303', type: 'histoire' }, mercredi: { course: '', type: '' }, jeudi: { course: 'Mathématiques', teacher: 'Mme Dupont', room: 'Salle 101', type: 'math' }, vendredi: { course: 'Anglais', teacher: 'Mr Smith', room: 'Salle 202', type: 'anglais' } },
  { time: '14h45 - 15h30', lundi: { course: 'Sport', teacher: 'Mr John', room: 'Gymnase', type: 'sport' }, mardi: { course: 'Art', teacher: 'Mme Rose', room: 'Atelier', type: 'art' }, mercredi: { course: 'Physique', teacher: 'Mme Curie', room: 'Lab 3', type: 'science' }, jeudi: { course: '', type: '' }, vendredi: { course: 'Mathématiques', teacher: 'Mme Dupont', room: 'Salle 101', type: 'math' } },
  { time: '15h30 - 16h15', lundi: { course: 'Histoire', teacher: 'Mme Martin', room: 'Salle 303', type: 'histoire' }, mardi: { course: '', type: '' }, mercredi: { course: 'Anglais', teacher: 'Mr Smith', room: 'Salle 202', type: 'anglais' }, jeudi: { course: 'Musique', teacher: 'Mr Claude', room: 'Salle 404', type: 'musique' }, vendredi: { course: 'Sport', teacher: 'Mr John', room: 'Gymnase', type: 'sport' } },
  { time: '16h15 - 16h30', lundi: { course: '', type: '' }, mardi: { course: '', type: '' }, mercredi: { course: '', type: '' }, jeudi: { course: '', type: '' }, vendredi: { course: '', type: '' } }, // Fin journée
];

// === COMPOSANTS ===
const TableCell: React.FC<{ cell: ScheduleCell }> = ({ cell }) => {
  const animation = new Animated.Value(0);

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const bgColor = cell.course ? courseColors[cell.type || 'default'] : '#f0f0f0';
  const icon = cell.type && courseIcons[cell.type] ? courseIcons[cell.type] : null;

  return (
    <Animated.View style={[styles.cell, { backgroundColor: bgColor, opacity: animation }]}>
      {cell.course ? (
        <>
          <Text style={styles.cellText}>{cell.course}</Text>
          {cell.teacher && <Text style={styles.subText}>{cell.teacher}</Text>}
          {cell.room && <Text style={styles.subText}>{cell.room}</Text>}
          {icon && <View style={styles.iconWrapper}>{icon}</View>}
        </>
      ) : null}
    </Animated.View>
  );
};

const TableRow: React.FC<{ row: ScheduleRow }> = ({ row }) => (
  <View style={styles.row}>
    <View style={styles.timeCell}>
      <Text style={styles.timeText}>{row.time}</Text>
    </View>
    {days.map((day) => (
      <TableCell key={day} cell={row[day]} />
    ))}
  </View>
);

export default function EmploiScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Emploi du temps</Text>
        <ScrollView horizontal contentContainerStyle={{ minWidth: TIME_COLUMN_WIDTH + COLUMN_WIDTH * days.length }}>
          <View style={styles.table}>
            {/* Header */}
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
            {/* Rows */}
            {studentSchedule.map((row, index) => (
              <TableRow key={index} row={row} />
            ))}
          </View>
        </ScrollView>

        {/* Légende */}
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>Légende :</Text>
          {Object.entries(courseColors).map(([type, color]) =>
            type !== 'default' ? (
              <View key={type} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{type}</Text>
              </View>
            ) : null
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// === STYLES ===
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContent: { padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: '#4A6BFF' },
  table: { borderRadius: 12, overflow: 'hidden' },
  headerRow: { flexDirection: 'row', backgroundColor: '#f0f0f0', borderBottomWidth: 1, borderBottomColor: '#ddd' },
  timeHeaderCell: {
    width: TIME_COLUMN_WIDTH,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  timeHeaderText: { fontWeight: 'bold', fontSize: 12, color: '#555' },
  dayHeaderCell: {
    width: COLUMN_WIDTH,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  dayHeaderText: { fontWeight: 'bold', fontSize: 12, color: '#555' },
  row: { flexDirection: 'row', alignItems: 'stretch' },
  timeCell: {
    width: TIME_COLUMN_WIDTH,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  timeText: { fontSize: 12, color: '#666', textAlign: 'center' },
  cell: {
    width: COLUMN_WIDTH,
    minHeight: 60,
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    borderRadius: 8,
    margin: 1,
    elevation: 2,
  },
  cellText: { fontSize: 12, fontWeight: '600', color: '#fff', textAlign: 'center' },
  subText: { fontSize: 10, color: '#fff', textAlign: 'center' },
  iconWrapper: { marginTop: 4 },
  legendContainer: { marginTop: 16, padding: 12, backgroundColor: '#fff', borderRadius: 12, elevation: 2 },
  legendTitle: { fontWeight: '600', marginBottom: 8, color: '#333' },
  legendItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  legendColor: { width: 16, height: 16, borderRadius: 4, marginRight: 8 },
  legendText: { fontSize: 12, color: '#333', textTransform: 'capitalize' },
});
