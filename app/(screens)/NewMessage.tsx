import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
// import { useRouter } from "expo-router";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { messagingService } from '../../services/message';
import { coreService } from '../../services/core';
import { authService } from '../../services/authService';

export default function NewMessage() {
    const router = useRouter();
    const [subject, setSubject] = useState("");
    const [recipients, setRecipients] = useState<any[]>([]); // Liste des destinataires possibles (Profs)
    const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadRecipients();
    }, []);

    const loadRecipients = async () => {
        try {
            const contacts = await messagingService.getContacts();
            setRecipients(contacts);
        } catch (error) {
            console.error("Erreur chargement destinataires:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!subject.trim() || !selectedRecipient) {
            Alert.alert("Erreur", "Veuillez choisir un destinataire et un sujet");
            return;
        }

        setSubmitting(true);
        try {
            const data = {
                subject: subject,
                recipient: selectedRecipient.id
            };
            const result = await messagingService.createConversation(data);
            router.replace({ pathname: '/(screens)/MessageDetails', params: { id: result.id } });
        } catch (error) {
            console.error("Erreur création conversation:", error);
            Alert.alert("Erreur", "Impossible de créer la conversation");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nouveau Message</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.label}>Destinataire :</Text>
                <View style={styles.recipientContainer}>
                    {recipients.map(r => (
                        <TouchableOpacity
                            key={r.id}
                            style={[styles.recipientChip, selectedRecipient?.id === r.id && styles.recipientChipSelected]}
                            onPress={() => setSelectedRecipient(r)}
                        >
                            <Text style={[styles.recipientText, selectedRecipient?.id === r.id && styles.recipientTextSelected]}>
                                {r.first_name} {r.last_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.label}>Sujet :</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Sujet de la conversation"
                    value={subject}
                    onChangeText={setSubject}
                />

                <TouchableOpacity
                    style={[styles.createButton, submitting && styles.disabledButton]}
                    onPress={handleCreate}
                    disabled={submitting}
                >
                    {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.createButtonText}>Commencer</Text>}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8FAFC" },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: "#3D22D4",
    },
    headerTitle: { color: "#FFF", fontSize: 18, fontWeight: "700" },
    backButton: { width: 40, alignItems: 'center' },
    content: { padding: 20 },
    label: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#333" },
    input: {
        backgroundColor: "#FFF",
        padding: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#DDD",
        marginBottom: 20,
        fontSize: 16,
    },
    createButton: {
        backgroundColor: "#3D22D4",
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 20,
    },
    disabledButton: { opacity: 0.7 },
    createButtonText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
    recipientContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
    recipientChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: "#E0E0E0",
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
    recipientChipSelected: { backgroundColor: "#3D22D4" },
    recipientText: { color: "#333" },
    recipientTextSelected: { color: "#FFF" },
});
