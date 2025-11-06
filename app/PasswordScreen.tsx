// screens/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context'; // CORRIGÉ
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: '#3D22D4' },
};

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#3D22D4" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Mots de passe oublié ?</Text>
          <Text style={styles.subtitle}>
            Entrez votre email et recevez le code de vérification.
          </Text>

          <TextInput
            label="Adresse e-mail"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            outlineColor="#ccc"
            activeOutlineColor="#3D22D4"
            theme={{ roundness: 12 }}
            left={<TextInput.Icon icon="email-outline" />}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Button
            mode="contained"
            onPress={() => router.push('/OTPScreen')}
            contentStyle={styles.buttonContent}
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            ENVOYER
          </Button>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  content: { flex: 1, paddingHorizontal: 30, justifyContent: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#333', textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 32, lineHeight: 22 },
  input: { marginBottom: 24, backgroundColor: '#fff' },
  button: { borderRadius: 12, marginTop: 16 },
  buttonContent: { height: 52 },
  buttonLabel: { fontSize: 16, fontWeight: '600', textTransform: 'uppercase' },
});