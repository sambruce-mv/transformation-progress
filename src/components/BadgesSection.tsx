// src/components/BadgesSection.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const BADGE_SIZE = 76;

// Octagon clip-path (web CSS — works on Expo Web)
const octagonClip = {
  clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
} as any;

interface Badge {
  id: string;
  name: string;
  image: string;
  earned: boolean;
}

interface BadgesSectionProps {
  badges: Badge[];
}

export default function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity style={styles.header} activeOpacity={0.7}>
        <Text style={styles.title}>Badges</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>

      {/* Badge row */}
      <View style={styles.row}>
        {badges.map((badge) => (
          <View key={badge.id} style={styles.badgeWrap}>
            {/* Outer octagon — border effect for earned badges */}
            <View
              style={[
                styles.octagonOuter,
                badge.earned ? styles.octagonOuterEarned : styles.octagonOuterLocked,
                octagonClip,
              ]}
            >
              {/* Inner octagon — image */}
              <View
                style={[
                  styles.octagonInner,
                  octagonClip,
                  !badge.earned && (styles.imageLockedOverlay as any),
                ]}
              >
                <Image
                  source={{ uri: badge.image }}
                  style={[
                    styles.badgeImage,
                    !badge.earned && ({ filter: 'grayscale(100%) brightness(0.35)' } as any),
                  ]}
                />
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    marginBottom: 16,
  },

  // Header row
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },

  // Badge row
  row: {
    flexDirection: 'row',
    gap: 14,
  },
  badgeWrap: {
    alignItems: 'center',
  },

  // Octagonal shapes
  octagonOuter: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  octagonOuterEarned: {
    backgroundColor: 'rgba(255,255,255,0.15)', // subtle bright border
  },
  octagonOuterLocked: {
    backgroundColor: colors.backgroundElevated,
  },
  octagonInner: {
    width: BADGE_SIZE - 4,
    height: BADGE_SIZE - 4,
    overflow: 'hidden',
  },
  badgeImage: {
    width: '100%' as any,
    height: '100%' as any,
    resizeMode: 'cover',
  },
  imageLockedOverlay: {
    backgroundColor: colors.backgroundCard,
  },
});
