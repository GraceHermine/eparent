import React from 'react';
import { StyleSheet, Text, View, ScrollView, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// === Types ===
interface Note {
  matiere: string;
  devoir1: string;
  devoir2: string;
}

interface Absence {
  date: string;
  heure: string;
  motif: string;
  justifie: string;
}

// === Composant Ligne animée ===
const AnimatedRow: React.FC<{ children: React.ReactNode; delay: number }> = ({ children, delay }) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return <Animated.View style={{ opacity: fadeAnim }}>{children}</Animated.View>;
};

export default function InfoScreen() {
  // === Données typées ===
  const notes: Note[] = [
    { matiere: 'Maths', devoir1: '18/20', devoir2: '17/20' },
    { matiere: 'Anglais', devoir1: '15/20', devoir2: '16/20' },
    { matiere: 'Physique', devoir1: '14/20', devoir2: '' },
    { matiere: 'Histoire', devoir1: '19/20', devoir2: '18/20' },
  ];

  const absences: Absence[] = [
    { date: '24/10/2025', heure: '07h - 10h', motif: 'Rendez-vous médical', justifie: 'Oui' },
    { date: '01/11/2025', heure: '09h - 12h', motif: 'Transport', justifie: 'Non' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Titre */}
        <Text style={styles.title}>KOUA VICTOIRE EUNICE</Text>

        {/* === SECTION NOTES === */}
        <Text style={styles.sectionTitle}>Notes</Text>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <View style={[styles.headerCell, styles.matiereHeader]}>
              <Text style={styles.headerText}>Matières</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Devoir 1</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Devoir 2</Text>
            </View>
          </View>

          {notes.map((note, i) => (
            <AnimatedRow key={i} delay={i * 100}>
              <View style={styles.row}>
                <View style={[styles.cell, styles.matiereCell]}>
                  <Text style={styles.cellText}>{note.matiere}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{note.devoir1}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{note.devoir2}</Text>
                </View>
              </View>
            </AnimatedRow>
          ))}

          {/* Lignes vides pour compléter l'affichage */}
          {Array.from({ length: 3 }).map((_, i) => (
            <View key={`empty-note-${i}`} style={styles.row}>
              <View style={[styles.cell, styles.matiereCell]} />
              <View style={styles.cell} />
              <View style={styles.cell} />
            </View>
          ))}
        </View>

        {/* === SECTION ABSENCES === */}
        <Text style={styles.sectionTitle}>Absences</Text>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <View style={[styles.headerCell, { flex: 1.2 }]}>
              <Text style={styles.headerText}>Date</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Heure</Text>
            </View>
            <View style={[styles.headerCell, { flex: 1.5 }]}>
              <Text style={styles.headerText}>Motif</Text>
            </View>
            <View style={styles.headerCell}>
              <Text style={styles.headerText}>Justifié</Text>
            </View>
          </View>

          {absences.map((absence, i) => (
            <AnimatedRow key={i} delay={i * 100}>
              <View style={styles.row}>
                <View style={[styles.cell, { flex: 1.2 }]}>
                  <Text style={styles.cellText}>{absence.date}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{absence.heure}</Text>
                </View>
                <View style={[styles.cell, { flex: 1.5 }]}>
                  <Text style={[styles.cellText, styles.motifText]}>{absence.motif}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{absence.justifie}</Text>
                </View>
              </View>
            </AnimatedRow>
          ))}

          {/* Lignes vides */}
          {Array.from({ length: 2 }).map((_, i) => (
            <View key={`empty-absence-${i}`} style={styles.row}>
              <View style={[styles.cell, { flex: 1.2 }]} />
              <View style={styles.cell} />
              <View style={[styles.cell, { flex: 1.5 }]} />
              <View style={styles.cell} />
            </View>
          ))}
        </View>

        {/* === SECTION RETARDS === */}
        <Text style={styles.sectionTitle}>Retards</Text>
        <View style={styles.retardBox}>
          <Text style={styles.retardText}>Aucun retard enregistré</Text>
        </View>
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
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#4A6BFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#fff',
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f4ff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  headerText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4A6BFF',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    minHeight: 50,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  matiereHeader: {
    flex: 1.2,
  },
  matiereCell: {
    flex: 1.2,
    backgroundColor: '#f9f9f9',
  },
  cellText: {
    fontSize: 13,
    color: '#333',
    textAlign: 'center',
  },
  motifText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#555',
  },
  retardBox: {
    height: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  retardText: {
    color: '#555',
    fontSize: 14,
  },
});
