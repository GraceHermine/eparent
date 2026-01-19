// app/screens/NewMessage.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Href, useRouter } from 'expo-router';
import { messagingService } from '../../services/message'; // Vérifie le chemin exact

// Types
type User = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
};

type Student = {
  id: number;
  first_name: string;
  last_name: string;
};

const NewMessageScreen: React.FC = () => {
  const router = useRouter();

  const [subject, setSubject] = useState('');
  const [contacts, setContacts] = useState<User[]>([]);
  const [children, setChildren] = useState<Student[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

  // Charger contacts et enfants
  useEffect(() => {
    messagingService.getContacts()
      .then(setContacts)
      .catch(err => console.error('Erreur contacts:', err));

    messagingService.getChildren()
      .then(setChildren)
      .catch(err => console.error('Erreur enfants:', err));
  }, []);

  const handleCreateConversation = async () => {
  if (!subject.trim() || !selectedRecipient) {
    alert('Veuillez remplir le sujet et choisir un destinataire.');
    return;
  }

  try {
    const conversation = await messagingService.createConversation(
      subject,
      selectedRecipient,
      selectedStudent || undefined
    );

    // TypeScript est content : on pointe vers le fichier page.tsx
    router.push({
      pathname: '/conversation/[id]/page', // <-- chemin complet vers le fichier
      params: { id: conversation.id },
    });

  } catch (err) {
    console.error(err);
    alert('Erreur lors de la création de la conversation.');
  }
};






  // On combine contacts + enfants dans FlatList via ListHeaderComponent et ListFooterComponent
  return (
    <FlatList
      style={styles.container}
      data={contacts}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <>
          <Text style={styles.label}>Sujet :</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez le sujet"
            value={subject}
            onChangeText={setSubject}
          />
          <Text style={styles.label}>Destinataire :</Text>
        </>
      }
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.item, selectedRecipient === item.id && styles.selectedItem]}
          onPress={() => setSelectedRecipient(item.id)}
        >
          <Text>{item.first_name} {item.last_name} ({item.username})</Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={
        <>
          <Text style={styles.label}>Élève (facultatif) :</Text>
          {children.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={[styles.item, selectedStudent === child.id && styles.selectedStudent]}
              onPress={() => setSelectedStudent(child.id)}
            >
              <Text>{child.first_name} {child.last_name}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Créer la conversation" onPress={handleCreateConversation} />
        </>
      }
    />
  );
};

export default NewMessageScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: 'bold', marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginVertical: 10, borderRadius: 5 },
  item: { padding: 10, borderWidth: 1, borderColor: '#ccc', marginVertical: 5, borderRadius: 5 },
  selectedItem: { backgroundColor: 'lightblue' },
  selectedStudent: { backgroundColor: 'lightgreen' },
});