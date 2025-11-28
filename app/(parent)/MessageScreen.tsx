import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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
      parentName: 'Koffi Ornella',
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
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => router.push('/HomeParent')}
        >
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="add" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {conversations.map((conv) => (
          <TouchableOpacity 
            key={conv.id} 
            style={styles.messageCard} 
            onPress={() => router.push('/(screens)/MessageDetails')}
          >
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
                <View style={styles.nameContainer}>
                  <Text style={styles.parentName}>{conv.parentName}</Text>
                  <Text style={styles.childInfo}>
                    parent de{' '}
                    <Text style={styles.childName}>{conv.childName}</Text>
                  </Text>
                </View>
              </View>

              <Text style={styles.messageText} numberOfLines={2}>
                {conv.message}
              </Text>

              <View style={styles.messageFooter}>
                <View style={styles.footerLeft}>
                  <Text style={styles.time}>{conv.time}</Text>
                  {conv.read && (
                    <View style={styles.readIndicator}>
                      <Text style={styles.readStatus}>lu</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity 
                  style={styles.replyButton}
                  onPress={() => router.push('/(screens)/MessageDetails')}
                >
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

// === STYLES AMÉLIORÉS ===
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.3,
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarContainer: {
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  messageHeader: {
    marginBottom: 8,
  },
  nameContainer: {
    flex: 1,
  },
  parentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  childInfo: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 16,
  },
  childName: {
    fontWeight: '500',
    color: '#475569',
  },
  messageText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  readIndicator: {
    marginLeft: 8,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  readStatus: {
    fontSize: 11,
    color: '#007AFF',
    fontWeight: '600',
  },
  replyButton: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  replyText: {
    fontSize: 13,
    color: '#007AFF',
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});