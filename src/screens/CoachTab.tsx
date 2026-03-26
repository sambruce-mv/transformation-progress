import React, { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { coachCertifications } from '../data/mockData';

const FILTERS = ['All', 'Certifications', 'Evercoach'];

export default function CoachTab() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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

      {/* Certifications section */}
      <Text style={styles.sectionTitle}>Certifications</Text>
      {coachCertifications.map(cert => {
        const imgSrc = typeof cert.coverImage === 'string' ? { uri: cert.coverImage } : (cert.coverImage as any);
        return (
          <TouchableOpacity key={cert.id} style={styles.certCard} activeOpacity={0.85}>
            <Image source={imgSrc} style={styles.certImage} />
            <Text style={styles.certTitle}>{cert.title}</Text>
            <Text style={styles.certAuthor}>{cert.author}</Text>
            <View style={styles.certMeta}>
              <Ionicons name="people-outline" size={12} color={colors.textMuted} />
              <Text style={styles.certMetaText}> {cert.enrolledCount.toLocaleString()} · {cert.lessonCount} lessons</Text>
            </View>
          </TouchableOpacity>
        );
      })}
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  filters: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundElevated,
    marginRight: 8,
  },
  filterPillActive: {
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#000',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  certCard: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  certImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.backgroundCard,
    marginBottom: 10,
  },
  certTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 3,
  },
  certAuthor: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  certMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  certMetaText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
