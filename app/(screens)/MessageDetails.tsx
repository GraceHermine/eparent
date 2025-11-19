import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MessageDetails() {
  const params = useLocalSearchParams(); // permet de récupérer les params passés via router.push
  const conversationId = params.conversationId as string;
  const conversationName = params.conversationName as string;

  const [messages, setMessages] = useState([
    { id: '1', text: "Hello, comment vous allez?", sender: "other" },
    { id: '2', text: "Salut, je vais bien et vous, comment allez vous ?", sender: "me" },
    { id: '3', text: "Je vais bien merci. Je vous écrit par rapport à votre fille.", sender: "other" },
    { id: '4', text: "Ma fille, il y a un soucis avec elle ?", sender: "me" },
    { id: '5', text: "Le soucis c'est que j'ai constaté que ces notes dans à mon cours on chuter.", sender: "other" },
    { id: '6', text: "Comment ça se fait ?", sender: "me" },
    { id: '7', text: "J'ai essayer de comprendre le probléme mais c'est aussi pareil dans certaine matière.", sender: "other" },
    { id: '8', text: "Merci pour ce retour, j'en parlerai à ma fille quand elle rentrera des cours.", sender: "me" },
    { id: '9', text: "Excusez moi, mais aujourd'hui, aucun cours n'est dispensé sur l'établissements", sender: "other" },
    { id: '10', text: "Abon ? C'est qu'elle se trouve à la maison. Merci pour cette information. Mais les cours reprennent quand?", sender: "me" },
    { id: '11', text: "Après les congés de noël.", sender: "other" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    setMessages([...messages, { id: String(messages.length + 1), text: newMessage, sender: "me" }]);
    setNewMessage("");
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.messageBubble, item.sender === "me" ? styles.myMessage : styles.otherMessage]}>
      <Text style={[styles.messageText, item.sender === "me" ? { color: "#fff" } : { color: "#000" }]}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.retour}>
        <TouchableOpacity onPress={() => router.push('/(parent)/MessageScreen')}>
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mr Tanoh</Text>
      </View>

      {/* <Text style={styles.header}>{conversationName || "Conversation"}</Text> */}

      <FlatList
        data={messages.slice().reverse()} // inverser pour que le dernier message soit en bas
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        inverted
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Écrire un message..."
          style={styles.input}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAFAFA" },
  retour: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: "#3D22D4",
    marginTop: 25
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    alignItems: 'center'
  },
  header: { padding: 16, fontSize: 18, fontWeight: "700", backgroundColor: "#3D22D4", color: "#fff" },
  messageBubble: { padding: 10, borderRadius: 16, marginVertical: 4, maxWidth: "70%" },
  myMessage: { backgroundColor: "#3D22D4", alignSelf: "flex-end" },
  otherMessage: { backgroundColor: "#E5E7EB", alignSelf: "flex-start" },
  messageText: { color: "#fff" },
  inputContainer: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderTopColor: "#E5E7EB" },
  input: { flex: 1, backgroundColor: "#fff", borderRadius: 24, paddingHorizontal: 16 },
  sendButton: { backgroundColor: "#3D22D4", borderRadius: 24, justifyContent: "center", alignItems: "center", paddingHorizontal: 16, marginLeft: 8 }
});
