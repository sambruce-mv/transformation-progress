import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { recordingShows, recordingCategories } from '../data/mockData';

export default function RecordingsTab() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Language pill */}
      <View style={styles.langRow}>
        <Text style={styles.langLabel}>Browse by language</Text>
        <View style={styles.langPill}>
          <Ionicons name="language-outline" size={13} color="#fff" style={{ marginRight: 5 }} />
          <Text style={styles.langText}>English (EN)</Text>
        </View>
      </View>

      {/* New Episodes section (first show) */}
      <Text style={styles.sectionTitle}>New Episodes</Text>
      {recordingShows[0].episodes.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
          {recordingShows[0].episodes.map(ep => {
            const imgSrc = typeof ep.image === 'string' ? { uri: ep.image } : (ep.image as any);
            return (
              <TouchableOpacity key={ep.id} style={styles.episodeCard} activeOpacity={0.85}>
                <View style={styles.episodeImageWrap}>
                  <Image source={imgSrc} style={styles.episodeImage} />
                  <View style={[styles.episodeTag, { backgroundColor: ep.tagColor }]}>
                    <Text style={styles.episodeTagText}>{ep.tag}</Text>
                  </View>
                </View>
                <Text style={styles.episodeTitle} numberOfLines={2}>{ep.title}</Text>
                <Text style={styles.episodeShow} numberOfLines={1}>{recordingShows[0].name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Remaining shows */}
      {recordingShows.map(show => {
        const thumbSrc = typeof show.thumbnail === 'string' ? { uri: show.thumbnail } : (show.thumbnail as any);
        return (
          <View key={show.id} style={styles.showSection}>
            {/* Show header row */}
            <TouchableOpacity style={styles.showRow} activeOpacity={0.85}>
              <Image source={thumbSrc} style={styles.showThumb} />
              <View style={styles.showInfo}>
                <Text style={styles.showName}>{show.name}</Text>
                <Text style={styles.showEpisodes}>{show.episodeCount} episodes</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </TouchableOpacity>

            {/* Episode horizontal scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
              {show.episodes.map(ep => {
                const imgSrc = typeof ep.image === 'string' ? { uri: ep.image } : (ep.image as any);
                return (
                  <TouchableOpacity key={ep.id} style={styles.episodeCard} activeOpacity={0.85}>
                    <View style={styles.episodeImageWrap}>
                      <Image source={imgSrc} style={styles.episodeImage} />
                      <View style={[styles.episodeTag, { backgroundColor: ep.tagColor }]}>
                        <Text style={styles.episodeTagText} numberOfLines={1}>{ep.tag}</Text>
                      </View>
                    </View>
                    <Text style={styles.episodeTitle} numberOfLines={2}>{ep.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        );
      })}

      {/* Browse by Categories */}
      <Text style={[styles.sectionTitle, { marginTop: 8, marginBottom: 14 }]}>Browse by Categories</Text>
      <View style={styles.categoryGrid}>
        {recordingCategories.map(cat => (
          <TouchableOpacity key={cat} style={styles.categoryPill} activeOpacity={0.75}>
            <Text style={styles.categoryText}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  langLabel: { fontSize: 13, color: colors.textSecondary },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  langText: { fontSize: 12, color: '#fff', fontWeight: '600' },

  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  hScroll: { paddingHorizontal: 16 },

  // Episode card
  episodeCard: { width: 180, marginRight: 12, marginBottom: 8 },
  episodeImageWrap: { position: 'relative', marginBottom: 8 },
  episodeImage: {
    width: 180,
    height: 220,
    borderRadius: 10,
    backgroundColor: colors.backgroundCard,
  },
  episodeTag: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    maxWidth: 160,
  },
  episodeTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#fff',
  },
  episodeTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    lineHeight: 18,
    marginBottom: 2,
  },
  episodeShow: {
    fontSize: 11,
    color: colors.textSecondary,
  },

  // Show row
  showSection: { marginBottom: 24 },
  showRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  showThumb: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: colors.backgroundCard,
    marginRight: 12,
  },
  showInfo: { flex: 1 },
  showName: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  showEpisodes: { fontSize: 12, color: colors.textSecondary },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryPill: {
    width: '46%',
    margin: '2%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: colors.backgroundElevated,
    borderRadius: 10,
  },
  categoryText: { fontSize: 14, color: '#fff', fontWeight: '500' },
});
