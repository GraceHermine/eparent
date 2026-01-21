import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, SafeAreaView, StatusBar, ImageBackground } from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { messagingService } from "../../services/message";
import { authService } from "../../services/authService";

export default function MessageDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const conversationId = Number(id);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [conversation, setConversation] = useState<any>(null);
  
  // Apparence dynamique
  const [bubbleColor, setBubbleColor] = useState("#3D22D4");
  const [wallpaper, setWallpaper] = useState("https://www.transparenttextures.com/patterns/cubes.png");

  const flatListRef = useRef<FlatList>(null);

  // Recharger l'apparence à chaque fois que l'écran devient actif
  useFocusEffect(
    useCallback(() => {
      const getStyle = async () => {
        const c = await AsyncStorage.getItem('chat_bubble_color');
        const b = await AsyncStorage.getItem('chat_wallpaper');
        if (c) setBubbleColor(c);
        if (b) setWallpaper(b);
      };
      getStyle();
    }, [])
  );

  useEffect(() => {
    if (!isNaN(conversationId)) loadData();
  }, [conversationId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [user, messagesData, conversations] = await Promise.all([
        authService.getMe(),
        messagingService.getConversationDetails(conversationId),
        messagingService.getConversations()
      ]);
      setCurrentUser(user);
      const currentConv = conversations.find((c: any) => c.id === conversationId);
      setConversation(currentConv);
      const extractedMessages = messagesData.results ? messagesData.results : messagesData;
      setMessages(Array.isArray(extractedMessages) ? extractedMessages : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    const content = newMessage.trim();
    setNewMessage("");
    const tempMessage = { id: `temp-${Date.now()}`, content, sender: currentUser, created_at: new Date().toISOString() };
    setMessages((prev) => [...prev, tempMessage]);
    try {
      const savedMsg = await messagingService.sendMessage(conversationId, content);
      setMessages((prev) => prev.map((msg) => (msg.id === tempMessage.id ? { ...savedMsg } : msg)));
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (e) { console.error(e); }
  };

  const otherParticipant = conversation?.participants?.find((p: any) => p.id !== currentUser?.id);
  const title = otherParticipant ? `${otherParticipant.first_name || ""} ${otherParticipant.last_name || ""}`.trim() : "Chat";

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" color="#3D22D4" /></View>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.customHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}><Ionicons name="arrow-back" size={26} color="#3D22D4" /></TouchableOpacity>
        <View style={styles.headerTitleContainer}><Text style={styles.headerTitle}>{title}</Text><Text style={styles.headerSubtitle}>En ligne</Text></View>
        <TouchableOpacity onPress={() => router.push({ pathname: "/chatsettings", params: { id: conversationId } })} style={styles.headerBtn}><Ionicons name="settings-outline" size={24} color="#3D22D4" /></TouchableOpacity>
      </View>

      <ImageBackground source={{ uri: wallpaper }} style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => {
              const isMine = item.sender?.id === currentUser?.id;
              return (
                <View style={[styles.bubble, isMine ? { alignSelf: 'flex-end', backgroundColor: bubbleColor, borderBottomRightRadius: 2 } : styles.theirBubble]}>
                  <Text style={{ color: isMine ? "#FFF" : "#000", fontSize: 16 }}>{item.content}</Text>
                </View>
              );
            }}
          />
          <View style={styles.inputContainer}>
            <TextInput value={newMessage} onChangeText={setNewMessage} placeholder="Message..." style={styles.input} />
            <TouchableOpacity onPress={sendMessage} style={[styles.sendBtn, { backgroundColor: bubbleColor }]}><Ionicons name="send" size={20} color="#FFF" /></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  customHeader: { height: 60, backgroundColor: "#FFF", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, borderBottomWidth: 1, borderColor: "#EEE", marginTop: 25 },
  headerBtn: { width: 40 },
  headerTitleContainer: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 17, fontWeight: "bold" },
  headerSubtitle: { fontSize: 11, color: "#4CAF50" },
  listContent: { padding: 15 },
  bubble: { marginVertical: 5, padding: 12, borderRadius: 18, maxWidth: "80%" },
  theirBubble: { alignSelf: 'flex-start', backgroundColor: "#FFF", borderBottomLeftRadius: 2, elevation: 1 },
  inputContainer: { flexDirection: "row", padding: 10, backgroundColor: "#FFF", borderTopWidth: 1, borderColor: "#EEE" },
  input: { flex: 1, backgroundColor: "#F0F2F5", borderRadius: 20, paddingHorizontal: 15, marginRight: 10 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" }
});