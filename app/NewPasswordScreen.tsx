// app/NewPasswordScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function NewPasswordScreen() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isValid =
    newPassword.length >= 6 &&
    confirmPassword.length >= 6 &&
    newPassword === confirmPassword;

  const handleSubmit = () => {
    if (isValid) {
      console.log('Nouveau mot de passe défini !');
      // router.replace('/LoginScreen');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={28} color="#3D22D4" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Nouveau mots de passe</Text>
        <Text style={styles.subtitle}>
          Veuillez entrer et confirmer le nouveau mot de passe.
        </Text>

        <TextInput
          label="Nouveau mot de passe"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showPassword}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor="#3D22D4"
          theme={{ roundness: 12 }}
          left={<TextInput.Icon icon="lock-outline" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <TextInput
          label="Confirmation"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          mode="outlined"
          style={styles.input}
          outlineColor="#ddd"
          activeOutlineColor="#3D22D4"
          theme={{ roundness: 12 }}
          left={<TextInput.Icon icon="lock-check-outline" />}
          right={
            <TextInput.Icon
              icon={showConfirm ? 'eye-off' : 'eye'}
              onPress={() => setShowConfirm(!showConfirm)}
            />
          }
          error={!!confirmPassword && newPassword !== confirmPassword}
        />

        {confirmPassword && newPassword !== confirmPassword && (
          <Text style={styles.errorText}>Les mots de passe ne correspondent pas</Text>
        )}

        <Button
          mode="contained"
          onPress={() => router.push('/LoginScreen')}
          disabled={!isValid}
          contentStyle={styles.buttonContent}
          style={[styles.button, !isValid && styles.buttonDisabled]}
          labelStyle={styles.buttonLabel}
        >
          ENVOYER
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    textAlign: 'center',
    marginTop: -8,
    marginBottom: 16,
  },
  button: {
    borderRadius: 12,
    marginTop: 24,
  },
  buttonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  buttonContent: {
    height: 52,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#fff',
  },
});