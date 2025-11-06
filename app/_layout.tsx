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
        <Stack.Screen name="HomeParent" />
        <Stack.Screen name="HomeStudents" />
        <Stack.Screen name="Forums" />
        <Stack.Screen name="ForumDetail" />
        <Stack.Screen name="EmploiScreen" />
        <Stack.Screen name="EmploiDetailScreen" />
        <Stack.Screen name="InfoScreen" />
      </Stack>
    </SafeAreaProvider>
  );
}