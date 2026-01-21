import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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
      console.error('Erreur chargement conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🔴 SUPPRESSION CONVERSATION
  const handleDeleteConversation = (conversationId: number) => {
    Alert.alert(
      'Supprimer la conversation',
      'Cette action est définitive. Voulez-vous continuer ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await messagingService.deleteConversation(conversationId);
              setConversations(prev =>
                prev.filter(conv => conv.id !== conversationId)
              );
            } catch (error) {
              Alert.alert(
                'Erreur',
                'Impossible de supprimer la conversation.'
              );
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => {
            if (currentUser?.role === 'TEACHER') {
              router.push('/(prof)/HomeProf');
            } else {
              router.push('/(parent)/HomeParent');
            }
          }}
        >
          <Ionicons name="arrow-back" size={22} color="#007AFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Messages</Text>

        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push('/(screens)/NewMessage')}
        >
          <Ionicons name="add" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* LISTE DES CONVERSATIONS */}
      <ScrollView contentContainerStyle={styles.content}>
        {conversations.length > 0 ? (
          conversations.map(conv => {
            const other = conv.participants.find(
              (p: any) => p.id !== currentUser?.id
            ) || conv.participants[0];

            const lastMsg = conv.last_message;

            return (
              <TouchableOpacity
                key={conv.id}
                style={styles.messageCard}
                onPress={() =>
                  router.push({
                    pathname: '/(screens)/MessageDetails',
                    params: { id: conv.id },
                  })
                }
                onLongPress={() => handleDeleteConversation(conv.id)}
              >
                {/* AVATAR */}
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {other?.first_name?.charAt(0) || '?'}
                  </Text>
                </View>

                {/* CONTENU */}
                <View style={styles.messageContent}>
                  <View style={styles.messageHeader}>
                    <View>
                      <Text style={styles.name}>
                        {other
                          ? `${other.first_name} ${other.last_name}`
                          : 'Inconnu'}
                      </Text>
                      <Text style={styles.subject}>{conv.subject}</Text>
                    </View>

                    {/* ICÔNE SUPPRESSION (OPTIONNELLE MAIS PRO) */}
                    <TouchableOpacity
                      onPress={() => handleDeleteConversation(conv.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.messageText} numberOfLines={2}>
                    {lastMsg ? lastMsg.content : 'Aucun message'}
                  </Text>

                  <Text style={styles.time}>
                    {lastMsg
                      ? new Date(lastMsg.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.emptyText}>Aucune conversation.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    // marginTop: 12,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  content: {
    padding: 16,
  },
  messageCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
  },
  subject: {
    fontSize: 12,
    color: '#64748B',
  },
  messageText: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    color: '#94A3B8',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748B',
  },
});
