// src/components/MilestoneCelebration.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { usePathway } from '../context/PathwayContext';
import { SOCIAL_PROOF } from '../data/pathwayData';

const { width } = Dimensions.get('window');

export default function MilestoneCelebration() {
  const {
    showCelebration,
    dismissCelebration,
    activePathway,
    activeProgress,
    celebrationPhaseNumber,
  } = usePathway();

  if (!showCelebration || showCelebration === 'program') return null;
  if (!activePathway || !activeProgress) return null;

  const isPathwayComplete = showCelebration === 'pathway';
  const phase = celebrationPhaseNumber
    ? activePathway.phases.find(p => p.phaseNumber === celebrationPhaseNumber)
    : null;

  const phaseName = phase?.name ?? 'Unknown';
  const badgeName = phase?.badgeName ?? 'Pathway Master';
  const phaseNum = celebrationPhaseNumber ?? 0;
  const nextPhase = activePathway.phases.find(p => p.phaseNumber === phaseNum + 1);

  const completedProgramCount = isPathwayComplete
    ? activePathway.totalPrograms
    : (phase?.programs.length ?? 0);
  const totalLessons = isPathwayComplete
    ? activePathway.totalLessons
    : (phase?.programs.reduce((sum, p) => sum + p.lessonCount, 0) ?? 0);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={dismissCelebration}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Sparkle decorations */}
          <Text style={[styles.sparkle, { top: 20, left: 30, transform: [{ rotate: '-15deg' }] }]}>{'\u2726'}</Text>
          <Text style={[styles.sparkle, { top: 40, right: 40, transform: [{ rotate: '20deg' }] }]}>{'\u2727'}</Text>
          <Text style={[styles.sparkle, { top: 80, left: 60, fontSize: 12, color: colors.gold }]}>{'\u2605'}</Text>
          <Text style={[styles.sparkle, { bottom: 180, right: 30, color: colors.teal }]}>{'\u2726'}</Text>
          <Text style={[styles.sparkle, { bottom: 220, left: 40, fontSize: 18, color: '#E040FB' }]}>{'\u2727'}</Text>

          {/* Header */}
          <Text style={styles.phaseLabel}>
            {isPathwayComplete ? 'PATHWAY' : `PHASE ${phaseNum}`}
          </Text>
          <Text style={styles.completeText}>COMPLETE! {'\u{1F389}'}</Text>
          <Text style={styles.phaseName}>
            {isPathwayComplete ? `${activePathway.name} Pathway Mastered` : `${phaseName} Mastered`}
          </Text>

          {/* Badge earned */}
          <View style={styles.badgeCard}>
            <Text style={styles.badgeIcon}>{'\u{1F3C6}'}</Text>
            <View>
              <Text style={styles.badgeLabel}>BADGE EARNED</Text>
              <Text style={styles.badgeName}>
                {isPathwayComplete ? 'Pathway Master' : badgeName}
              </Text>
            </View>
          </View>

          {/* All badges for pathway complete */}
          {isPathwayComplete && activeProgress.earnedBadges.length > 0 && (
            <View style={styles.allBadgesRow}>
              {activeProgress.earnedBadges.map((name, i) => (
                <View key={i} style={styles.miniBadge}>
                  <Text style={styles.miniBadgeIcon}>{'\u{1F3C6}'}</Text>
                  <Text style={styles.miniBadgeName}>{name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{completedProgramCount}</Text>
              <Text style={styles.statLabel}>Programs</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalLessons}</Text>
              <Text style={styles.statLabel}>Lessons</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{activeProgress.totalHoursLearned}h</Text>
              <Text style={styles.statLabel}>Invested</Text>
            </View>
          </View>

          {/* Social proof */}
          <Text style={styles.socialText}>
            <Text style={{ color: colors.gold, fontWeight: '600' }}>Top {SOCIAL_PROOF.peerPercentile}%</Text>
            {' of learners \u00b7 '}
            <Text style={{ color: colors.teal, fontWeight: '600' }}>{SOCIAL_PROOF.forwardMotivation}%</Text>
            {isPathwayComplete
              ? ' of learners recommend this Pathway'
              : ` who reach Phase ${phaseNum + 1} finish the Pathway`}
          </Text>

          {/* CTA */}
          <TouchableOpacity style={styles.ctaButton} onPress={dismissCelebration}>
            <Text style={styles.ctaText}>
              {isPathwayComplete
                ? 'Explore More Pathways'
                : `Unlock Phase ${phaseNum + 1}: ${nextPhase?.name ?? 'Next'} \u{1F513}`}
            </Text>
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareText}>Share your achievement {'\u2192'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,14,23,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  sparkle: {
    position: 'absolute',
    fontSize: 20,
    opacity: 0.5,
    color: '#fff',
  },

  phaseLabel: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.gold,
    marginBottom: 4,
  },
  completeText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
  },
  phaseName: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: 20,
  },

  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245,200,66,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.3)',
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
    marginBottom: 20,
  },
  badgeIcon: { fontSize: 32 },
  badgeLabel: {
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 1,
    fontWeight: '600',
  },
  badgeName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    marginTop: 2,
  },

  allBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  miniBadge: {
    alignItems: 'center',
    width: 70,
  },
  miniBadgeIcon: { fontSize: 20 },
  miniBadgeName: { fontSize: 10, color: colors.textMuted, textAlign: 'center', marginTop: 4 },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 18, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  socialText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },

  ctaButton: {
    backgroundColor: colors.gold,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    marginBottom: 12,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a2e',
  },

  shareBtn: { padding: 8 },
  shareText: {
    fontSize: 13,
    color: '#7B68EE',
    fontWeight: '600',
  },
});
