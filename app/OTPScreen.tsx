// app/OTPScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function OTPScreen() {
  const router = useRouter();
  const [code, setCode] = useState(['', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(62);
  const inputs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (text: string, index: number) => {
    if (!/^\d?$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const isCodeComplete = code.every((digit) => digit !== '');

  const handleSubmit = () => {
    if (isCodeComplete) {
      console.log('Code OTP:', code.join(''));
      // router.push('/next');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={28} color="#3D22D4" />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Vérification du code</Text>
        <Text style={styles.subtitle}>
          Veuillez entrer le code que vous avez reçu sur votre adresse email.
        </Text>

        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Temps</Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={styles.otpContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputs.current[index] = ref;
              }}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
              autoFocus={index === 0}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.submitButton,
            isCodeComplete ? styles.submitButtonActive : styles.submitButtonInactive,
          ]}
          onPress={ () => router.push('/NewPasswordScreen')}
          disabled={!isCodeComplete}
        >
          <Text style={isCodeComplete ? styles.submitButtonTextActive : styles.submitButtonTextInactive }>
            ENVOYER
          </Text>
        </TouchableOpacity>
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
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  timerLabel: {
    fontSize: 15,
    color: '#666',
    marginRight: 8,
  },
  timer: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3D22D4',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 40,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  otpBoxFilled: {
    borderColor: '#3D22D4',
    backgroundColor: '#F5F0FF',
  },
  submitButton: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonActive: {
    backgroundColor: '#3D22D4',
  },
  submitButtonInactive: {
    backgroundColor: '#E0E0E0',
  },
  submitButtonTextActive: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  submitButtonTextInactive: {
    color: '#999',
    fontSize: 16,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});