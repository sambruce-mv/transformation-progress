# Transformation Journey Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Profile screen's progress and Growth Goals sections with a horizontally scrollable Transformation Journey Map showing the user's position across Pathway phases with social proof.

**Architecture:** Two new components (`JourneyWaypoint` for individual phase waypoints, `JourneyMapCard` for the full horizontal path card) consume existing Pathway data from `PathwayContext`. The Profile screen is modified to remove old sections and render stacked journey map cards. Social proof data is extended in `pathwayData.ts`.

**Tech Stack:** React Native (Expo), TypeScript, React Context, Ionicons, ScrollView with `useRef` for auto-scroll

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/components/JourneyWaypoint.tsx` | Single phase waypoint circle with completed/current/locked states, label, and social proof text |
| `src/components/JourneyMapCard.tsx` | Full journey map card for one Pathway: header, horizontal scrollable path with waypoints and program dots, footer stats |

### Modified Files
| File | Change |
|------|--------|
| `src/data/pathwayData.ts` | Extend `SOCIAL_PROOF` with `phaseCompletions` and `avgWeeksToReach` |
| `src/screens/ProfileScreen.tsx` | Remove Progress section (lines 66-97), Achievements section (lines 99-121), Growth Goals section (lines 148-166), and related styles. Add My Transformation section with JourneyMapCards. Add empty state. |

---

### Task 1: Extend Social Proof Data

**Files:**
- Modify: `src/data/pathwayData.ts`

- [ ] **Step 1: Extend SOCIAL_PROOF with phase-level data**

In `src/data/pathwayData.ts`, replace the existing `SOCIAL_PROOF` constant (lines 427-432) with:

```typescript
export const SOCIAL_PROOF = {
  activeLearners: 1247,
  phaseCompletionRate: 73,
  peerPercentile: 27,
  forwardMotivation: 89,
  phaseCompletions: {
    'mf-foundation': 4312,
    'mf-deepening': 2891,
    'mf-mastery': 1204,
    'mf-integration': 687,
    'lg-foundation': 1893,
    'lg-mastery': 742,
  } as Record<string, number>,
  avgWeeksToReach: {
    'mf-deepening': 6,
    'mf-mastery': 14,
    'mf-integration': 24,
    'lg-mastery': 8,
  } as Record<string, number>,
};

export function getPercentile(completedPrograms: number, totalPrograms: number): number {
  if (totalPrograms === 0) return 0;
  const ratio = completedPrograms / totalPrograms;
  // Mock percentile curve: early completers are ahead of more people
  return Math.min(99, Math.round((1 - Math.pow(1 - ratio, 1.5)) * 100));
}
```

- [ ] **Step 2: Commit**

```bash
git add src/data/pathwayData.ts
git commit -m "feat: extend social proof data with phase completions and percentile helper"
```

---

### Task 2: JourneyWaypoint Component

**Files:**
- Create: `src/components/JourneyWaypoint.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/JourneyWaypoint.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type WaypointState = 'completed' | 'current' | 'locked';

interface JourneyWaypointProps {
  state: WaypointState;
  phaseIcon: string;
  label: string; // badge name for completed, "YOU ARE HERE" for current, phase name for locked
  socialProofText?: string;
  accentColor: string;
  onPress?: () => void;
}

const WAYPOINT_SIZE = 48;
const WAYPOINT_SIZE_CURRENT = 58;

export default function JourneyWaypoint({
  state,
  phaseIcon,
  label,
  socialProofText,
  accentColor,
  onPress,
}: JourneyWaypointProps) {
  const size = state === 'current' ? WAYPOINT_SIZE_CURRENT : WAYPOINT_SIZE;

  const handlePress = () => {
    if (state === 'locked') {
      // No navigation for locked — could add shake animation later
      return;
    }
    onPress?.();
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={state === 'locked' ? 1 : 0.7}
    >
      {/* Waypoint circle */}
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
          state === 'completed' && styles.circleCompleted,
          state === 'current' && [styles.circleCurrent, { backgroundColor: accentColor, shadowColor: accentColor }],
          state === 'locked' && styles.circleLocked,
        ]}
      >
        {state === 'completed' && (
          <Ionicons name="checkmark" size={22} color="#fff" />
        )}
        {state === 'current' && (
          <Text style={styles.currentIcon}>{phaseIcon}</Text>
        )}
        {state === 'locked' && (
          <Ionicons name="lock-closed" size={18} color={colors.textMuted} />
        )}
      </View>

      {/* Label */}
      <Text
        style={[
          styles.label,
          state === 'current' && styles.labelCurrent,
          state === 'locked' && styles.labelLocked,
        ]}
        numberOfLines={2}
      >
        {label}
      </Text>

      {/* Social proof */}
      {socialProofText && (
        <Text style={styles.socialProof} numberOfLines={2}>
          {socialProofText}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 90,
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circleCompleted: {
    backgroundColor: colors.teal,
  },
  circleCurrent: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 6,
  },
  circleLocked: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  currentIcon: {
    fontSize: 24,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.teal,
    textAlign: 'center',
    lineHeight: 13,
  },
  labelCurrent: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  labelLocked: {
    color: colors.textMuted,
    fontWeight: '400',
  },
  socialProof: {
    fontSize: 9,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 12,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/JourneyWaypoint.tsx
git commit -m "feat: add JourneyWaypoint component with completed/current/locked states"
```

---

### Task 3: JourneyMapCard Component

**Files:**
- Create: `src/components/JourneyMapCard.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/JourneyMapCard.tsx
import React, { useRef, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
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

              {/* Program dots connector to next waypoint */}
              {!isLast && (
                <View style={styles.dotsConnector}>
                  <View style={styles.dashLine} />
                  <View style={styles.dotsRow}>
                    {Array.from({ length: Math.min(totalDots, 7) }).map((_, dotIdx) => (
                      <View
                        key={dotIdx}
                        style={[
                          styles.dot,
                          dotIdx < completedDots ? styles.dotFilled : styles.dotEmpty,
                          dotIdx < completedDots && { backgroundColor: colors.teal },
                        ]}
                      />
                    ))}
                  </View>
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
  dotsConnector: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    marginHorizontal: 4,
    width: 50,
  },
  dashLine: {
    position: 'absolute',
    top: 43,
    left: 0,
    right: 0,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: DOT_GAP,
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  dotFilled: {
    backgroundColor: colors.teal,
  },
  dotEmpty: {
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1,
    borderColor: colors.border,
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/JourneyMapCard.tsx
git commit -m "feat: add JourneyMapCard with horizontal path, waypoints, program dots, and stats"
```

---

### Task 4: Update ProfileScreen

**Files:**
- Modify: `src/screens/ProfileScreen.tsx`

This is the main integration task. We remove the Progress section (streak + stats + achievements), remove the Growth Goals section, and replace them with the My Transformation section.

- [ ] **Step 1: Update imports**

Replace the imports at the top of `src/screens/ProfileScreen.tsx`. Change:

```typescript
import { user, achievements, growthGoals } from '../data/mockData';
```

To:

```typescript
import { user } from '../data/mockData';
import { usePathway } from '../context/PathwayContext';
```

Add `JourneyMapCard` import:

```typescript
import JourneyMapCard from '../components/JourneyMapCard';
```

- [ ] **Step 2: Add pathway hook inside the component**

Inside the `ProfileScreen` function, after the existing `const navigation = useNavigation();` line, add:

```typescript
const { ownedPathways, scenario } = usePathway();
```

- [ ] **Step 3: Replace Progress + Achievements + Growth Goals sections with My Transformation**

Remove the entire Progress section (the `{/* Progress Section */}` comment through the closing `</View>` of that section — lines 66-97), the Achievements section (lines 99-121), and the Growth Goals section (lines 148-166).

In their place (after the `{/* User Profile */}` section closing `</View>` around line 64, and before the `{/* Library */}` section), insert:

```tsx
        {/* My Transformation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Transformation</Text>
          {ownedPathways.length > 0 ? (
            ownedPathways.map(pw => {
              const progress = scenario.progressMap[pw.id];
              if (!progress) return null;
              return (
                <JourneyMapCard
                  key={pw.id}
                  pathway={pw}
                  progress={progress}
                />
              );
            })
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="compass-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Start your transformation journey</Text>
              <Text style={styles.emptySubtitle}>
                Choose a Pathway to get a personalized learning journey with guided progression and milestones.
              </Text>
            </View>
          )}
        </View>
```

- [ ] **Step 4: Update styles**

Remove the now-unused styles: `streakCard`, `streakIconBox`, `streakNumber`, `streakLabel`, `statsRow`, `statCard`, `statNumber`, `statLabel`, `achievementsGrid`, `achievementItem`, `achievementBadge`, `achievementImage`, `achievementTitle`, `achievementDate`, `goalsContainer`, `goalPill`, `goalText`, `updateText`.

Add the new empty state styles:

```typescript
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
```

- [ ] **Step 5: Commit**

```bash
git add src/screens/ProfileScreen.tsx
git commit -m "feat: replace Profile progress section with Transformation Journey Map"
```

---

### Task 5: Final Verification

**Files:**
- All previously created/modified files

- [ ] **Step 1: Verify the app compiles**

Run: `cd /Users/nareshsanchana/Documents/Projects/transformation-progress && npx --no-install tsc --noEmit 2>&1 | head -30`

Fix any type errors introduced by our changes (pre-existing errors are OK).

- [ ] **Step 2: Test each scenario via the Header selector**

Manually verify each scenario renders correctly on the Profile screen:
1. **No Pathway** — Empty state with compass icon and "Start your transformation journey"
2. **Just Started** — Single Manifesting card, first waypoint current (glowing purple), rest locked, 0%
3. **Mid-Progress** — First waypoint completed (teal checkmark), second current, rest locked, program dots partially filled
4. **Phase 1 Complete** — First waypoint completed with "Foundation Builder" label + "4,312 completed", second current, rest locked
5. **Celebrate scenarios** — Same as base progress state (celebrations are modals on Today screen)
6. **Celebrate: Pathway Complete** — All waypoints completed, "Journey Complete" overlay
7. **Multiple Pathways** — Two stacked cards: Manifesting (mid-progress) + Longevity (just started)

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: address integration issues for journey map"
```
