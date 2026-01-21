import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, StatusBar, Alert, Linking } from 'react-native';
import { TextInput, Button, Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { authService } from '@/services/authService';

const theme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, primary: '#3D22D4' },
};

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  

 // --- MOT DE PASSE OUBLIÉ (EMAIL ADMIN) ---
  const handleForgotPassword = () => {
    Alert.alert(
      "Réinitialisation du mot de passe",
      "Pour des raisons de sécurité, seul l’administrateur peut réinitialiser votre compte. Souhaitez-vous le contacter par email ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Contacter l’Admin",
          onPress: () => {
            const adminEmail = "dedjenehermine@gmail.com"; // 👈 email officiel
            const subject = "Demande de réinitialisation de mot de passe";
            const body = `Bonjour, Je suis utilisateur de l’application Eparent. Nom d’utilisateur : ${username || "Non précisé"}
                          J’ai oublié mon mot de passe et je sollicite votre aide pour la réinitialisation.
                          Merci par avance,
                          Cordialement.`;
            const mailUrl = `mailto:${adminEmail}?subject=${encodeURIComponent(
              subject
            )}&body=${encodeURIComponent(body)}`;

            Linking.openURL(mailUrl).catch(() => {
              Alert.alert(
                "Erreur",
                "Impossible d’ouvrir l’application mail sur cet appareil."
              );
            });
          },
        },
      ]
    );
  };


  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setLoading(true);
      await authService.login(username, password);
      const user = await authService.getMe();

      if (user.role === 'PARENT') {
        router.replace('/(parent)/HomeParent');
      } else if (user.role === 'TEACHER') {
        router.replace('/(prof)/HomeProf');
      } else {
        Alert.alert('Erreur', 'Rôle utilisateur inconnu : ' + user.role);
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert('Connexion échouée', 'Identifiants incorrects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaperProvider theme={theme}>
      <ImageBackground style={styles.background}>
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor="#3D22D4" />

          <View style={styles.header}>
            <Text style={styles.appName}>CHRIST-ROI</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Connexion</Text>
            <Text style={styles.subtitle}>
              Bon retour ! Veuillez vous connecter
            </Text>

            <TextInput
              label="Nom d'utilisateur"
              value={username}
              onChangeText={setUsername}
              mode="outlined"
              style={styles.input}
              outlineColor="#ccc"
              activeOutlineColor="#3D22D4"
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              mode="outlined"
              style={styles.input}
              outlineColor="#ccc"
              activeOutlineColor="#3D22D4"
              left={<TextInput.Icon icon="lock-outline" />}
            />

            {/* MODIFICATION ICI : Appel de handleForgotPassword */}
            <TouchableOpacity onPress={handleForgotPassword}>
              <Text style={styles.forgotPassword}>
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              contentStyle={styles.buttonContent}
              style={styles.button}
              labelStyle={styles.buttonLabel}
            >
              Se connecter
            </Button>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </PaperProvider>
  );
}

// ... styles inchangés ...
const styles = StyleSheet.create({
    background: { flex: 1, backgroundColor: '#3D22D4' },
    container: { flex: 1, paddingHorizontal: 24 },
    header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
    appName: { fontSize: 36, fontWeight: 'bold', color: 'white' },
    formContainer: { backgroundColor: 'white', borderRadius: 24, padding: 24, paddingTop: 32, elevation: 8 },
    title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: '#333', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
    input: { marginBottom: 16, backgroundColor: 'white' },
    forgotPassword: { color: '#3D22D4', textAlign: 'right', marginBottom: 24, fontSize: 14 },
    button: { borderRadius: 12, marginTop: 8 },
    buttonContent: { height: 50 },
    buttonLabel: { fontSize: 16, fontWeight: '600' },
  });