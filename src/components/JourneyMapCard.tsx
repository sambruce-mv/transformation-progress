// src/components/JourneyMapCard.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { Pathway, UserPathwayProgress, SOCIAL_PROOF, getPercentile } from '../data/pathwayData';
import JourneyWaypoint from './JourneyWaypoint';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const WAYPOINT_WIDTH = 90;
const DOT_SIZE = 6;
const DOT_GAP = 8;
const PATH_PADDING = 20;

interface JourneyMapCardProps {
  pathway: Pathway;
  progress: UserPathwayProgress;
}

export default function JourneyMapCard({ pathway, progress }: JourneyMapCardProps) {
  const navigation = useNavigation<NavigationProp>();
  const scrollRef = useRef<ScrollView>(null);

  const completedCount = progress.completedPrograms.length;
  const overallPercent = Math.round((completedCount / pathway.totalPrograms) * 100);
  const isJourneyComplete = progress.completedPhases.length === pathway.phases.length;

  const currentPhaseIndex = pathway.phases.findIndex(p => p.id === progress.currentPhaseId);

  // Auto-scroll to current waypoint on mount
  useEffect(() => {
    if (currentPhaseIndex > 0 && scrollRef.current) {
      const scrollTo = currentPhaseIndex * (WAYPOINT_WIDTH + 40) - SCREEN_WIDTH / 2 + WAYPOINT_WIDTH / 2 + PATH_PADDING;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: Math.max(0, scrollTo), animated: true });
      }, 300);
    }
  }, [currentPhaseIndex]);

  const getWaypointState = (phaseId: string): 'completed' | 'current' | 'locked' => {
    if (progress.completedPhases.includes(phaseId)) return 'completed';
    if (phaseId === progress.currentPhaseId) return 'current';
    return 'locked';
  };

  const getWaypointLabel = (phase: typeof pathway.phases[0], state: 'completed' | 'current' | 'locked'): string => {
    if (state === 'completed') return phase.badgeName;
    if (state === 'current') return 'YOU ARE HERE';
    return phase.name;
  };

  const getSocialProof = (phase: typeof pathway.phases[0], state: 'completed' | 'current' | 'locked', isFirstLocked: boolean): string | undefined => {
    if (state === 'completed') {
      const count = SOCIAL_PROOF.phaseCompletions[phase.id];
      return count ? `${count.toLocaleString()} completed` : undefined;
    }
    if (state === 'current') {
      const percentile = getPercentile(completedCount, pathway.totalPrograms);
      return `Ahead of ${percentile}% of learners`;
    }
    if (state === 'locked' && isFirstLocked) {
      const weeks = SOCIAL_PROOF.avgWeeksToReach[phase.id];
      return weeks ? `Avg. ${weeks} weeks to reach` : undefined;
    }
    return undefined;
  };

  // Count completed programs within a phase
  const getPhaseCompletedDots = (phase: typeof pathway.phases[0]): number => {
    return phase.programs.filter(p => progress.completedPrograms.includes(p.questId)).length;
  };

  const navigateToPathway = () => {
    navigation.navigate('PathwayDetail', { pathwayId: pathway.id });
  };

  let firstLockedSeen = false;

  return (
    <View style={[styles.card, { borderColor: pathway.accentColor + '20' }]}>
      {/* Journey Complete overlay */}
      {isJourneyComplete && (
        <View style={styles.completeOverlay}>
          <Text style={styles.completeText}>Journey Complete</Text>
          <Text style={styles.completeStats}>
            {pathway.totalPrograms} programs · {pathway.totalLessons} lessons · {progress.totalHoursLearned}h invested
          </Text>
        </View>
      )}

      {/* Card Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>{pathway.icon}</Text>
          <View>
            <Text style={styles.headerName}>{pathway.name}</Text>
            <Text style={styles.headerTagline}>{pathway.tagline}</Text>
          </View>
        </View>
        <Text style={styles.headerProgress}>
          {overallPercent}% · {completedCount}/{pathway.totalPrograms}
        </Text>
      </View>

      {/* Horizontal Path */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pathContent}
        style={styles.pathScroll}
      >
        {pathway.phases.map((phase, index) => {
          const state = getWaypointState(phase.id);
          const isFirstLocked = state === 'locked' && !firstLockedSeen;
          if (state === 'locked') firstLockedSeen = true;

          const completedDots = getPhaseCompletedDots(phase);
          const totalDots = phase.programs.length;
          const isLast = index === pathway.phases.length - 1;

          return (
            <View key={phase.id} style={styles.waypointSection}>
              <JourneyWaypoint
                state={state}
                phaseIcon={phase.icon}
                label={getWaypointLabel(phase, state)}
                socialProofText={getSocialProof(phase, state, isFirstLocked)}
                accentColor={pathway.accentColor}
                onPress={navigateToPathway}
              />

              {/* Program covers connector to next waypoint */}
              {!isLast && (
                <View style={styles.coversConnector}>
                  <View style={styles.dashLine} />
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.coversRow}>
                    {phase.programs.slice(0, 5).map((program) => {
                      const isDone = progress.completedPrograms.includes(program.questId);
                      const isActive = program.questId === progress.currentProgramId;
                      return (
                        <View key={program.questId} style={styles.coverThumbWrap}>
                          <Image
                            source={{ uri: program.image }}
                            style={[
                              styles.coverThumb,
                              isActive && styles.coverThumbActive,
                              isDone && styles.coverThumbDone,
                              !isDone && !isActive && !program.isUnlocked && styles.coverThumbLocked,
                            ]}
                          />
                          {isDone && (
                            <View style={styles.coverCheckMini}>
                              <Text style={{ fontSize: 6, color: '#fff' }}>{'\u2713'}</Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </ScrollView>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Card Footer */}
      <View style={styles.footer}>
        {progress.pathwayStreak > 0 && (
          <Text style={styles.footerStat}>
            <Text style={{ color: colors.gold }}>{'\u{1F525}'} {progress.pathwayStreak}</Text>
            <Text style={styles.footerStatLabel}> streak</Text>
          </Text>
        )}
        <Text style={styles.footerStat}>
          {progress.weeklyLessonCount}/{progress.weeklyLessonGoal}
          <Text style={styles.footerStatLabel}> this week</Text>
        </Text>
        <Text style={styles.footerStat}>
          {progress.totalHoursLearned}h
          <Text style={styles.footerStatLabel}> learned</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },

  // Complete overlay
  completeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,212,170,0.08)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.teal,
    marginBottom: 4,
  },
  completeStats: {
    fontSize: 11,
    color: colors.textMuted,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerIcon: {
    fontSize: 22,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  headerTagline: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 1,
  },
  headerProgress: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },

  // Path
  pathScroll: {
    marginVertical: 12,
  },
  pathContent: {
    paddingHorizontal: PATH_PADDING,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  waypointSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  coversConnector: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 8,
    marginHorizontal: 2,
  },
  dashLine: {
    position: 'absolute',
    top: 28,
    left: 0,
    right: 0,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
  },
  coversRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  coverThumbWrap: {
    position: 'relative',
  },
  coverThumb: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: colors.backgroundElevated,
  },
  coverThumbActive: {
    borderWidth: 1.5,
    borderColor: '#7B68EE',
  },
  coverThumbDone: {
    opacity: 0.5,
  },
  coverThumbLocked: {
    opacity: 0.25,
  },
  coverCheckMini: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerStat: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  footerStatLabel: {
    fontWeight: '400',
    color: colors.textMuted,
    fontSize: 11,
  },
});
