import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, ImageBackground,
  TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - 48) / 2;

const SOUND_HEALING_ITEMS = [
  { id: 'sh1',  title: 'Monaural Sleep Sync',                   subtitle: 'MORRY METHOD',         author: 'Morry Zelcovitch', rating: 4.5, image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80' },
  { id: 'sh2',  title: 'Healing Harmonies',                     subtitle: '',                      author: 'Luis Perla',       rating: 4.8, image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc96?w=400&q=80' },
  { id: 'sh3',  title: "Vowel 'A' Chant",                       subtitle: '',                      author: 'Gabriel Loynaz',   rating: 4.7, image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80' },
  { id: 'sh4',  title: "Vowel 'E' Chant",                       subtitle: '',                      author: 'Gabriel Loynaz',   rating: 4.7, image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80' },
  { id: 'sh5',  title: 'Love Frequency',                        subtitle: '',                      author: 'Gabriel Loynaz',   rating: 4.9, image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80' },
  { id: 'sh6',  title: 'Emotions & Harmonize',                  subtitle: '',                      author: 'Gabriel Loynaz',   rating: 4.8, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&q=80' },
  { id: 'sh7',  title: '741 Hz – Awakening Intuition & Problem Solving', subtitle: 'SOLFEGGIO FREQUENCIES', author: 'Gabriel Loynaz', rating: 4.8, image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=400&q=80' },
  { id: 'sh8',  title: '852 Hz – Communicate With & Live in Harmony With Your Highest Self', subtitle: 'SOLFEGGIO FREQUENCIES', author: 'Gabriel Loynaz', rating: 4.9, image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&q=80' },
  { id: 'sh9',  title: '963 Hz – Divine Consciousness & Enlightenment', subtitle: 'SOLFEGGIO FREQUENCIES', author: 'Gabriel Loynaz', rating: 4.8, image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80' },
  { id: 'sh10', title: 'Alpha Beats',                           subtitle: '',                      author: 'Vishen',           rating: 4.6, image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80' },
];

// Extract short title for overlay (first meaningful line)
function shortTitle(title: string): string {
  if (title.includes('Hz')) return title.split('–')[0].trim();
  if (title.includes(':')) return title.split(':')[1]?.trim() || title;
  return title.toUpperCase();
}

export default function SoundHealingSubTab() {
  const navigation = useNavigation<Nav>();
  const [sort, setSort] = useState('Latest');

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80' }}
        style={styles.hero}
      >
        <View style={styles.heroOverlay} />
      </ImageBackground>
      <View style={styles.heroText}>
        <Text style={styles.heroTitle}>Sound Healing</Text>
        <Text style={styles.heroSubtitle}>
          A therapeutic practice that uses sound frequencies to promote relaxation and healing.
        </Text>
      </View>

      {/* Sort pill */}
      <View style={styles.pillRow}>
        <TouchableOpacity style={styles.sortPill} onPress={() => setSort(sort === 'Latest' ? 'Popular' : 'Latest')}>
          <Ionicons name="swap-vertical-outline" size={14} color="#fff" />
          <Text style={styles.sortText}> {sort}</Text>
          <Ionicons name="chevron-down" size={12} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Circular 2-col grid */}
      <View style={styles.grid}>
        {SOUND_HEALING_ITEMS.map(item => (
          <TouchableOpacity
            key={item.id} style={styles.gridItem}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SoundPlayer', {
              id: item.id, title: item.title, author: item.author, image: item.image,
            })}
          >
            {/* Circular image with text overlay */}
            <View style={styles.circle}>
              <Image source={{ uri: item.image }} style={styles.circleImg} />
              <View style={styles.circleOverlay} />
              {item.subtitle ? (
                <Text style={styles.circleSubtitle}>{item.subtitle}</Text>
              ) : null}
              <Text style={styles.circleTitle} numberOfLines={3}>{shortTitle(item.title).toUpperCase()}</Text>
              <Text style={styles.circleAuthor}>{item.author}</Text>
              <View style={styles.circleChevron}>
                <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.7)" />
              </View>
            </View>
            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.itemAuthor}>{item.author}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={11} color="#F5A623" />
              <Text style={styles.ratingText}> {item.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { height: 140 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(40,0,60,0.4)' },
  heroText: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  pillRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, gap: 10 },
  sortPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
  },
  sortText: { fontSize: 13, color: '#fff', fontWeight: '600' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  gridItem: { width: CARD_SIZE, marginBottom: 24, marginHorizontal: 8 },

  // Circular card
  circle: {
    width: CARD_SIZE, height: CARD_SIZE, borderRadius: CARD_SIZE / 2,
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
    marginBottom: 10, position: 'relative',
  },
  circleImg: { position: 'absolute', width: '100%', height: '100%' },
  circleOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.42)' },
  circleSubtitle: {
    position: 'absolute', top: '28%',
    fontSize: 9, fontWeight: '700', color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1, textAlign: 'center', paddingHorizontal: 16,
  },
  circleTitle: {
    fontSize: 18, fontWeight: '900', color: '#fff',
    textAlign: 'center', paddingHorizontal: 14, lineHeight: 22,
  },
  circleAuthor: {
    position: 'absolute', bottom: '18%',
    fontSize: 9, color: 'rgba(255,255,255,0.65)', textAlign: 'center',
  },
  circleChevron: {
    position: 'absolute', bottom: 8,
    alignItems: 'center',
  },

  itemTitle: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 2, lineHeight: 18 },
  itemAuthor: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 11, color: colors.textMuted },
});
