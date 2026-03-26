import React from 'react';
import {
  View, Text, ScrollView, Image, ImageBackground,
  TouchableOpacity, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { soundCategories } from '../data/mockData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const POPULAR_SOUNDS = [
  { id: 'ps1', title: 'Alpha Beats', author: 'Vishen', rating: 4.6,
    image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80' },
  { id: 'ps2', title: 'Theta Beats', author: 'Jose Silva', rating: 4.7,
    image: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=400&q=80' },
  { id: 'ps3', title: 'Delta Waves – Deep Sleep', author: 'Gabriel Loynaz', rating: 4.8,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80' },
  { id: 'ps4', title: 'Gamma Waves', author: 'Vishen', rating: 4.6,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80' },
];

const TOP_RATED_SOUNDS = [
  { id: 'trs1', title: 'Ocean Healing', author: 'Gabriel Loynaz', rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&q=80' },
  { id: 'trs2', title: '528 Hz – The Love Frequency', author: 'Gabriel Loynaz', rating: 4.9,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80' },
  { id: 'trs3', title: 'Throat Chakra – Communication', author: 'Gabriel Loynaz', rating: 4.9,
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&q=80' },
  { id: 'trs4', title: 'Root Chakra', author: 'Gabriel Loynaz', rating: 4.9,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&q=80' },
];

const SOUND_CATEGORIES_EXTENDED = [
  { id: 'sc1', label: 'ALTERED STATES', image: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80' },
  { id: 'sc2', label: 'SLEEP',          image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&q=80' },
  { id: 'sc3', label: 'NATURE',         image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80' },
  { id: 'sc4', label: 'BINAURAL',       image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80' },
];

export default function SoundscapeSubTab() {
  const navigation = useNavigation<Nav>();

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Hero banner */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?w=800&q=80' }}
        style={styles.hero}
      >
        <View style={styles.heroOverlay} />
        <Text style={styles.heroTitle}>Soundscape</Text>
        <Text style={styles.heroSubtitle}>
          A type of audio that uses natural or artificial sounds to create immersive environments, often for relaxation or enhancing focus.
        </Text>
      </ImageBackground>

      {/* Experience sounds for mindfulness banner */}
      <View style={styles.bannerWrap}>
        <TouchableOpacity activeOpacity={0.9}>
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?w=800&q=80' }}
            style={styles.soundsBanner}
            imageStyle={styles.soundsBannerImg}
          >
            <View style={styles.soundsBannerOverlay} />
            <Text style={styles.soundsBannerTitle}>Experience sounds for mindfulness</Text>
            <TouchableOpacity style={styles.soundsBannerBtn}>
              <Text style={styles.soundsBannerBtnText}>Play me a sound</Text>
            </TouchableOpacity>
          </ImageBackground>
        </TouchableOpacity>
      </View>

      {/* Popular picks — circular cards */}
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Popular picks</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {POPULAR_SOUNDS.map(item => (
            <TouchableOpacity
              key={item.id} style={styles.soundCard} activeOpacity={0.85}
              onPress={() => navigation.navigate('SoundPlayer', {
                id: item.id, title: item.title, author: item.author, image: item.image,
              })}
            >
              <View style={styles.soundCircleWrap}>
                <Image source={{ uri: item.image }} style={styles.soundCircle} />
                {/* Chevron on bottom of circle */}
                <View style={styles.soundChevron}>
                  <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.7)" />
                </View>
              </View>
              <Text style={styles.soundTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.soundAuthor}>{item.author}</Text>
              <View style={styles.ratingRow}>
                <Ionicons name="star" size={11} color="#F5A623" />
                <Text style={styles.ratingText}> {item.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Top rated — circular thumbs */}
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Top rated</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.topRatedGrid}>
          {TOP_RATED_SOUNDS.map(item => (
            <TouchableOpacity key={item.id} style={styles.topRatedItem} activeOpacity={0.85}>
              <Image source={{ uri: item.image }} style={styles.topRatedCircle} />
              <View style={styles.topRatedMeta}>
                <Text style={styles.topRatedTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.topRatedAuthor}>{item.author}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={11} color="#F5A623" />
                  <Text style={styles.ratingText}> {item.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sound categories */}
      <View style={styles.section}>
        <View style={styles.rowHeader}>
          <Text style={styles.sectionTitle}>Sound categories</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <View style={styles.categoryGrid}>
          {SOUND_CATEGORIES_EXTENDED.map(cat => (
            <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.85}>
              <ImageBackground source={{ uri: cat.image }} style={styles.categoryBg} imageStyle={styles.categoryBgImg}>
                {/* Diamond wireframe decoration */}
                <View style={styles.diamondWire}>
                  <Ionicons name="diamond-outline" size={70} color="rgba(255,255,255,0.2)" />
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hero: { height: 200, justifyContent: 'flex-end', padding: 20 },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,30,60,0.5)' },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 6 },
  heroSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },

  bannerWrap: { paddingHorizontal: 16, marginBottom: 28, marginTop: 16 },
  soundsBanner: { height: 160, justifyContent: 'flex-end', padding: 20 },
  soundsBannerImg: { borderRadius: 16 },
  soundsBannerOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,60,0.35)', borderRadius: 16 },
  soundsBannerTitle: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 14, lineHeight: 26 },
  soundsBannerBtn: { backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 30, alignSelf: 'flex-start' },
  soundsBannerBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },

  section: { marginBottom: 32 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  seeAll: { fontSize: 14, color: colors.teal },
  hScroll: { paddingHorizontal: 20 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 11, color: colors.textMuted },

  // Circular sound cards
  soundCard: { width: 150, marginRight: 16, alignItems: 'center' },
  soundCircleWrap: { width: 150, height: 150, marginBottom: 10, position: 'relative' },
  soundCircle: { width: 150, height: 150, borderRadius: 75, backgroundColor: colors.backgroundCard },
  soundChevron: { position: 'absolute', bottom: 6, left: 0, right: 0, alignItems: 'center' },
  soundTitle: { fontSize: 13, fontWeight: '700', color: '#fff', marginBottom: 3, textAlign: 'center' },
  soundAuthor: { fontSize: 12, color: colors.textSecondary, marginBottom: 4, textAlign: 'center' },

  // Top rated — circular
  topRatedGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 14 },
  topRatedItem: { width: '46%', flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  topRatedCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.backgroundCard },
  topRatedMeta: { flex: 1 },
  topRatedTitle: { fontSize: 12, fontWeight: '600', color: '#fff', marginBottom: 2, lineHeight: 17 },
  topRatedAuthor: { fontSize: 11, color: colors.textSecondary, marginBottom: 3 },

  // Categories
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 8 },
  categoryCard: { width: '47%', marginHorizontal: '1.5%', aspectRatio: 1.6 },
  categoryBg: { flex: 1, justifyContent: 'flex-end', padding: 10 },
  categoryBgImg: { borderRadius: 12 },
  diamondWire: { position: 'absolute', right: 4, top: 4 },
  categoryLabel: { fontSize: 15, fontWeight: '900', color: '#fff', letterSpacing: 0.5 },
});
