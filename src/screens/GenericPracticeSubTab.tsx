import React, { useState } from 'react';
import {
  View, Text, ScrollView, ImageBackground,
  TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export interface PracticeItem {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  rating: number;
  duration: string;
  image: string;
}

interface Props {
  heroImage: string;
  heroOverlayColor?: string;
  title: string;
  description: string;
  items: PracticeItem[];
}

const { width } = Dimensions.get('window');
const CARD_W = (width - 48) / 2;
const CARD_H = CARD_W * 1.15;

export default function GenericPracticeSubTab({ heroImage, heroOverlayColor = 'rgba(0,0,0,0.35)', title, description, items }: Props) {
  const navigation = useNavigation<Nav>();
  const [sort, setSort] = useState('Latest');
  const [duration, setDuration] = useState('Duration');

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Hero */}
      <ImageBackground source={{ uri: heroImage }} style={styles.hero}>
        <View style={[styles.heroOverlay, { backgroundColor: heroOverlayColor }]} />
      </ImageBackground>
      <View style={styles.heroText}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>{description}</Text>
      </View>

      {/* Sort + Duration pills */}
      <View style={styles.pillRow}>
        <TouchableOpacity style={styles.sortPill} onPress={() => setSort(sort === 'Latest' ? 'Popular' : 'Latest')}>
          <Ionicons name="swap-vertical-outline" size={14} color="#fff" />
          <Text style={styles.pillText}> {sort}</Text>
          <Ionicons name="chevron-down" size={12} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.sortPill}>
          <Ionicons name="time-outline" size={14} color="#fff" />
          <Text style={styles.pillText}> {duration}</Text>
          <Ionicons name="chevron-down" size={12} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* 2-col square card grid */}
      <View style={styles.grid}>
        {items.map(item => (
          <TouchableOpacity
            key={item.id} style={styles.card}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('MeditationPlayer', {
              id: item.id, title: item.title, author: item.author,
              image: item.image, duration: item.duration, rating: item.rating,
            })}
          >
            <ImageBackground source={{ uri: item.image }} style={styles.cardBg} imageStyle={styles.cardBgImg}>
              <View style={styles.cardOverlay} />
              {item.subtitle ? (
                <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
              ) : null}
              <Text style={styles.cardTitle} numberOfLines={4}>{item.title.toUpperCase()}</Text>
              <Text style={styles.cardAuthorOverlay}>{item.author.toUpperCase()}</Text>
              <View style={styles.chevron}>
                <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.7)" />
              </View>
            </ImageBackground>
            <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
            <Text style={styles.itemAuthor}>{item.author}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={11} color="#F5A623" />
              <Text style={styles.ratingText}> {item.rating} · {item.duration}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { height: 130 },
  heroOverlay: { ...StyleSheet.absoluteFillObject },
  heroText: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: colors.textSecondary, lineHeight: 19 },

  pillRow: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 14, gap: 10 },
  sortPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8,
  },
  pillText: { fontSize: 13, color: '#fff', fontWeight: '600' },

  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12 },
  card: { width: CARD_W, marginBottom: 24, marginHorizontal: 6 },

  cardBg: { width: CARD_W, height: CARD_H, justifyContent: 'flex-end' },
  cardBgImg: { borderRadius: 12 },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 12,
  },
  cardSubtitle: {
    position: 'absolute', top: 12, left: 10, right: 10,
    fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.65)',
    letterSpacing: 0.8,
  },
  cardTitle: {
    paddingHorizontal: 10, paddingBottom: 4,
    fontSize: 16, fontWeight: '900', color: '#fff',
    lineHeight: 21,
  },
  cardAuthorOverlay: {
    paddingHorizontal: 10, paddingBottom: 12,
    fontSize: 8, fontWeight: '700', color: 'rgba(255,255,255,0.6)',
    letterSpacing: 0.5,
  },
  chevron: { alignItems: 'center', paddingBottom: 8 },

  itemTitle: { fontSize: 13, fontWeight: '700', color: '#fff', marginTop: 8, marginBottom: 2, lineHeight: 18 },
  itemAuthor: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 11, color: colors.textMuted },
});
