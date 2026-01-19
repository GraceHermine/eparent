import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  Animated
} from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { notificationsService } from '../../services/notification';

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  is_read: boolean;
  type?: 'GRADE' | 'ATTENDANCE' | 'MESSAGE' | string;
}

export default function NotificationScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  const loadNotifications = useCallback(async () => {
    try {
      if (!refreshing) setLoading(true);
      const data = await notificationsService.getNotifications();
      setNotifications(data);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error("Erreur chargement notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      console.error("Erreur marquage tout lu:", error);
    }
  };

  const handleNotificationPress = async (notif: Notification) => {
    try {
      if (!notif.is_read) {
        await notificationsService.markAsRead(notif.id);
        setNotifications(prev =>
          prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n)
        );
      }
      // router.push('/(screens)/EmploiDetail');
    } catch (error) {
      console.error("Erreur lecture notification:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const renderIcon = (type?: string) => {
    switch (type) {
      case 'GRADE': return { name: 'school', color: '#10B981' };
      case 'ATTENDANCE': return { name: 'alert-circle', color: '#EF4444' };
      case 'MESSAGE': return { name: 'chatbubble-ellipses', color: '#3B82F6' };
      default: return { name: 'notifications', color: '#64748B' };
    }
  };

  const renderRightActions = (id: number) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDelete(id)}
      >
        <Ionicons name="trash-bin-outline" size={24} color="#FFF" />
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const iconData = renderIcon(item.type);
    return (
      <Animated.View style={{ opacity: fadeAnim }}>
        <Swipeable
          renderRightActions={() => renderRightActions(item.id)}
          friction={2}
          rightThreshold={40}
        >
          <TouchableOpacity
            style={[styles.notifCard, !item.is_read && styles.unReadCard]}
            onPress={() => handleNotificationPress(item)}
            activeOpacity={0.8}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${iconData.color}20` }]}>
              <Ionicons name={iconData.name as any} size={22} color={iconData.color} />
            </View>

            <View style={styles.contentContainer}>
              <View style={styles.notifHeader}>
                <Text style={[styles.notifTitle, !item.is_read && styles.boldText]}>
                  {item.title}
                </Text>
                {!item.is_read && <View style={styles.blueDot} />}
              </View>
              <Text style={styles.notifMessage} numberOfLines={2}>
                {item.message}
              </Text>
              <Text style={styles.notifTime}>
                {new Date(item.created_at).toLocaleDateString('fr-FR', {
                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                })}
              </Text>
            </View>
          </TouchableOpacity>
        </Swipeable>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
            <Text style={styles.markReadText}>Tout marquer comme lu</Text>
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#3B82F6" />
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#3B82F6']}
                progressBackgroundColor="#FFF"
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="notifications-off-outline" size={60} color="#CBD5E1" />
                <Text style={styles.emptyText}>Aucune notification pour le moment</Text>
                <Text style={styles.emptySubtext}>Reviens plus tard !</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  backButton: {
    padding: 4,
  },
  markReadText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  unReadCard: {
    borderColor: '#E0E7FF',
    backgroundColor: '#F0F9FF',
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: 15,
    color: '#1E293B',
    flex: 1,
  },
  boldText: {
    fontWeight: '700',
  },
  blueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  notifMessage: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 6,
  },
  notifTime: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 12,
    marginBottom: 12,
    marginLeft: 10,
  },
  deleteText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    marginTop: 4,
    color: '#9CA3AF',
    fontSize: 14,
  },
});
