// src/components/PhaseTimeline.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import ProgramTimelineItem from './ProgramTimelineItem';
import type { Phase, UserPathwayProgress } from '../data/pathwayData';

interface PhaseTimelineProps {
  phase: Phase;
  progress: UserPathwayProgress;
  onProgramPress?: (questId: string, title: string, image: string, author: string) => void;
}

const MAX_VISIBLE = 5;

export default function PhaseTimeline({ phase, progress, onProgramPress }: PhaseTimelineProps) {
  const [showAll, setShowAll] = useState(false);
  const programs = phase.programs;
  const visiblePrograms = showAll ? programs : programs.slice(0, MAX_VISIBLE);
  const hiddenCount = programs.length - MAX_VISIBLE;

  const getState = (questId: string): 'completed' | 'current' | 'locked' => {
    if (progress.completedPrograms.includes(questId)) return 'completed';
    if (progress.currentProgramId === questId) return 'current';
    return 'locked';
  };

  const completedCount = phase.programs.filter(p => progress.completedPrograms.includes(p.questId)).length;

  return (
    <View style={styles.container}>
      {/* Phase header */}
      <View style={styles.header}>
        <View style={styles.phaseIconWrap}>
          <Text style={styles.phaseIcon}>{phase.icon}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.phaseName}>Phase {phase.phaseNumber}: {phase.name}</Text>
          <Text style={styles.phaseDesc}>{phase.description}</Text>
        </View>
        <Text style={styles.phaseCount}>{completedCount}/{phase.programs.length}</Text>
      </View>

      {/* Timeline rail + programs */}
      <View style={styles.timelineContainer}>
        <View style={styles.rail} />
        <View style={styles.programsList}>
          {visiblePrograms.map(program => {
            const state = getState(program.questId);
            const lessonProgress = state === 'current'
              ? progress.currentLessonNumber / progress.currentProgramLessonCount
              : 0;
            const currentLessonLabel = state === 'current'
              ? `Lesson ${progress.currentLessonNumber} of ${progress.currentProgramLessonCount}`
              : undefined;

            return (
              <ProgramTimelineItem
                key={program.questId}
                program={program}
                state={state}
                lessonProgress={lessonProgress}
                currentLessonLabel={currentLessonLabel}
                onPress={() => onProgramPress?.(program.questId, program.title, program.image, program.author)}
              />
            );
          })}
        </View>
      </View>

      {/* Show more */}
      {!showAll && hiddenCount > 0 && (
        <TouchableOpacity onPress={() => setShowAll(true)} style={styles.showMore}>
          <Text style={styles.showMoreText}>+{hiddenCount} more programs in this phase</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 10,
  },
  phaseIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseIcon: { fontSize: 16 },
  headerInfo: { flex: 1 },
  phaseName: { fontSize: 16, fontWeight: '700', color: '#fff' },
  phaseDesc: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  phaseCount: { fontSize: 12, color: colors.teal, fontWeight: '600' },

  timelineContainer: {
    paddingLeft: 15,
    position: 'relative',
  },
  rail: {
    position: 'absolute',
    left: 29,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: colors.border,
  },
  programsList: {
    paddingLeft: 0,
  },

  showMore: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  showMoreText: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
