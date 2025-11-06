// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="PasswordScreen" />
        <Stack.Screen name="OTPScreen" />
        <Stack.Screen name="NewPasswordScreen" />
      </Stack>
    </SafeAreaProvider>
  );
}