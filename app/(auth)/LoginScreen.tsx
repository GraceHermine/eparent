// app/LoginScreen.tsx
import React, { useState } from 'react';
import {View, Text, StyleSheet, ImageBackground, TouchableOpacity,StatusBar } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: '#3D22D4' },
};

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <PaperProvider theme={theme}>
      <ImageBackground style={styles.background} resizeMode="cover">
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#3D22D4" />

          <View style={styles.header}>
            <Text style={styles.appName}>CHRIST-ROI</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>Bon retour ! Veuillez vous connecter</Text>

            <TextInput label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input}
              outlineColor="#ccc" activeOutlineColor="#3D22D4" theme={{ roundness: 12 }} left={<TextInput.Icon icon="email-outline" />}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              outlineColor="#ccc"
              activeOutlineColor="#3D22D4"
              theme={{ roundness: 12 }}
              left={<TextInput.Icon icon="lock-outline" />}
            />

            {/* NAVIGATION EXPO ROUTER */}
            <TouchableOpacity onPress={() => router.replace("/(auth)/PasswordScreen")}>
              <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={() => router.replace("/(parent)/HomeParent")}
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Se Connecter
            </Button>

            <TouchableOpacity onPress={() => router.replace("/(prof)/HomeProf")}>
              <Text style={styles.forgotPassword}>ici</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#3D22D4' },
  container: { flex: 1, paddingHorizontal: 24 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  appName: { fontSize: 36, fontWeight: 'bold', color: 'white' },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 24,
    paddingTop: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  input: { marginBottom: 16, backgroundColor: 'white' },
  forgotPassword: { color: '#3D22D4', textAlign: 'right', marginBottom: 24, fontSize: 14 },
  button: { borderRadius: 12, marginTop: 8 },
  buttonContent: { height: 50 },
  buttonLabel: { fontSize: 16, fontWeight: '600' },
});