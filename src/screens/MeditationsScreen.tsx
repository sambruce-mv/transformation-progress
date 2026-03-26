import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { colors } from '../theme/colors';
import MeditationSubTab from './MeditationSubTab';
import SoundscapeSubTab from './SoundscapeSubTab';
import SoundHealingSubTab from './SoundHealingSubTab';
import GenericPracticeSubTab from './GenericPracticeSubTab';
import {
  todayMeditations,
  meditationPractices,
  meditationCategories,
  soundCategories,
  recentlyPlayed,
  programMeditations,
} from '../data/mockData';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const TABS = ['All', 'Meditation', 'Soundscape', 'Sound Healing', 'Hypnotherapy', 'Visualization', 'Breathwork'];
const DURATION_FILTERS = ['UNDER 5 MINS', 'UNDER 10 MINS', 'UNDER 20 MINS'];

const FAVORITES = [
  { id: '1', title: 'Clearing Mental Clutter With Sacred Geometry', author: 'Jeffrey Allen',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80', round: false },
  { id: '2', title: 'Leo', author: 'Gabriel Loynaz',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80', round: true },
];

const TOP_RATED = [
  { id: '1', title: 'Ocean Healing', author: 'Gabriel Loynaz', rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&q=80' },
  { id: '2', title: '528 Hz – The Love Frequency', author: 'Gabriel Loynaz', rating: 4.9,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80' },
  { id: '3', title: 'Throat Chakra – Communication', author: 'Gabriel Loynaz', rating: 4.9,
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=200&q=80' },
  { id: '4', title: 'Root Chakra', author: 'Gabriel Loynaz', rating: 4.9,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=200&q=80' },
];

const TODAY_MEDS = [
  { id: 't1', title: 'The Havening Technique', author: 'Paul McKenna', rating: 4.6, duration: '4m',
    bucket: 'UNDER 5 MINS', image: 'https://assets.mindvalley.com/api/v1/assets/afd1e11c-cf1d-4c19-a853-abc758da55e9.jpg' },
  { id: 't2', title: 'The Relaxation Meditation', author: 'Paul McKenna', rating: 4.7, duration: '8m',
    bucket: 'UNDER 10 MINS', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80' },
  { id: 't3', title: 'Perfect Blueprint for You', author: 'Regan Hillyer', rating: 4.5, duration: '12m',
    bucket: 'UNDER 20 MINS', image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc96?w=400&q=80' },
  { id: 't4', title: 'The 6 Phase Meditation', author: 'Vishen Lakhiani', rating: 4.8, duration: '19m',
    bucket: 'UNDER 20 MINS', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
];

export default function MeditationsScreen() {
  const [activeTab, setActiveTab] = useState('All');
  const [durationFilter, setDurationFilter] = useState('UNDER 5 MINS');
  const navigation = useNavigation<NavigationProp>();

  const filteredMeds = durationFilter === 'UNDER 5 MINS'
    ? TODAY_MEDS.filter(m => parseInt(m.duration) <= 5)
    : durationFilter === 'UNDER 10 MINS'
    ? TODAY_MEDS.filter(m => parseInt(m.duration) <= 10)
    : TODAY_MEDS;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabBar}
        style={styles.tabBarWrap}
      >
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {activeTab === 'Meditation' && <MeditationSubTab />}
      {activeTab === 'Soundscape' && <SoundscapeSubTab />}
      {activeTab === 'Sound Healing' && <SoundHealingSubTab />}
      {activeTab === 'Hypnotherapy' && (
        <GenericPracticeSubTab
          heroImage="https://images.unsplash.com/photo-1551739440-5dd934d3a94a?w=800&q=80"
          heroOverlayColor="rgba(30,15,0,0.45)"
          title="Hypnotherapy"
          description="A therapeutic practice that uses guided relaxation and focused attention to achieve a heightened state of awareness."
          items={[
            { id: 'hy1', title: 'Becoming Your Best Self', subtitle: 'REMARKABLE TRANSFORMATION', author: 'House of Wellbeing', rating: 4.6, duration: '19m', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80' },
            { id: 'hy2', title: 'Ease Sadness & Depression Daytime Affirmation', subtitle: 'DAYTIME AFFIRMATION SERIES', author: 'Dr. Steve G. Jones', rating: 4.5, duration: '30m', image: 'https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?w=400&q=80' },
            { id: 'hy3', title: 'Improve Concentration & Focus', subtitle: '', author: 'Dr. Steve G. Jones', rating: 4.7, duration: '25m', image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=400&q=80' },
            { id: 'hy4', title: 'Cope With Divorce', subtitle: 'DAYTIME AFFIRMATION SERIES', author: 'Dr. Steve G. Jones', rating: 4.4, duration: '22m', image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80' },
            { id: 'hy5', title: 'Stop Smoking Now', subtitle: '', author: 'Marisa Peer', rating: 4.8, duration: '35m', image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&q=80' },
            { id: 'hy6', title: 'Deep Sleep Hypnosis', subtitle: '', author: 'Marisa Peer', rating: 4.9, duration: '45m', image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&q=80' },
          ]}
        />
      )}
      {activeTab === 'Visualization' && (
        <GenericPracticeSubTab
          heroImage="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80"
          heroOverlayColor="rgba(40,0,20,0.35)"
          title="Visualization"
          description="A mental exercise where participants are guided to imagine specific outcomes, scenes, or goals."
          items={[
            { id: 'vi1', title: 'Vibrant Health and Body Activation: Sculpting Your Ideal Self', subtitle: 'VIBRANT HEALTH AND BODY ACTIVATION', author: 'Regan Hillyer', rating: 4.6, duration: '19m', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80' },
            { id: 'vi2', title: 'Infinite Abundance Activation: Entering the Wealth Stream', subtitle: 'INFINITE ABUNDANCE ACTIVATION', author: 'Regan Hillyer', rating: 4.6, duration: '19m', image: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=400&q=80' },
            { id: 'vi3', title: 'Perfect Day Blueprint: Morning Ritual for Your Ideal Life', subtitle: 'PERFECT DAY BLUEPRINT', author: 'Regan Hillyer', rating: 4.7, duration: '14m', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
            { id: 'vi4', title: 'Soul Deepening Activation: Expanding Your Spiritual Connection', subtitle: 'SOUL DEEPENING ACTIVATION', author: 'Regan Hillyer', rating: 4.8, duration: '22m', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80' },
            { id: 'vi5', title: 'Magnetic Confidence: Stepping Into Your Power', subtitle: '', author: 'Regan Hillyer', rating: 4.6, duration: '17m', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80' },
          ]}
        />
      )}
      {activeTab === 'Breathwork' && (
        <GenericPracticeSubTab
          heroImage="https://images.unsplash.com/photo-1428908728789-d2de25dbd4e2?w=800&q=80"
          heroOverlayColor="rgba(0,20,40,0.3)"
          title="Breathwork"
          description="A practice that uses specific breathing techniques to control breath in ways that influence your physical and emotional state."
          items={[
            { id: 'bw1', title: 'Vitality Unleashed: SOMA Breath for Optimal Health', subtitle: 'VITALITY UNLEASHED', author: 'Niraj Naik', rating: 4.8, duration: '42m', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80' },
            { id: 'bw2', title: 'Journey to Bliss: SOMA Breath for Inner Harmony', subtitle: 'JOURNEY TO BLISS', author: 'Niraj Naik', rating: 4.8, duration: '38m', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
            { id: 'bw3', title: 'Manifest Your Desires: SOMA Breath for Abundant Living', subtitle: 'MANIFEST YOUR DESIRES', author: 'Niraj Naik', rating: 4.7, duration: '35m', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80' },
            { id: 'bw4', title: 'Inner Calm: SOMA Breath for Anxiety Release', subtitle: 'INNER CALM', author: 'Niraj Naik', rating: 4.9, duration: '30m', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80' },
            { id: 'bw5', title: 'Power & Purpose: SOMA Breath for Deep Focus', subtitle: 'POWER & PURPOSE', author: 'Niraj Naik', rating: 4.7, duration: '28m', image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=400&q=80' },
          ]}
        />
      )}

      {activeTab === 'All' && <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Daily Target ─────────────────────────────────── */}
        <View style={styles.targetCard}>
          <View style={styles.targetIconWrap}>
            <Ionicons name="radio-button-on" size={26} color="#F5A623" />
          </View>
          <View style={styles.targetInfo}>
            <Text style={styles.targetLabel}>Daily target</Text>
            <Text style={styles.targetProgress}>0 / 5 mins</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%' }]} />
            </View>
          </View>
          <TouchableOpacity>
            <Ionicons name="ellipsis-horizontal" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* ── Favorites ────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorites</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {FAVORITES.map(item => (
              <TouchableOpacity key={item.id} style={styles.favCard} activeOpacity={0.85}>
                <Image
                  source={{ uri: item.image }}
                  style={[styles.favImage, item.round && styles.favImageRound]}
                />
                <Text style={styles.favTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.favAuthor}>{item.author}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Top Rated ────────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>Top rated</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <View style={styles.topRatedGrid}>
            {TOP_RATED.map(item => (
              <TouchableOpacity key={item.id} style={styles.topRatedItem} activeOpacity={0.85}>
                <Image source={{ uri: item.image }} style={styles.topRatedThumb} />
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

        {/* ── Your Meditations for Today ───────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your meditations for today</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.hScroll, { marginBottom: 12 }]}
          >
            {DURATION_FILTERS.map(f => (
              <TouchableOpacity
                key={f} style={[styles.durationPill, durationFilter === f && styles.durationPillActive]}
                onPress={() => setDurationFilter(f)}
              >
                <Ionicons name="time-outline" size={11} color={durationFilter === f ? '#000' : colors.textMuted} />
                <Text style={[styles.durationText, durationFilter === f && styles.durationTextActive]}> {f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {(filteredMeds.length > 0 ? filteredMeds : TODAY_MEDS).map(med => (
              <TouchableOpacity
                key={med.id} style={styles.medCard} activeOpacity={0.85}
                onPress={() => navigation.navigate('MeditationPlayer', {
                  id: med.id, title: med.title, author: med.author,
                  image: med.image, duration: med.duration, rating: med.rating,
                })}
              >
                <Image source={{ uri: med.image }} style={styles.medImage} />
                <Text style={styles.medTitle} numberOfLines={2}>{med.title}</Text>
                <Text style={styles.medAuthor}>{med.author}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={11} color="#F5A623" />
                  <Text style={styles.ratingText}> {med.rating}</Text>
                  <Text style={styles.ratingText}> · {med.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Explore by Practices ─────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore by practices</Text>
          <View style={styles.practicesGrid}>
            {[0, 2, 4].map(rowStart => (
              <View key={rowStart} style={styles.practicesRow}>
                {meditationPractices.slice(rowStart, rowStart + 2).map(p => (
                  <TouchableOpacity key={p.id} style={styles.practiceTile} activeOpacity={0.85}>
                    <ImageBackground source={{ uri: p.image }} style={styles.practiceBg} imageStyle={styles.practiceBgImg}>
                      <View style={styles.practiceIconCircle}>
                        <Ionicons name={p.icon as any} size={18} color="#fff" />
                      </View>
                      <Text style={styles.practiceLabel}>{p.label}</Text>
                    </ImageBackground>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* ── Meditation Categories ─────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>Meditation categories</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {meditationCategories.map(cat => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.85}>
                <ImageBackground source={{ uri: cat.image }} style={styles.categoryBg} imageStyle={styles.categoryBgImg}>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Sound Categories ────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>Sound categories</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {soundCategories.map(cat => (
              <TouchableOpacity key={cat.id} style={styles.categoryCard} activeOpacity={0.85}>
                <ImageBackground source={{ uri: cat.image }} style={styles.categoryBg} imageStyle={styles.categoryBgImg}>
                  <Text style={styles.categoryLabel}>{cat.label}</Text>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Recently Played ─────────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>Recently played</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <View style={styles.recentGrid}>
            {recentlyPlayed.map(item => (
              <TouchableOpacity key={item.id} style={styles.recentItem} activeOpacity={0.85}>
                <Image source={{ uri: item.image }} style={styles.recentThumb} />
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.recentAuthor}>{item.author}</Text>
                  <Text style={styles.recentDuration}>{item.duration}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── My Program Meditations ──────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.rowHeader}>
            <Text style={styles.sectionTitle}>My program meditations</Text>
            <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {programMeditations.map(prog => (
              <View key={prog.id} style={styles.progMedCard}>
                <TouchableOpacity style={styles.progMedHeader} activeOpacity={0.75}>
                  <Text style={styles.progMedTitle}>{prog.programTitle}</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </TouchableOpacity>
                <View style={styles.progMedThumbs}>
                  {prog.meditations.map(med => (
                    <TouchableOpacity key={med.id} style={styles.progMedThumbWrap} activeOpacity={0.85}>
                      <Image source={{ uri: med.image }} style={styles.progMedThumb} />
                      <View style={styles.progMedThumbOverlay} />
                      <View style={styles.progMedPlayBtn}>
                        <Ionicons name="play" size={12} color="#fff" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Experience sounds for mindfulness banner ─────────── */}
        <View style={[styles.section, { paddingHorizontal: 16 }]}>
          <TouchableOpacity activeOpacity={0.9}>
            <ImageBackground
              source={{ uri: 'https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?w=800&q=80' }}
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

        <View style={{ height: 100 }} />
      </ScrollView>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  // Tab bar
  tabBarWrap: { borderBottomWidth: 1, borderBottomColor: colors.border, flexGrow: 0 },
  tabBar: { paddingHorizontal: 20 },
  tabItem: { marginRight: 24, paddingBottom: 12, paddingTop: 4, position: 'relative' },
  tabText: { fontSize: 16, fontWeight: '500', color: colors.textMuted },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: '#fff', borderRadius: 1,
  },

  // Section
  section: { marginBottom: 32 },
  rowHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', paddingHorizontal: 20, marginBottom: 14 },
  seeAll: { fontSize: 14, color: colors.teal },
  hScroll: { paddingHorizontal: 20 },

  // Daily Target
  targetCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    marginHorizontal: 20, borderRadius: 14, padding: 16,
    marginBottom: 28, gap: 14,
  },
  targetIconWrap: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  targetInfo: { flex: 1 },
  targetLabel: { fontSize: 14, fontWeight: '600', color: '#fff', marginBottom: 2 },
  targetProgress: { fontSize: 13, color: colors.textSecondary, marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: colors.border, borderRadius: 2 },
  progressFill: { height: 4, backgroundColor: '#F5A623', borderRadius: 2 },

  // Favorites
  favCard: { width: 150, marginRight: 14 },
  favImage: { width: 150, height: 190, borderRadius: 12, backgroundColor: colors.backgroundCard, marginBottom: 8 },
  favImageRound: { borderRadius: 75, width: 130, height: 130 },
  favTitle: { fontSize: 13, fontWeight: '600', color: '#fff', marginBottom: 3, lineHeight: 18 },
  favAuthor: { fontSize: 12, color: colors.textSecondary },

  // Top Rated
  topRatedGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 16 },
  topRatedItem: { width: '45%', flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  topRatedThumb: { width: 54, height: 54, borderRadius: 27, backgroundColor: colors.backgroundCard },
  topRatedMeta: { flex: 1 },
  topRatedTitle: { fontSize: 12, fontWeight: '600', color: '#fff', marginBottom: 2, lineHeight: 17 },
  topRatedAuthor: { fontSize: 11, color: colors.textSecondary, marginBottom: 3 },
  ratingRow: { flexDirection: 'row', alignItems: 'center' },
  ratingText: { fontSize: 11, color: colors.textMuted },

  // Today's meditations
  durationPill: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginRight: 8,
  },
  durationPillActive: { backgroundColor: '#fff', borderColor: '#fff' },
  durationText: { fontSize: 11, color: colors.textMuted, fontWeight: '600', letterSpacing: 0.3 },
  durationTextActive: { color: '#000' },
  medCard: { width: 160, marginRight: 14 },
  medImage: { width: 160, height: 200, borderRadius: 12, backgroundColor: colors.backgroundCard, marginBottom: 8 },
  medTitle: { fontSize: 13, fontWeight: '600', color: '#fff', marginBottom: 3, lineHeight: 18 },
  medAuthor: { fontSize: 12, color: colors.textSecondary, marginBottom: 4 },

  // Practices grid
  practicesGrid: { paddingHorizontal: 16, gap: 8 },
  practicesRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  practiceTile: { flex: 1 },
  practiceBg: { height: 72, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 },
  practiceBgImg: { borderRadius: 12 },
  practiceIconCircle: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  practiceLabel: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // Category scroll (meditation + sound)
  categoryScroll: { paddingHorizontal: 16, paddingRight: 16 },
  categoryCard: { width: 160, height: 94, marginRight: 8 },
  categoryBg: { flex: 1, justifyContent: 'flex-end', padding: 12 },
  categoryBgImg: { borderRadius: 12 },
  categoryLabel: { fontSize: 16, fontWeight: '900', color: '#fff', letterSpacing: 1 },

  // Recently Played
  recentGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 12 },
  recentItem: { width: '46%', flexDirection: 'row', alignItems: 'center', gap: 10 },
  recentThumb: { width: 60, height: 60, borderRadius: 8, backgroundColor: colors.backgroundCard },
  recentInfo: { flex: 1 },
  recentTitle: { fontSize: 13, fontWeight: '600', color: '#fff', marginBottom: 2, lineHeight: 17 },
  recentAuthor: { fontSize: 11, color: colors.textSecondary, marginBottom: 2 },
  recentDuration: { fontSize: 11, color: colors.textMuted },

  // Program Meditations
  progMedCard: {
    width: 300, marginRight: 16,
    backgroundColor: colors.backgroundCard,
    borderRadius: 14, overflow: 'hidden',
  },
  progMedHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  progMedTitle: { fontSize: 13, fontWeight: '700', color: '#fff', flex: 1 },
  progMedThumbs: { flexDirection: 'row', padding: 12, gap: 8 },
  progMedThumbWrap: { position: 'relative', flex: 1 },
  progMedThumb: { width: '100%', aspectRatio: 1, borderRadius: 8, backgroundColor: colors.backgroundElevated },
  progMedThumbOverlay: {
    position: 'absolute', inset: 0,
    backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 8,
  },
  progMedPlayBtn: {
    position: 'absolute', bottom: 6, right: 6,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },

  // Sounds banner
  soundsBanner: { height: 180, justifyContent: 'flex-end', padding: 20 },
  soundsBannerImg: { borderRadius: 16 },
  soundsBannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,60,0.4)',
    borderRadius: 16,
  },
  soundsBannerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', marginBottom: 14, lineHeight: 28 },
  soundsBannerBtn: {
    backgroundColor: '#fff', paddingVertical: 12, paddingHorizontal: 24,
    borderRadius: 30, alignSelf: 'flex-start',
  },
  soundsBannerBtnText: { fontSize: 14, fontWeight: '700', color: '#000' },
});
