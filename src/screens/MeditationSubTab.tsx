import React from 'react';
import {
  View, Text, ScrollView, Image, ImageBackground,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { meditationCategories, programMeditations } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CURATED_SERIES = [
  {
    id: 'cs1', title: 'THE REGAN HILLYER SERIES',
    subtitle: 'A COMPILATION OF MEDITATION SERIES',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80',
  },
  {
    id: 'cs2', title: 'THE NIRAJ NAIK SERIES',
    subtitle: 'TRANSFORMATIVE BREATHWORK MEDITATIONS',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=80',
  },
  {
    id: 'cs3', title: 'THE VISHEN SERIES',
    subtitle: 'GUIDED MEDITATIONS FOR PEAK PERFORMANCE',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
];

const POPULAR_PICKS = [
  { id: 'pp1', title: 'Complete 6 Phase Meditation', author: 'Vishen', rating: 4.8, duration: '18m',
    image: coverUrl('sixphase') },
  { id: 'pp2', title: '3x3 Present in the Moment', author: 'Dina Proctor', rating: 4.5, duration: '3m',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80' },
  { id: 'pp3', title: 'Clearing Mental Clutter With Sacred Geometry', author: 'Jeffrey Allen', rating: 4.6, duration: '7m',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80' },
];

const TOP_RATED = [
  { id: 'tr1', title: 'Embodying Your Wealth Codes', author: 'Juan Pablo Barahona', rating: 4.9, duration: '29m',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&q=80' },
  { id: 'tr2', title: 'Activating Your 12-Strand DNA', author: 'Juan Pablo Barahona', rating: 4.8, duration: '41m',
    image: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=200&q=80' },
  { id: 'tr3', title: 'Pure Flow', author: 'Gabriel Loynaz', rating: 4.8, duration: '8m',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80' },
  { id: 'tr4', title: 'Healing Your Heart', author: 'Ariya Lorenz', rating: 4.8, duration: '26m',
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc96?w=200&q=80' },
];

function coverUrl(key: string): string {
  const map: Record<string, string> = {
    sixphase: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
  };
  return map[key] || 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80';
}

export default function MeditationSubTab() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Hero banner */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1510902568070-e0a0cc43a870?w=800&q=80' }}
        style={styles.hero}
      >
        <View style={styles.heroOverlay} />
        <Text style={styles.heroTitle}>Meditation</Text>
        <Text style={styles.heroSubtitle}>
          A guided practice aimed at achieving mindfulness, relaxation, and self-awareness.
        </Text>
      </ImageBackground>

      {/* Curated series */}
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Curated series</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {CURATED_SERIES.map(s => (
            <TouchableOpacity key={s.id} style={styles.seriesCard} activeOpacity={0.85}>
              <ImageBackground source={{ uri: s.image }} style={styles.seriesBg} imageStyle={styles.seriesBgImg}>
                <View style={styles.seriesOverlay} />
                {/* Hexagon wireframe decoration */}
                <View style={styles.hexWire}>
                  <Ionicons name="stop-outline" size={90} color="rgba(255,255,255,0.25)" />
                </View>
                <View style={styles.seriesTextWrap}>
                  <Text style={styles.seriesTitle}>{s.title}</Text>
                  <View style={styles.seriesSubtitleBadge}>
                    <Text style={styles.seriesSubtitle}>{s.subtitle}</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular picks */}
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Popular picks</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {POPULAR_PICKS.map(item => (
            <TouchableOpacity
              key={item.id} style={styles.pickCard} activeOpacity={0.85}
              onPress={() => navigation.navigate('MeditationPlayer', {
                id: item.id, title: item.title, author: item.author,
                image: item.image, duration: item.duration, rating: item.rating,
              })}
            >
              <Image source={{ uri: item.image }} style={styles.pickImage} />
              <Text style={styles.pickTitle} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.pickAuthor}>{item.author}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={11} color="#F5A623" />
                <Text style={styles.ratingText}> {item.rating} · {item.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Top rated — square thumbs */}
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Top rated</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.topRatedGrid}>
          {TOP_RATED.map(item => (
            <TouchableOpacity key={item.id} style={styles.topRatedItem} activeOpacity={0.85}>
              <Image source={{ uri: item.image }} style={styles.topRatedSquare} />
              <View style={styles.topRatedMeta}>
                <Text style={styles.topRatedTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.topRatedAuthor}>{item.author}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={11} color="#F5A623" />
                  <Text style={styles.ratingText}> {item.rating} · {item.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Meditation categories */}
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Meditation categories</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.categoryGrid}>
          {meditationCategories.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.85}>
              <ImageBackground source={{ uri: cat.image }} style={styles.categoryBg} imageStyle={styles.categoryBgImg}>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* My program meditations */}
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>My program meditations</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {programMeditations.map(prog => (
            <View key={prog.id} style={styles.progCard}>
              <TouchableOpacity style={styles.progHeader} activeOpacity={0.75}>
                <Text style={styles.progTitle}>{prog.programTitle}</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </TouchableOpacity>
              <View style={styles.progThumbs}>
                {prog.meditations.map(med => (
                  <TouchableOpacity key={med.id} style={styles.progThumbWrap} activeOpacity={0.85}>
                    <Image source={{ uri: med.image }} style={styles.progThumb} />
                    <View style={styles.progThumbOverlay} />
                    <View style={styles.progPlayBtn}>
                      <Ionicons name="play" size={12} color="#fff" />
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { height: 180, justifyContent: 'flex-end', padding: 20 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },

  section: { marginBottom: 32 },
  rowHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14, marginTop: 8,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  seeAll: { fontSize: 14, color: colors.teal },
  hScroll: { paddingHorizontal: 20 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 11, color: colors.textMuted },

  // Curated series
  seriesCard: { width: 200, height: 140, marginRight: 14 },
  seriesBg: { flex: 1, justifyContent: 'flex-end' },
  seriesBgImg: { borderRadius: 14 },
  seriesOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 14 },
  hexWire: { position: 'absolute', right: -10, top: 10, opacity: 0.6 },
  seriesTextWrap: { padding: 12 },
  seriesTitle: { fontSize: 14, fontWeight: '800', color: '#fff', lineHeight: 18, marginBottom: 6 },
  seriesSubtitleBadge: { backgroundColor: '#C0392B', paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', borderRadius: 2 },
  seriesSubtitle: { fontSize: 8, fontWeight: '700', color: '#fff', letterSpacing: 0.5 },

  // Popular picks
  pickCard: { width: 160, marginRight: 14 },
  pickImage: { width: 160, height: 150, borderRadius: 12, backgroundColor: colors.backgroundCard, marginBottom: 8 },
  pickTitle: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 3, lineHeight: 18 },
  pickAuthor: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },

  // Top rated — square thumbs
  topRatedGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 14 },
  topRatedItem: { width: '46%', flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  topRatedSquare: { width: 58, height: 58, borderRadius: 8, backgroundColor: colors.backgroundCard },
  topRatedMeta: { flex: 1 },
  topRatedTitle: { fontSize: 13, fontWeight: '600', color: '#fff', marginBottom: 2, lineHeight: 17 },
  topRatedAuthor: { fontSize: 11, color: colors.textSecondary, marginBottom: 3 },

  // Categories
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  categoryCard: { width: '47%', marginHorizontal: '1.5%', aspectRatio: 1.6 },
  categoryBg: { flex: 1, justifyContent: 'flex-end', padding: 10 },
  categoryBgImg: { borderRadius: 12 },
  categoryLabel: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },

  // Program meditations
  progCard: { width: 300, marginRight: 16, backgroundColor: colors.backgroundCard, borderRadius: 14, overflow: 'hidden' },
  progHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border },
  progTitle: { fontSize: 13, fontWeight: '700', color: '#fff', flex: 1 },
  progThumbs: { flexDirection: 'row', padding: 12, gap: 8 },
  progThumbWrap: { position: 'relative', flex: 1 },
  progThumb: { width: '100%', aspectRatio: 1, borderRadius: 8, backgroundColor: colors.backgroundElevated },
  progThumbOverlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 8 },
  progPlayBtn: { position: 'absolute', bottom: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
});
