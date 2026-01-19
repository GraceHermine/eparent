// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
//   StatusBar
// } from 'react-native';
// import { useRouter, useLocalSearchParams } from 'expo-router'; // Changement ici pour useLocalSearchParams
// import { Ionicons } from '@expo/vector-icons';
// import { coreService } from '../../services/core';


// export default function ViewStudentDetails() {
//   const router = useRouter();
//   // useLocalSearchParams est plus fiable pour récupérer les params d'URL
//   const { classId, subjectId } = useLocalSearchParams();

//   const [students, setStudents] = useState<any[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState<any>(null);
//   const [studentData, setStudentData] = useState<any>({ grades: [], attendances: [] });
  
//   const [loading, setLoading] = useState(true);
//   const [detailsLoading, setDetailsLoading] = useState(false);

//   // 1. Fonction de chargement avec logs
//   const loadStudents = useCallback(async () => {
//     if (!classId) {
//       console.error("Erreur: classId est manquant dans l'URL");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log("Tentative de chargement pour la classe ID:", classId);
      
//       const data = await coreService.getClassStudents(classId);
//       console.log("Élèves reçus:", data.length);

//       const sorted = data.sort((a: any, b: any) => 
//         (a.last_name || "").localeCompare(b.last_name || "")
//       );
      
//       setStudents(sorted);
//     } catch (e: any) {
//       console.error("Erreur complète API:", e);
//       if (e.response?.status === 401) {
//         Alert.alert("Session expirée", "Veuillez vous reconnecter.");
//         router.replace("/(auth)/LoginScreen");
//       } else {
//         Alert.alert('Erreur', 'Impossible de joindre le serveur.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   }, [classId]);

//   // 2. Déclenchement au montage
//   useEffect(() => {
//     loadStudents();
//   }, [loadStudents]);

//   const loadDetails = async (student: any) => {
//     try {
//       setDetailsLoading(true);
//       setSelectedStudent(student);
      
//       const [grades, attendances] = await Promise.all([
//         coreService.getStudentGradesForTeacher(student.id),
//         coreService.getStudentAttendances(student.id),
//       ]);

//       const filteredGrades = grades.filter((g: any) => g.subject === parseInt(String(subjectId || '0')));

//       setStudentData({
//         grades: filteredGrades,
//         attendances: attendances,
//       });
//     } catch (e) {
//       Alert.alert('Erreur', 'Impossible de charger les détails.');
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   // Rendu d'un élève
//   const renderStudentItem = ({ item }: { item: any }) => (
//     <TouchableOpacity 
//       style={[styles.studentCard, selectedStudent?.id === item.id && styles.selectedCard]} 
//       onPress={() => loadDetails(item)}
//     >
//       <View style={styles.avatar}>
//         <Text style={styles.avatarText}>{item.last_name?.[0]}{item.first_name?.[0]}</Text>
//       </View>
//       <View style={{flex: 1}}>
//         <Text style={styles.studentName}>{item.last_name?.toUpperCase()} {item.first_name}</Text>
//         <Text style={styles.matriculeText}>{item.matricule || 'Sans matricule'}</Text>
//       </View>
//       <Ionicons name="chevron-forward" size={18} color="#64748B" />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <StatusBar barStyle="dark-content" />
      
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
//           <Ionicons name="arrow-back" size={22} color="#3D22D4" />
//         </TouchableOpacity>
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>Suivi Élèves</Text>
//           <Text style={styles.headerSubtitle}>Consultation des dossiers</Text>
//         </View>
//         <TouchableOpacity onPress={loadStudents} style={styles.refreshIcon}>
//             <Ionicons name="refresh" size={20} color="#3D22D4" />
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={styles.centered}>
//           <ActivityIndicator size="large" color="#3D22D4" />
//           <Text style={styles.debugText}>Chargement des élèves...</Text>
//         </View>
//       ) : (
//         <View style={{ flex: 1 }}>
//           <FlatList
//             data={students}
//             keyExtractor={item => item.id.toString()}
//             renderItem={renderStudentItem}
//             contentContainerStyle={styles.listPadding}
//             ListEmptyComponent={
//                 <View style={styles.centered}>
//                     <Ionicons name="people-outline" size={50} color="#CBD5E1" />
//                     <Text style={styles.emptyText}>Aucun élève dans cette classe.</Text>
//                 </View>
//             }
//           />

//           {selectedStudent && (
//             <View style={styles.detailsPanel}>
//               <View style={styles.panelHeader}>
//                 <Text style={styles.panelTitle}>{selectedStudent.first_name} {selectedStudent.last_name}</Text>
//                 <TouchableOpacity onPress={() => setSelectedStudent(null)}>
//                    <Ionicons name="close-circle" size={26} color="#CBD5E1" />
//                 </TouchableOpacity>
//               </View>

//               {detailsLoading ? (
//                 <ActivityIndicator color="#3D22D4" style={{marginTop: 20}} />
//               ) : (
//                 <ScrollView showsVerticalScrollIndicator={false}>
//                   <Text style={styles.sectionTitle}>Notes (Matière)</Text>
//                   {studentData.grades.length > 0 ? studentData.grades.map((g: any, i: number) => (
//                     <View key={i} style={styles.infoRow}>
//                         <Text>{g.description || 'Note'}</Text>
//                         <Text style={styles.boldText}>{g.value}/20</Text>
//                     </View>
//                   )) : <Text style={styles.noData}>Aucune note</Text>}

//                   <Text style={[styles.sectionTitle, {marginTop: 15}]}>Absences</Text>
//                   {studentData.attendances.length > 0 ? studentData.attendances.map((a: any, i: number) => (
//                     <View key={i} style={styles.infoRow}>
//                         <Text>{new Date(a.date).toLocaleDateString()}</Text>
//                         <Text style={{color: '#EF4444'}}>{a.type}</Text>
//                     </View>
//                   )) : <Text style={styles.noData}>Rien à signaler</Text>}
//                 </ScrollView>
//               )}
//             </View>
//           )}
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#F8FAFC' },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
//   header: {
//     flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16,
//     paddingTop: 60, paddingBottom: 15, backgroundColor: '#fff', 
//     borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
//   },
//   headerCenter: { flex: 1, alignItems: 'center' },
//   headerTitle: { fontSize: 18, fontWeight: '800', color: '#1E293B' },
//   headerSubtitle: { fontSize: 12, color: '#64748B' },
//   backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
//   refreshIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  
//   listPadding: { padding: 16 },
//   studentCard: {
//     flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
//     padding: 12, borderRadius: 12, marginBottom: 10,
//     borderWidth: 1, borderColor: '#F1F5F9'
//   },
//   selectedCard: { borderColor: '#3D22D4', backgroundColor: '#F5F3FF' },
//   avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#3D22D4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
//   avatarText: { color: '#fff', fontWeight: 'bold' },
//   studentName: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
//   matriculeText: { fontSize: 11, color: '#94A3B8' },

//   detailsPanel: {
//     position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
//     backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25,
//     padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 10
//   },
//   panelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
//   panelTitle: { fontSize: 17, fontWeight: '800' },
//   sectionTitle: { fontSize: 12, fontWeight: '700', color: '#3D22D4', textTransform: 'uppercase' },
//   infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
//   boldText: { fontWeight: '700' },
//   noData: { fontSize: 12, color: '#CBD5E1', fontStyle: 'italic', marginTop: 5 },
//   debugText: { marginTop: 10, color: '#94A3B8', fontSize: 12 },
//   emptyText: { marginTop: 10, color: '#94A3B8' }
// });