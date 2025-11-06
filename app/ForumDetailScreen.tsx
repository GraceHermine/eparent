import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'me' | 'other';
  timestamp: string;
  avatar?: string;
}

interface Forum {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Forum par défaut (si pas passé en param)
const defaultForum: Forum = {
  id: '1',
  title: 'Big Family',
  icon: 'people-outline',
};

// Messages initiaux
const initialMessages: Message[] = [
  {
    id: '1',
    text: "Salut tout le monde ! Comment ça va ?",
    sender: 'other',
    timestamp: '10:32',
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
  },
  {
    id: '2',
    text: "Super, merci ! Et toi ?",
    sender: 'me',
    timestamp: '10:33',
  },
  {
    id: '3',
    text: "On organise un pique-nique dimanche prochain, qui est partant ?",
    sender: 'other',
    timestamp: '10:35',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
  },
];

interface Props {
  route?: {
    params?: {
      forum?: Forum;
    };
  };
  navigation?: {
    goBack: () => void;
  };
}

export default function ForumDetailScreen({ route, navigation }: Props) {
  const currentForum = route?.params?.forum || defaultForum;
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, newMessage]);
      setInputText('');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'me' ? styles.messageRight : styles.messageLeft,
      ]}
    >
      {/* Avatar pour les autres */}
      {item.sender === 'other' && item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder} />
      )}

      {/* Bulle de message */}
      <View
        style={[
          styles.messageBubble,
          item.sender === 'me' ? styles.bubbleMe : styles.bubbleOther,
        ]}
      >
        <Text
            style={[
                styles.messageText,
                item.sender === 'me' ? styles.textMe : styles.textOther,
            ]}
            />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#4A6BFF" />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Ionicons name={currentForum.icon} size={24} color="#4A6BFF" />
          <Text style={styles.forumTitle} numberOfLines={1}>
            {currentForum.title}
          </Text>
        </View>

        <View style={{ width: 32 }} />
      </View>

      {/* Messages + Input */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Champ d'envoi */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Écrivez un message..."
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// === Styles ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  forumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 6,
    alignItems: 'flex-end',
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleOther: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  bubbleMe: {
    backgroundColor: '#4A6BFF',
  },
  messageText: {
    fontSize: 15.5,
    lineHeight: 20,
  },
  textOther: {
    color: '#333',
  },
  textMe: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 11,
    color: '#aaa',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#4A6BFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});