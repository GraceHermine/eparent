import api from "./api";

export const messagingService = {

    // Récupérer les profs/admin
    getContacts: async () => {
        const response = await api.get('/api/messaging/contacts/');
        return response.data;
    },

    // Récupérer les enfants du parent
    getChildren: async () => {
        const response = await api.get('/api/parent/students/'); // à adapter si tu as déjà l'API
        return response.data;
    },

    // Créer une conversation
    createConversation: async (subject: string, recipientId: number, studentId?: number) => {
        const response = await api.post('/api/messaging/conversations/create/', {
            subject,
            recipient: recipientId,
            student: studentId || null
        });
        return response.data;
    },

    getConversations: async () => {
        const response = await api.get('/api/messaging/conversations/');
        return response.data;
    },

    getConversationDetails: async (conversationId: number) => {
        const response = await api.get(`/api/messaging/conversations/${conversationId}/messages/`);
        return response.data;
    },

    sendMessage: async (conversationId: number, content: string) => {
        const response = await api.post(`/api/messaging/conversations/${conversationId}/messages/create/`, { content });
        return response.data;
    },
    deleteConversation(conversationId: number) {
        return api.delete(`/messages/conversations/${conversationId}/`);
    },


};
