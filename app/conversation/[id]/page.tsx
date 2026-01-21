import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { messagingService } from "../../../services/message";
import { authService } from "../../../services/authService";

interface User {
  id: number;
  first_name?: string;
  last_name?: string;
}

interface Message {
  id: number | string;
  content: string;
  sender: User;
  created_at: string;
}

interface Conversation {
  id: number;
  subject: string;
  participants: User[];
}

export default function MessageDetails() {
  const { id } = useLocalSearchParams();
  const conversationId = Number(id);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!isNaN(conversationId)) {
      loadData();
    }
  }, [conversationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // 1. Récupérer l'utilisateur courant et les messages en parallèle
      const [user, messagesData, conversations] = await Promise.all([
        authService.getMe(),
        messagingService.getConversationDetails(conversationId),
        messagingService.getConversations()
      ]);

      setCurrentUser(user);

      // 2. Trouver la conversation spécifique pour le titre
      const currentConv = conversations.find((c: Conversation) => c.id === conversationId);
      setConversation(currentConv);

      // 3. Gestion de la pagination Django (clé .results)
      // Si Django pagine, les données sont dans data.results, sinon dans data
      const extractedMessages = messagesData.results ? messagesData.results : messagesData;
      
      if (Array.isArray(extractedMessages)) {
        setMessages(extractedMessages);
      } else {
        console.error("Format de messages non reconnu:", messagesData);
      }

    } catch (error) {
      console.error("Erreur chargement données :", error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

    const content = newMessage.trim();
    setNewMessage("");

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content,
      sender: currentUser,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const savedMsg = await messagingService.sendMessage(conversationId, content);

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessage.id ? { ...savedMsg } : msg
        )
      );
      
      // Petit délai pour laisser le rendu se faire avant de scroller
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      
    } catch (error) {
      console.error("Erreur envoi message :", error);
      setMessages((prev) => prev.filter((m) => m.id !== tempMessage.id));
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3D22D4" />
      </View>
    );
  }

  // Calcul du titre (nom de l'autre personne)
  const otherParticipant = conversation?.participants?.find(
    (p) => p.id !== currentUser?.id
  );

  const title = otherParticipant
    ? `${otherParticipant.first_name || ""} ${otherParticipant.last_name || ""}`.trim() || "Chat"
    : conversation?.subject || "Conversation";

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1, backgroundColor: "#F5F5F5" }} 
      behavior={Platform.OS === "ios" ? "padding" : undefined} 
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <Stack.Screen options={{ title, headerTintColor: "#3D22D4" }} />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 12, paddingBottom: 20 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        renderItem={({ item }) => {
          const isMine = item.sender?.id === currentUser?.id;
          return (
            <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
              <Text style={{ color: isMine ? "#FFF" : "#000", fontSize: 16 }}>
                {item.content}
              </Text>
              <Text style={[styles.timestamp, { color: isMine ? "#EEE" : "#888" }]}>
                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#999', marginTop: 40 }}>
            Aucun message dans cette discussion.
          </Text>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Écrire un message..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity 
          onPress={sendMessage} 
          style={[styles.sendButton, !newMessage.trim() && { opacity: 0.5 }]}
          disabled={!newMessage.trim()}
        >
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  bubble: {
    marginVertical: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    maxWidth: "85%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#3D22D4",
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
  },
  timestamp: {
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#FFF",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#EEE",
  },
  input: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    borderRadius: 25,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: "#3D22D4",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});