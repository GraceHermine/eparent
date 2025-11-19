import React from 'react';
import {StyleSheet,Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface Conversation {
  id: number;
  parentName: string;
  childName: string;
  message: string;
  time: string;
  read: boolean;
}

export default function MessageScreen() {
  const conversations: Conversation[] = [
    {
      id: 1,
      parentName: 'M. TAHI',
      childName: 'Charlie',
      message: "Oui, votre fils ne s'en sort pas.",
      time: '9:41',
      read: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/HomeParent')}>
          <Ionicons name="arrow-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="add" size={32} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {conversations.map((conv) => (
          <TouchableOpacity key={conv.id} style={styles.messageCard} onPress={() => router.push('/(screens)/MessageDetails')}>
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {conv.parentName.charAt(0)}
                </Text>
              </View>
            </View>

            {/* Contenu du message */}
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.parentName}>{conv.parentName}</Text>
                <Text style={styles.childInfo}>
                  parent de{' '}
                  <Text style={styles.childName}>{conv.childName}</Text>
                </Text>
              </View>

              <Text style={styles.messageText} numberOfLines={2}>
                {conv.message}
              </Text>

              <View style={styles.messageFooter}>
                <Text style={styles.time}>{conv.time}</Text>
                {conv.read && <Text style={styles.readStatus}>lu</Text>}
                <TouchableOpacity onPress={() => router.push('/(screens)/MessageDetails')}>
                  <Text style={styles.replyText}>Répondre</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// === STYLES CORRIGÉS ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  content: {
    padding: 16,
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    marginBottom: 4,
  },
  parentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  childInfo: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  childName: {
    fontWeight: '600',
    color: '#333',
  },
  messageText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 8,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  readStatus: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 8,
  },
  replyText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
  },
});