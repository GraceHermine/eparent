import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COLORS = [
  "#3D22D4", // RebeccaPurple (violet profond)
  "#007AFF", // DodgerBlue (bleu iOS)
  "#4CAF50", // MediumSeaGreen (vert)
  "#FF2D55", // Crimson (rose vif)
  "#FF9500", // DarkOrange (orange iOS)
  "#5856D6", // Indigo (indigo)
  "#34C759", // LimeGreen (vert menthe iOS)
  "#5AC8FA", // LightSkyBlue (bleu ciel)
  "#AF52DE", // MediumOrchid (violet doux)
  "#FFCC00", // Gold (jaune doux)
  "#64D2FF", // SkyBlue (bleu clair pastel)
  "#30B0C7", // MediumTurquoise (turquoise)
  "#BF5AF2", // Orchid (lavande)
  "#A2845E", // Tan (beige chaud)
  "#FF9F0A", // DarkOrange (orange pastel)
  "#6E6E73", // DimGray (gris moderne)
  "#8E8E93", // Gray (gris iOS)
  "#1E88E5", // RoyalBlue (bleu profond)
];

const WALLPAPERS = [
  { id: '1', name: 'Par défaut', uri: 'https://www.transparenttextures.com/patterns/cubes.png' },
  { id: '2', name: 'Nuit Star', uri: 'https://i.pinimg.com/originals/a2/7a/a3/a27aa34091515ef07f781507727e4e10.jpg' },
  { id: '3', name: 'Abstrait', uri: 'https://images.unsplash.com/photo-1557683316-973673baf926' },
];

export default function ChatAppearance() {
  const router = useRouter();
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedBg, setSelectedBg] = useState(WALLPAPERS[0].uri);

  useEffect(() => {
    const loadCurrent = async () => {
      const c = await AsyncStorage.getItem('chat_bubble_color');
      const b = await AsyncStorage.getItem('chat_wallpaper');
      if (c) setSelectedColor(c);
      if (b) setSelectedBg(b);
    };
    loadCurrent();
  }, []);

  const saveAndExit = async () => {
    await AsyncStorage.setItem('chat_bubble_color', selectedColor);
    await AsyncStorage.setItem('chat_wallpaper', selectedBg);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="close" size={28} color="#000" /></TouchableOpacity>
        <Text style={styles.title}>Apparence</Text>
        <TouchableOpacity onPress={saveAndExit}><Text style={styles.saveBtn}>OK</Text></TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Couleur des messages</Text>
      <View style={{ height: 70 }}>
        <FlatList 
          horizontal data={COLORS}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setSelectedColor(item)}
              style={[styles.colorCircle, { backgroundColor: item, borderWidth: selectedColor === item ? 4 : 0, borderColor: '#DDD' }]} 
            />
          )}
        />
      </View>

      <Text style={styles.sectionTitle}>Fond d'écran</Text>
      <FlatList 
        horizontal data={WALLPAPERS}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelectedBg(item.uri)} style={styles.bgOption}>
            <Image source={{ uri: item.uri }} style={[styles.bgImage, selectedBg === item.uri && styles.selectedImg]} />
            <Text style={styles.bgLabel}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold' },
  saveBtn: { color: '#3D22D4', fontWeight: 'bold', fontSize: 18 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginVertical: 15, color: '#888', textTransform: 'uppercase' },
  colorCircle: { width: 45, height: 45, borderRadius: 25, marginRight: 12 },
  bgOption: { marginRight: 15, alignItems: 'center' },
  bgImage: { width: 110, height: 180, borderRadius: 12, backgroundColor: '#EEE' },
  selectedImg: { borderWidth: 4, borderColor: '#3D22D4' },
  bgLabel: { marginTop: 8, fontSize: 13, color: '#333' }
});