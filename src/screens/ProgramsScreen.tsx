import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import {
  hotInMalaysia,
  authorCollections,
  programsByCategory,
  newReleases,
  comingSoon,
  continuePrograms,
} from '../data/mockData';
import HotRankCard from '../components/HotRankCard';
import ProgramCard from '../components/ProgramCard';
import NewReleaseCard from '../components/NewReleaseCard';
import ComingSoonCard from '../components/ComingSoonCard';
import CategoryTile from '../components/CategoryTile';
import ContinueProgramCard from '../components/ContinueProgramCard';
import CoachTab from './CoachTab';
import RecordingsTab from './RecordingsTab';
import CoursesTab from './CoursesTab';

// Category meta (icon + colour + display name)
const CATEGORIES = [
  { key: 'Mind', label: 'Mind', icon: 'diamond-outline' as const, color: '#4FC3F7',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80' },
  { key: 'Soul', label: 'Soul', icon: 'radio-button-on-outline' as const, color: '#4DB6AC',
    image: 'https://images.unsplash.com/photo-1532798442725-41036acc7489?w=400&q=80' },
  { key: 'Body', label: 'Body', icon: 'fitness-outline' as const, color: '#FF7043',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80' },
  { key: 'Entrepreneurship', label: 'Entrepreneurship', icon: 'briefcase-outline' as const, color: '#7986CB',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80' },
  { key: 'Relationships', label: 'Relationships', icon: 'heart-outline' as const, color: '#F06292',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80' },
  { key: 'CareerGrowth', label: 'Career Growth', icon: 'trending-up-outline' as const, color: '#FFB300',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&q=80' },
];

const TABS = ['Discover', 'Coach', 'Recordings', 'Courses'];

export default function ProgramsScreen() {
  const [activeTab, setActiveTab] = useState('Discover');

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/naresh-avatar.jpeg')}
          style={styles.avatar}
        />
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="search-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} style={styles.tab} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'Coach' && <CoachTab />}
      {activeTab === 'Recordings' && <RecordingsTab />}
      {activeTab === 'Courses' && <CoursesTab />}

      {activeTab === 'Discover' && <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Browse by language */}
        <View style={styles.languageRow}>
          <Text style={styles.languageLabel}>Browse by language</Text>
          <View style={styles.languagePill}>
            <Text style={styles.languagePillText}>English (EN)</Text>
            <Ionicons name="close" size={12} color="#fff" style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* Hot in Malaysia */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="earth-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.sectionTitle}>Hot in Malaysia</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {hotInMalaysia.map(item => (
              <HotRankCard
                key={item.id}
                rank={item.rank}
                title={item.title}
                author={item.author}
                image={item.coverImage}
              />
            ))}
          </ScrollView>
        </View>

        {/* Continue programs */}
        {continuePrograms.length > 0 && (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
              <Text style={styles.sectionTitle}>Continue programs</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {continuePrograms.map((p: any) => (
                <ContinueProgramCard
                  key={p.id}
                  programName={p.programName}
                  lessonTitle={p.lessonTitle}
                  author={p.author}
                  image={p.image}
                  progress={p.progress}
                  lessonsCompleted={p.lessonsCompleted}
                  totalLessons={p.totalLessons}
                  duration={p.duration}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Author collections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Author collections</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {authorCollections.map(a => (
              <TouchableOpacity key={a.id} style={styles.authorItem}>
                <Image
                  source={typeof a.avatar === 'string' ? { uri: a.avatar } : (a.avatar as any)}
                  style={styles.authorAvatar}
                />
                <Text style={styles.authorName} numberOfLines={2}>{a.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Browse by categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Categories</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.slice(0, 4).map(cat => (
              <CategoryTile
                key={cat.key}
                name={cat.label}
                image={cat.image}
              />
            ))}
          </View>
        </View>

        {/* Per-category horizontal sections */}
        {CATEGORIES.map(cat => {
          const programs = (programsByCategory as any)[cat.key];
          if (!programs || programs.length === 0) return null;
          return (
            <View key={cat.key} style={styles.section}>
              <View style={[styles.sectionHeader, styles.sectionHeaderSpaced]}>
                <View style={styles.catHeaderLeft}>
                  <View style={[styles.catIconBg, { backgroundColor: cat.color + '22' }]}>
                    <Ionicons name={cat.icon} size={14} color={cat.color} />
                  </View>
                  <Text style={styles.sectionTitle}>{cat.label}</Text>
                </View>
                <TouchableOpacity><Text style={styles.seeAll}>See all</Text></TouchableOpacity>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
                {programs.map((p: any) => (
                  <ProgramCard
                    key={p.id}
                    title={p.title}
                    author={p.author}
                    coverImage={p.coverImage}
                    enrolledCount={p.enrolledCount}
                    lessonCount={p.lessonCount}
                  />
                ))}
              </ScrollView>
            </View>
          );
        })}

        {/* New releases */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.sectionTitlePadded]}>New releases</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
            {newReleases.map(r => (
              <NewReleaseCard
                key={r.id}
                title={r.title}
                author={r.author}
                lessonCount={r.lessonCount}
                image={r.image}
              />
            ))}
          </ScrollView>
        </View>

        {/* Coming soon */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, styles.sectionTitlePadded]}>Coming soon</Text>
          {comingSoon.map(c => (
            <ComingSoonCard
              key={c.id}
              title={c.title}
              author={c.author}
              lessonCount={c.lessonCount}
              description={c.description}
              image={c.coverImage}
            />
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    padding: 4,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 10,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textMuted,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#fff',
    borderRadius: 1,
  },

  scroll: { flex: 1 },

  // Language
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  languageLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  languagePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  languagePillText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },

  // Sections
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeaderSpaced: {
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
  sectionTitlePadded: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 13,
    color: '#fff',
  },
  hScroll: {
    paddingHorizontal: 16,
  },

  // Author collections
  authorItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 64,
  },
  authorAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.backgroundCard,
    marginBottom: 6,
  },
  authorName: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },

  // Per-category header
  catHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  catIconBg: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
