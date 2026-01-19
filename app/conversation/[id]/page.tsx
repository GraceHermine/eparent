import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { messagingService } from '../../../services/message';
import { authService } from '../../../services/authService';
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from 'react-native';

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
  messages: Message[];
}
export default function MessageDetails() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const conversationId = Number(id);

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [conversation, setConversation] = useState<Conversation | null>(null);

    useEffect(() => {
        if (!isNaN(conversationId)) {
        loadData();
        }
    }, [conversationId]);

   const loadData = async () => {
    try {
        setLoading(true);
        const user = await authService.getMe();
        setCurrentUser(user);

        const data = await messagingService.getConversationDetails(conversationId);
        
        // LOGUEZ ICI pour voir la structure réelle
        console.log("Données reçues de l'API:", data);

        // Si 'data' est un tableau, on l'utilise directement. 
        // Si c'est un objet avec une clé 'messages', on prend la clé.
        const messagesList = Array.isArray(data) ? data : (data.messages || []);
        
        // On trie : les plus récents en bas pour une liste normale
        setMessages([...messagesList].reverse()); 
        
        // Si data n'est pas le tableau, c'est l'objet conversation
        if(!Array.isArray(data)) setConversation(data);
        
    } catch (error: any) {
        console.error("Erreur chargement:", error);
    } finally {
        setLoading(false);
    }
};

    const sendMessage = async () => {
        if (!newMessage.trim() || !currentUser) return;
        const content = newMessage.trim();
        setNewMessage("");

        try {
            const savedMsg = await messagingService.sendMessage(conversationId, content);
            
            // On s'assure que le sender est bien formaté pour l'affichage immédiat
            const messageToDisplay = {
                ...savedMsg,
                sender: savedMsg.sender?.id ? savedMsg.sender : currentUser // Sécurité
            };

            setMessages(prev => [...prev, messageToDisplay]);
        } catch (error: any) {
            alert("Erreur envoi");
        }
    };

    if (loading) {
        return (
        <View style={styles.center}>
            <ActivityIndicator size="large" color="#3D22D4" />
        </View>
        );
    }

    const otherParticipant = conversation?.participants?.find(p => p.id !== currentUser?.id);
    const title = otherParticipant ? `${otherParticipant.first_name} ${otherParticipant.last_name}` : "Message";

    return (
        <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{ flex: 1 }}
        keyboardVerticalOffset={90}
        >
        <Stack.Screen options={{ title: title, headerTintColor: '#3D22D4' }} />

        <FlatList
            data={messages}
            // inverted   ← SUPPRIMER cette ligne ou la commenter
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={{ padding: 10 }}
            renderItem={({ item }) => {
                const isMine = item.sender.id === currentUser?.id;
                return (
                <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
                    <Text style={{ color: isMine ? '#FFF' : '#000' }}>{item.content}</Text>
                </View>
                );
            }}
        />

        <View style={styles.inputContainer}>
            <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Écrire..."
            style={styles.input}
            multiline
            />
            <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
            <Ionicons name="send" size={24} color="#FFF" />
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    );
    }

    const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    bubble: { 
        marginVertical: 4, 
        padding: 12, 
        borderRadius: 18, 
        maxWidth: '80%' 
    },
    myBubble: { 
        alignSelf: 'flex-end', 
        backgroundColor: '#3D22D4',
        borderBottomRightRadius: 2 
    },
    theirBubble: { 
        alignSelf: 'flex-start', 
        backgroundColor: '#E9E9EB',
        borderBottomLeftRadius: 2 
    },
    inputContainer: { 
        flexDirection: 'row', 
        padding: 10, 
        backgroundColor: '#FFF', 
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#EEE'
    },
    input: { 
        flex: 1, 
        backgroundColor: '#F0F0F0', 
        borderRadius: 20, 
        paddingHorizontal: 15, 
        paddingVertical: 8,
        marginRight: 10 
    },
    sendButton: { 
        backgroundColor: '#3D22D4', 
        width: 44, 
        height: 44, 
        borderRadius: 22, 
        justifyContent: 'center', 
        alignItems: 'center'
    }
});
