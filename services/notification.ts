import api from './api';

export const notificationsService = {
    // Récupérer la liste des notifications
    getNotifications: async () => {
        const response = await api.get('/api/notifications/');
        return response.data;
    },

    // Récupérer le nombre de notifications non lues
    getUnreadCount: async () => {
        const response = await api.get('/api/notifications/unread-count/');
        return response.data;
    },

    // Marquer une notification comme lue
    markAsRead: async (notificationId: number) => {
        const response = await api.post(`/api/notifications/${notificationId}/mark-read/`);
        return response.data;
    },

    // Tout marquer comme lu
    markAllAsRead: async () => {
        const response = await api.post('/api/notifications/mark-all-read/');
        return response.data;
    }
};
