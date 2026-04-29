// src/components/GrowthGoalsSection.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

interface GoalTag {
  id: string;
  emoji: string;
  label: string;
}

interface GrowthGoalsSectionProps {
  tags: GoalTag[];
  onUpdate?: () => void;
}

export default function GrowthGoalsSection({ tags, onUpdate }: GrowthGoalsSectionProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Growth goals</Text>
        <TouchableOpacity onPress={onUpdate}>
          <Text style={styles.updateLink}>Update</Text>
        </TouchableOpacity>
      </View>

      {/* Tag grid */}
      <View style={styles.tagsWrap}>
        {tags.map((tag) => (
          <View key={tag.id} style={styles.tag}>
            <Text style={styles.tagText}>
              {tag.emoji}{'  '}{tag.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // No card background — sits directly on page like the design
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  updateLink: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    textDecorationLine: 'underline',
  },

  // Tags
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tagText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
});
