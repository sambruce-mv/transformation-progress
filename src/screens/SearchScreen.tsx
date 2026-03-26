import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Image, FlatList, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const FILTERS = ['All', 'Programs', 'Meditations', 'Sounds', 'Coaches', 'Events'];

const RECENT_SEARCHES = [
  'Silva Ultramind',
  'Sleep meditation',
  'Jim Kwik',
  'Breathwork for anxiety',
  'Vishen',
];

interface Result {
  id: string;
  title: string;
  subtitle: string;
  type: string;
  image: string;
}

const ALL_RESULTS: Result[] = [
  { id: 'r1',  type: 'Programs',    title: 'The Silva Ultramind System',       subtitle: 'Vishen Lakhiani · 29 lessons',    image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=200&q=80' },
  { id: 'r2',  type: 'Programs',    title: 'Superbrain',                       subtitle: 'Jim Kwik · 20 lessons',           image: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?w=200&q=80' },
  { id: 'r3',  type: 'Programs',    title: 'Be Extraordinary',                 subtitle: 'Vishen Lakhiani · 30 lessons',    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80' },
  { id: 'r4',  type: 'Meditations', title: 'The 6 Phase Meditation',           subtitle: 'Vishen · 19 min',                 image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80' },
  { id: 'r5',  type: 'Meditations', title: 'Sleep Inducing Body Scan',         subtitle: 'House of Wellbeing · 25 min',     image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200&q=80' },
  { id: 'r6',  type: 'Sounds',      title: 'Ocean Healing',                    subtitle: 'Gabriel Loynaz',                  image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=200&q=80' },
  { id: 'r7',  type: 'Sounds',      title: '528 Hz – The Love Frequency',      subtitle: 'Gabriel Loynaz',                  image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80' },
  { id: 'r8',  type: 'Coaches',     title: 'Jim Kwik',                         subtitle: 'Memory & Speed Reading',          image: require('../../assets/authors/jim-kwik.jpg') },
  { id: 'r9',  type: 'Coaches',     title: 'Vishen Lakhiani',                  subtitle: 'Mindvalley Founder · Growth',     image: require('../../assets/authors/vishen-lakhiani.jpg') },
  { id: 'r10', type: 'Coaches',     title: 'Emily Fletcher',                   subtitle: 'Meditation & Performance',        image: require('../../assets/authors/emily-fletcher.jpg') },
  { id: 'r11', type: 'Events',      title: 'Mindvalley AI Summit',             subtitle: 'Mar 20–22 · Virtual · Free',      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80' },
  { id: 'r12', type: 'Programs',    title: 'Duality',                          subtitle: 'Jeffrey Allen · 28 lessons',      image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&q=80' },
  { id: 'r13', type: 'Programs',    title: '10X Fitness',                      subtitle: 'Ronan Diego & Lorenzo · 22 lessons', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
];

const TYPE_COLORS: Record<string, string> = {
  Programs: '#7C5CFC', Meditations: '#059669', Sounds: '#0284C7',
  Coaches: '#B45309', Events: '#DB2777',
};

export default function SearchScreen() {
  const navigation = useNavigation();
  const inputRef = useRef<TextInput>(null);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [recents, setRecents] = useState(RECENT_SEARCHES);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const results = ALL_RESULTS.filter(r => {
    const matchesFilter = activeFilter === 'All' || r.type === activeFilter;
    const matchesQuery = !query.trim() || r.title.toLowerCase().includes(query.toLowerCase())
      || r.subtitle.toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const removeRecent = (term: string) => setRecents(prev => prev.filter(r => r !== term));

  const fireSearch = (term: string) => {
    setQuery(term);
    if (!recents.includes(term)) setRecents(prev => [term, ...prev].slice(0, 8));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search"
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          onSubmitEditing={() => query.trim() && fireSearch(query.trim())}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterPill, activeFilter === f && styles.filterPillActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Recent searches — shown when no query */}
        {!query.trim() && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent searches</Text>
            {recents.map(term => (
              <TouchableOpacity key={term} style={styles.recentRow} onPress={() => fireSearch(term)} activeOpacity={0.7}>
                <Ionicons name="time-outline" size={18} color={colors.textMuted} style={{ marginRight: 14 }} />
                <Text style={styles.recentText}>{term}</Text>
                <TouchableOpacity onPress={() => removeRecent(term)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                  <Ionicons name="close" size={16} color={colors.textMuted} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Results */}
        {(query.trim() || activeFilter !== 'All') && (
          <View style={styles.section}>
            {query.trim() && (
              <Text style={styles.sectionTitle}>
                {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
              </Text>
            )}
            {results.map(item => {
              const imgSrc = typeof item.image === 'string' ? { uri: item.image } : (item.image as any);
              return (
                <TouchableOpacity key={item.id} style={styles.resultRow} activeOpacity={0.8}>
                  <Image source={imgSrc} style={[styles.resultThumb, item.type === 'Coaches' && styles.resultThumbRound]} />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[item.type] + '22' }]}>
                    <Text style={[styles.typeText, { color: TYPE_COLORS[item.type] }]}>{item.type}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
            {results.length === 0 && (
              <View style={styles.empty}>
                <Ionicons name="search-outline" size={40} color={colors.textMuted} />
                <Text style={styles.emptyText}>No results found</Text>
              </View>
            )}
          </View>
        )}

        {/* Suggestions when idle */}
        {!query.trim() && activeFilter === 'All' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending</Text>
            {ALL_RESULTS.slice(0, 5).map(item => {
              const imgSrc = typeof item.image === 'string' ? { uri: item.image } : (item.image as any);
              return (
                <TouchableOpacity key={item.id} style={styles.resultRow} activeOpacity={0.8}>
                  <Image source={imgSrc} style={[styles.resultThumb, item.type === 'Coaches' && styles.resultThumbRound]} />
                  <View style={styles.resultInfo}>
                    <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[item.type] + '22' }]}>
                    <Text style={[styles.typeText, { color: TYPE_COLORS[item.type] }]}>{item.type}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 8 },
  input: {
    flex: 1, fontSize: 16, color: '#fff',
    paddingHorizontal: 12, paddingVertical: 8,
  },
  clearBtn: { padding: 8 },
  filters: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.backgroundElevated, marginRight: 8,
  },
  filterPillActive: { backgroundColor: '#fff' },
  filterText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  filterTextActive: { color: '#000' },
  section: { paddingTop: 8 },
  sectionTitle: {
    fontSize: 13, fontWeight: '700', color: colors.textMuted,
    letterSpacing: 0.5, paddingHorizontal: 20, marginBottom: 8, marginTop: 8,
  },
  recentRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  recentText: { flex: 1, fontSize: 15, color: '#fff' },
  resultRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12, gap: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  resultThumb: { width: 52, height: 52, borderRadius: 8, backgroundColor: colors.backgroundCard },
  resultThumbRound: { borderRadius: 26 },
  resultInfo: { flex: 1 },
  resultTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3 },
  resultSubtitle: { fontSize: 12, color: colors.textSecondary },
  typeBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  typeText: { fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: colors.textMuted },
});
