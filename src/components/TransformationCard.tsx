// src/components/TransformationCard.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import {
  Pathway,
  UserPathwayProgress,
  COMPARATIVE_STATS,
} from '../data/pathwayData';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface TransformationCardProps {
  pathway: Pathway;
  progress: UserPathwayProgress;
}

export default function TransformationCard({ pathway, progress }: TransformationCardProps) {
  const navigation = useNavigation<NavigationProp>();

  const completedCount = progress.completedPrograms.length;
  const overallPercent = Math.round((completedCount / pathway.totalPrograms) * 100);

  // Sum lesson counts for completed programs
  const lessonsCompleted = pathway.phases
    .flatMap(p => p.programs)
    .filter(p => progress.completedPrograms.includes(p.questId))
    .reduce((sum, p) => sum + p.lessonCount, 0);

  const handlePress = () => {
    navigation.navigate('PathwayDetail', { pathwayId: pathway.id });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.95}>
      <LinearGradient
        colors={[pathway.gradientColors[0], pathway.gradientColors[1], '#0d0400']}
        style={styles.gradient}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Share button — top right */}
        <TouchableOpacity
          style={styles.shareButton}
          hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
          onPress={(e) => e.stopPropagation()}
        >
          <Ionicons name="share-outline" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.titleMain}>{pathway.name.toUpperCase()}</Text>
          <Text style={styles.titleSub}>COLLECTION</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${overallPercent}%`, backgroundColor: pathway.accentColor },
              ]}
            />
          </View>
          <Text style={styles.progressLabel}>{overallPercent}% complete</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {/* Programs */}
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              <Text style={styles.statHighlight}>{completedCount}</Text>
              <Text style={styles.statMuted}>/{pathway.totalPrograms}</Text>
            </Text>
            <Text style={styles.statLabel}>Programs</Text>
          </View>

          {/* Lessons */}
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statHighlight]}>{lessonsCompleted}</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>

          {/* Meditated */}
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.statHighlight]}>
              {progress.totalHoursLearned}h
            </Text>
            <Text style={styles.statLabel}>Meditated</Text>
          </View>
        </View>

        {/* Social proof */}
        <View style={styles.socialRow}>
          <View style={styles.socialIconWrap}>
            <Ionicons name="people-outline" size={16} color={colors.textSecondary} />
          </View>
          <Text style={styles.socialText}>
            <Text style={[styles.socialHighlight, { color: pathway.accentColor }]}>
              {COMPARATIVE_STATS.paceCompletion}% people
            </Text>
            {' '}at your stage finished their program
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  gradient: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },

  // Share button
  shareButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Title
  titleSection: {
    marginTop: 4,
    marginBottom: 20,
  },
  titleMain: {
    fontSize: 36,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    lineHeight: 40,
  },
  titleSub: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    letterSpacing: 6,
    marginTop: 2,
  },

  // Progress
  progressSection: {
    marginBottom: 16,
  },
  progressTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 5,
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 7,
  },

  // Stats row
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statHighlight: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  statMuted: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '500',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontStyle: 'italic',
  },

  // Social proof
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  socialIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.30)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    lineHeight: 20,
  },
  socialHighlight: {
    fontWeight: '700',
  },
});
