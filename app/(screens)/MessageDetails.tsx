import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { messagingService } from '../../services/message';
import { authService } from '../../services/authService';

export default function MessageDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const conversationId = Number(params.id); // <-- Conversion en number
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversation, setConversation] = useState<any>(null);

  useEffect(() => {
    if (!isNaN(conversationId)) {
      loadData();
    } else {
      console.error("ID de conversation invalide :", params.id);
      setLoading(false);
    }
  }, [conversationId]);

  const loadData = async () => {
    try {
      const user = await authService.getMe();
      setCurrentUser(user);

      const convData = await messagingService.getConversationDetails(conversationId);
      setConversation(convData);
      setMessages(convData.messages || []); // Assumant que l'API renvoie { ..., messages: [] }
    } catch (error) {
      console.error("Erreur chargement conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (newMessage.trim() === "" || isNaN(conversationId)) return;

    // Optimistic update
    const tempMsg = {
      id: 'temp-' + Date.now(),
      content: newMessage,
      sender: { id: currentUser.id }, // Structure attendue par le renderItem
      created_at: new Date().toISOString()
    };
    setMessages([...messages, tempMsg]);
    setNewMessage("");

    try {
      await messagingService.sendMessage(conversationId, tempMsg.content);
      // Recharger pour avoir le vrai ID et confirmation
      await loadData();
    } catch (error) {
      console.error("Erreur envoi message:", error);
      alert("Erreur lors de l'envoi du message");
    }
  };

  const renderItem = ({ item }: any) => {
    const isMe = item.sender.id === currentUser?.id;
    return (
      <View style={[styles.messageBubble, isMe ? styles.myMessage : styles.otherMessage]}>
        <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.otherMessageText]}>
          {item.content}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3D22D4" />
      </View>
    );
  }

  const otherParticipant = conversation?.participants?.find((p: any) => p.id !== currentUser?.id);
  const title = otherParticipant ? `${otherParticipant.first_name} ${otherParticipant.last_name}` : "Conversation";

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSubtitle}>{conversation?.subject || 'Messagerie'}</Text>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        data={[...messages].reverse()}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.messagesContainer}
        inverted
        showsVerticalScrollIndicator={false}
      />

      {/* Zone de saisie */}
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
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton} disabled={newMessage.trim() === ""}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: "#3D22D4", borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4
  },
  backButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.2)', marginRight: 12 },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 13, color: 'rgba(255, 255, 255, 0.8)', marginTop: 2 },
  messagesContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  messageBubble: { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 20, marginVertical: 6, maxWidth: "80%", shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  myMessage: { backgroundColor: "#3D22D4", alignSelf: "flex-end", borderBottomRightRadius: 6 },
  otherMessage: { backgroundColor: "#FFFFFF", alignSelf: "flex-start", borderBottomLeftRadius: 6, borderWidth: 1, borderColor: "#F1F5F9" },
  messageText: { fontSize: 15, lineHeight: 20, letterSpacing: -0.2 },
  myMessageText: { color: "#FFFFFF" },
  otherMessageText: { color: "#374151" },
  inputContainer: { flexDirection: "row", alignItems: "flex-end", paddingHorizontal: 16, paddingVertical: 12, backgroundColor: "#FFFFFF", borderTopWidth: 1, borderTopColor: "#F1F5F9" },
  inputWrapper: { flex: 1, backgroundColor: "#F8FAFC", borderRadius: 24, borderWidth: 1, borderColor: "#E5E7EB", marginRight: 8, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100 },
  input: { fontSize: 15, color: "#374151", padding: 0, textAlignVertical: 'center' },
  sendButton: { backgroundColor: "#3D22D4", borderRadius: 20, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, paddingVertical: 10, minHeight: 44, shadowColor: '#3D22D4', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  sendButtonText: { color: "#FFFFFF", fontWeight: "600", fontSize: 15, letterSpacing: -0.2 }
});
