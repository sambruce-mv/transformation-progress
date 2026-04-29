// src/components/StreakCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const ORANGE = '#F5A623';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  weekActivity: boolean[]; // 7 booleans, Mon–Sun
  todayIndex: number;       // 0 = Mon … 6 = Sun
}

export default function StreakCard({
  currentStreak,
  longestStreak,
  weekActivity,
  todayIndex,
}: StreakCardProps) {
  return (
    <View style={styles.card}>

      {/* ── Current / Longest ── */}
      <View style={styles.topRow}>
        {/* Current streak */}
        <View style={styles.streakCol}>
          <Text style={styles.streakLabel}>Current streak</Text>
          <View style={styles.streakCount}>
            <Text style={styles.flame}>🔥</Text>
            <Text style={styles.streakNumber}>{currentStreak}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Longest streak */}
        <View style={styles.streakCol}>
          <Text style={styles.streakLabel}>Longest streak</Text>
          <View style={styles.streakCount}>
            <Text style={styles.flame}>🔥</Text>
            <Text style={styles.streakNumber}>{longestStreak}</Text>
          </View>
        </View>
      </View>

      {/* ── Week activity row ── */}
      <View style={styles.weekRow}>
        {DAYS.map((day, i) => {
          const done = weekActivity[i];
          const isToday = i === todayIndex;
          const isFuture = i > todayIndex;

          return (
            <View key={i} style={styles.dayCol}>
              {/* Circle */}
              <View
                style={[
                  styles.circle,
                  done && !isToday && styles.circleDone,
                  isToday && styles.circleToday,
                  isFuture && styles.circleFuture,
                ]}
              >
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={
                    done || isToday
                      ? '#FFFFFF'
                      : colors.backgroundElevated
                  }
                />
              </View>

              {/* Label — dot for today, letter otherwise */}
              {isToday ? (
                <View style={styles.todayDot} />
              ) : (
                <Text style={styles.dayLabel}>{day}</Text>
              )}
            </View>
          );
        })}
      </View>

      {/* ── How streaks work? ── */}
      <TouchableOpacity style={styles.linkWrap}>
        <Text style={styles.link}>How streaks work?</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 16,
  },

  // ── Current / Longest ──
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  streakCol: {
    flex: 1,
  },
  streakLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  streakCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flame: {
    fontSize: 30,
  },
  streakNumber: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 48,
  },
  divider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: colors.border,
    marginHorizontal: 16,
  },

  // ── Week row ──
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dayCol: {
    alignItems: 'center',
    gap: 6,
  },

  // Circles
  circle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
  },
  circleDone: {
    backgroundColor: ORANGE,
  },
  circleToday: {
    backgroundColor: 'transparent',
    borderWidth: 2.5,
    borderColor: ORANGE,
  },
  circleFuture: {
    backgroundColor: colors.backgroundElevated,
  },

  // Labels
  dayLabel: {
    fontSize: 12,
    color: colors.textMuted,
  },
  todayDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: ORANGE,
  },

  // ── Link ──
  linkWrap: {
    alignItems: 'center',
  },
  link: {
    fontSize: 14,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
});
