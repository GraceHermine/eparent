import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { messagingService } from '../../services/message';
import { authService } from '../../services/authService';

export default function MessageScreen() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const user = await authService.getMe();
      setCurrentUser(user);
      const data = await messagingService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error("Erreur chargement conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

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
        <TouchableOpacity style={styles.headerButton} onPress={() => router.push("/(screens)/NewMessage") }>
          <Ionicons name="add" size={26} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {conversations.length > 0 ? (
          conversations.map((conv) => {
            // Determiner l'interlocuteur (celui qui n'est pas moi)
            // Backend renvoie "participants"
            const otherParticipant = conv.participants.find((p: any) => p.id !== currentUser?.id) || conv.participants[0];
            const lastMsg = conv.last_message;

            return (
              <TouchableOpacity
                key={conv.id}
                style={styles.messageCard}
                onPress={() => router.push({ pathname: '/(screens)/MessageDetails', params: { id: conv.id } })}
              >
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {otherParticipant?.first_name?.charAt(0) || '?'}
                    </Text>
                  </View>
                </View>

                {/* Contenu du message */}
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <View style={styles.nameContainer}>
                      <Text style={styles.parentName}>
                        {otherParticipant ? `${otherParticipant.first_name} ${otherParticipant.last_name}` : 'Inconnu'}
                      </Text>
                      <Text style={styles.childInfo}>
                        {conv.subject}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.messageText} numberOfLines={2}>
                    {lastMsg ? lastMsg.content : 'Aucun message'}
                  </Text>

                  <View style={styles.messageFooter}>
                    <View style={styles.footerLeft}>
                      <Text style={styles.time}>
                        {lastMsg ? new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </Text>
                      {lastMsg && lastMsg.is_read && (
                        <View style={styles.readIndicator}>
                          <Text style={styles.readStatus}>lu</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>Aucune conversation.</Text>
        )}
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