import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function MessageDetails() {
  const params = useLocalSearchParams();
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
      <Text style={[styles.messageText, item.sender === "me" ? styles.myMessageText : styles.otherMessageText]}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header amélioré */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.push('/(parent)/MessageScreen')}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Mr Tanoh</Text>
          <Text style={styles.headerSubtitle}>En ligne</Text>
        </View>
      </View>

      {/* Zone de messages */}
      <FlatList
        data={messages.slice().reverse()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        inverted
        showsVerticalScrollIndicator={false}
      />

      {/* Zone de saisie améliorée */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Écrire un message..."
            placeholderTextColor="#9CA3AF"
            style={styles.input}
            multiline
          />
        </View>
        <TouchableOpacity 
          onPress={sendMessage} 
          style={styles.sendButton}
          disabled={newMessage.trim() === ""}
        >
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#3D22D4",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  messagesContainer: { 
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageBubble: { 
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginVertical: 6,
    maxWidth: "80%",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  myMessage: { 
    backgroundColor: "#3D22D4", 
    alignSelf: "flex-end",
    borderBottomRightRadius: 6,
  },
  otherMessage: { 
    backgroundColor: "#FFFFFF", 
    alignSelf: "flex-start",
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  messageText: { 
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  myMessageText: { 
    color: "#FFFFFF",
  },
  otherMessageText: { 
    color: "#374151",
  },
  inputContainer: { 
    flexDirection: "row", 
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1, 
    borderTopColor: "#F1F5F9"
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  input: { 
    fontSize: 15,
    color: "#374151",
    padding: 0,
    textAlignVertical: 'center',
  },
  sendButton: { 
    backgroundColor: "#3D22D4", 
    borderRadius: 20, 
    justifyContent: "center", 
    alignItems: "center", 
    paddingHorizontal: 20,
    paddingVertical: 10,
    minHeight: 44,
    shadowColor: '#3D22D4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: { 
    color: "#FFFFFF", 
    fontWeight: "600",
    fontSize: 15,
    letterSpacing: -0.2,
  }
});