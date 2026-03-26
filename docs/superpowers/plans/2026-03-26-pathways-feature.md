# Pathways Feature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "My Pathway" section to the Today screen with a full Pathway Detail screen, milestone celebrations, gamification, and a state-switching debug panel so every visual state can be reviewed without manual data manipulation.

**Architecture:** Pathways wrap existing Quests into curated, ordered sequences grouped into phases. A `PathwayContext` provides pathway state and a debug scenario switcher. The Today screen gets a `MyPathwayCard` component; tapping it navigates to `PathwayDetailScreen` (vertical timeline). Celebrations are modal overlays. All visual states are accessible via a debug scenario selector in the Header.

**Tech Stack:** React Native (Expo), TypeScript, React Navigation (native-stack), React Context, Ionicons

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/data/pathwayData.ts` | Pathway type definitions, mock pathway definitions, and scenario presets for all visual states |
| `src/context/PathwayContext.tsx` | Pathway state provider with scenario switcher for debug/demo |
| `src/components/MyPathwayCard.tsx` | Action-forward card for Today screen |
| `src/components/PathwaySwitcher.tsx` | Bottom sheet for switching between owned Pathways |
| `src/screens/PathwayDetailScreen.tsx` | Full vertical timeline screen with phases and programs |
| `src/components/PhaseTimeline.tsx` | Vertical timeline component for a single phase (expanded) |
| `src/components/PhaseCollapsed.tsx` | Collapsed phase card (locked or completed) |
| `src/components/ProgramTimelineItem.tsx` | Single program row in the timeline (completed/current/locked states) |
| `src/components/MilestoneCelebration.tsx` | Full-screen modal for phase/pathway completion celebrations |
| `src/components/ProgramCompleteCelebration.tsx` | Inline celebration for program completion |

### Modified Files
| File | Change |
|------|--------|
| `src/navigation/RootNavigator.tsx` | Add `PathwayDetail` screen + params |
| `src/screens/TodayScreen.tsx` | Insert `MyPathwayCard` after greeting, filter Continue Programs |
| `src/screens/ProgressScreen.tsx` | Add Pathways section above stats grid |
| `src/screens/QuestDetailScreen.tsx` | Add breadcrumb + "Next in Pathway" CTA when in pathway context |
| `src/components/Header.tsx` | Add scenario selector dropdown for debug |
| `App.tsx` | Wrap with `PathwayProvider` |

---

### Task 1: Pathway Data Model & Scenario Presets

**Files:**
- Create: `src/data/pathwayData.ts`

This task defines all types, mock data for the Manifesting Pathway, and preset scenarios for every visual state the user needs to review.

- [ ] **Step 1: Create the pathway data file with types and mock data**

```typescript
// src/data/pathwayData.ts

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PathwayProgram {
  questId: string;
  title: string;
  author: string;
  image: string;
  lessonCount: number;
  order: number;
  isUnlocked: boolean;
  isMostPopular?: boolean; // "Most popular in this phase" label
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  phaseNumber: number;
  icon: string;
  programs: PathwayProgram[];
  badgeName: string; // e.g., "Foundation Builder"
}

export interface Pathway {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  gradientColors: [string, string];
  accentColor: string;
  phases: Phase[];
  totalPrograms: number;
  totalLessons: number;
}

export interface UserPathwayProgress {
  pathwayId: string;
  currentPhaseId: string;
  currentProgramId: string;
  currentLessonId: string;
  currentLessonNumber: number;
  currentLessonTitle: string;
  currentProgramTitle: string;
  currentProgramLessonCount: number;
  completedPrograms: string[];
  completedPhases: string[];
  startedAt: string;
  lastActivityAt: string;
  weeklyLessonCount: number;
  weeklyLessonGoal: number;
  pathwayStreak: number;
  totalHoursLearned: number;
  earnedBadges: string[]; // badge names
}

export interface PathwayScenario {
  id: string;
  label: string;
  ownedPathways: Pathway[];
  progressMap: Record<string, UserPathwayProgress>; // keyed by pathwayId
  activePathwayId: string;
  showCelebration: null | 'program' | 'phase' | 'pathway';
  celebrationPhaseNumber?: number;
}

// ─── Mock Pathway: Manifesting ──────────────────────────────────────────────

const MANIFESTING_PHASES: Phase[] = [
  {
    id: 'mf-foundation',
    name: 'Foundation',
    description: 'Build your manifesting mindset',
    phaseNumber: 1,
    icon: '\u{1F331}', // seedling
    badgeName: 'Foundation Builder',
    programs: [
      { questId: 'silva', title: 'The Silva Ultramind System', author: 'Vishen', image: '/covers/The_Silva_Ultramind_System.jpg', lessonCount: 29, order: 1, isUnlocked: true },
      { questId: 'duality', title: 'Duality', author: 'Jeffrey Allen', image: '/covers/Duality.jpg', lessonCount: 30, order: 2, isUnlocked: true },
      { questId: 'art-manifesting', title: 'The Art of Manifesting', author: 'Regan Hillyer', image: '/covers/The_Art_of_Manifesting.png', lessonCount: 15, order: 3, isUnlocked: true },
      { questId: 'manifesting-mastery', title: 'Manifesting Mastery', author: 'Regan Hillyer', image: '/covers/Manifesting_Mastery.jpg', lessonCount: 20, order: 4, isUnlocked: false },
      { questId: 'money-eq', title: 'Money EQ', author: 'Ken Honda', image: '/covers/Money_EQ.png', lessonCount: 21, order: 5, isUnlocked: false, isMostPopular: true },
      { questId: 'feng-shui', title: 'Feng Shui for Life', author: 'Marie Diamond', image: '/covers/Feng_Shui_for_Life.png', lessonCount: 18, order: 6, isUnlocked: false },
      { questId: 'six-phase', title: 'The 6 Phase Meditation', author: 'Vishen', image: '/covers/The_6_Phase_Meditation.jpg', lessonCount: 20, order: 7, isUnlocked: false },
    ],
  },
  {
    id: 'mf-deepening',
    name: 'Deepening',
    description: 'Deepen your practice and expand your awareness',
    phaseNumber: 2,
    icon: '\u{1F525}', // fire
    badgeName: 'Deep Diver',
    programs: [
      { questId: 'be-extraordinary', title: 'Be Extraordinary', author: 'Vishen', image: '/covers/Be_Extraordinary.jpg', lessonCount: 30, order: 1, isUnlocked: false },
      { questId: 'superbrain', title: 'Superbrain', author: 'Jim Kwik', image: '/covers/Superbrain.png', lessonCount: 34, order: 2, isUnlocked: false },
      { questId: 'lifebook', title: 'Lifebook Online', author: 'Jon & Missy Butcher', image: '/covers/Lifebook.png', lessonCount: 35, order: 3, isUnlocked: false },
      { questId: 'sleep-mastery', title: 'The Mastery of Sleep', author: 'Dr. Michael Breus', image: '/covers/The_Mastery_of_Sleep.jpg', lessonCount: 22, order: 4, isUnlocked: false },
      { questId: 'longevity', title: 'Longevity Blueprint', author: 'Ben Greenfield', image: '/covers/The_Longevity_Blueprint.png', lessonCount: 24, order: 5, isUnlocked: false },
      { questId: 'speak-inspire', title: 'Speak & Inspire', author: 'Lisa Nichols', image: '/covers/Speak_and_Inspire.png', lessonCount: 28, order: 6, isUnlocked: false },
      { questId: 'ten-x-fitness', title: '10x Fitness', author: 'Lorenzo Delano', image: '/covers/10X_Fitness.jpg', lessonCount: 26, order: 7, isUnlocked: false },
      { questId: 'negotiate', title: 'Negotiate with Confidence', author: 'Kwame Christian', image: '/covers/Negotiate_with_Confidence_Clarity_in_Every_Conversation.jpg', lessonCount: 14, order: 8, isUnlocked: false },
    ],
  },
  {
    id: 'mf-mastery',
    name: 'Mastery',
    description: 'Master advanced manifesting techniques',
    phaseNumber: 3,
    icon: '\u{26A1}', // lightning
    badgeName: 'Master Manifestor',
    programs: [
      { questId: 'conscious-parenting', title: 'Conscious Parenting', author: 'Dr. Shefali', image: '/covers/Conscious_Parenting_Mastery.png', lessonCount: 28, order: 1, isUnlocked: false },
      { questId: 'hypnotherapist', title: 'Certified Hypnotherapist', author: 'Paul McKenna', image: '/covers/Mindvalley_Certified_Hypnotherapist.jpg', lessonCount: 35, order: 2, isUnlocked: false },
      { questId: 'brand', title: 'Building an Unstoppable Brand', author: 'Jeffrey Perlman', image: '/covers/Building_an_Unstoppable_Brand.jpg', lessonCount: 19, order: 3, isUnlocked: false },
      { questId: 'lifebook-mastery', title: 'Lifebook Mastery', author: 'Jon & Missy Butcher', image: '/covers/Lifebook_Mastery.jpg', lessonCount: 30, order: 4, isUnlocked: false },
      { questId: 'getting-started', title: 'Getting Started with Mindvalley', author: 'Vishen', image: '/covers/Getting_Started_with_Mindvalley.jpg', lessonCount: 10, order: 5, isUnlocked: false },
      { questId: 'yogi-guide', title: "A Yogi's Guide to Joy", author: 'Sadhguru', image: '/covers/A_Yogis_Guide_to_Joy.jpg', lessonCount: 15, order: 6, isUnlocked: false },
      { questId: 'wildfit', title: 'WildFit', author: 'Eric Edmeades', image: '/covers/Wildfit.png', lessonCount: 28, order: 7, isUnlocked: false },
      { questId: 'ten-x-fitness-2', title: '10x Fitness Advanced', author: 'Lorenzo Delano', image: '/covers/10X_Fitness.jpg', lessonCount: 20, order: 8, isUnlocked: false },
    ],
  },
  {
    id: 'mf-integration',
    name: 'Integration',
    description: 'Integrate everything into your daily life',
    phaseNumber: 4,
    icon: '\u{1F31F}', // star
    badgeName: 'Integration Expert',
    programs: [
      { questId: 'int-silva-2', title: 'Silva Ultramind Advanced', author: 'Vishen', image: '/covers/The_Silva_Ultramind_System.jpg', lessonCount: 20, order: 1, isUnlocked: false },
      { questId: 'int-duality-2', title: 'Duality Advanced', author: 'Jeffrey Allen', image: '/covers/Duality.jpg', lessonCount: 22, order: 2, isUnlocked: false },
      { questId: 'int-money-2', title: 'Money EQ Advanced', author: 'Ken Honda', image: '/covers/Money_EQ.png', lessonCount: 18, order: 3, isUnlocked: false },
      { questId: 'int-sleep-2', title: 'Sleep Mastery Advanced', author: 'Dr. Michael Breus', image: '/covers/The_Mastery_of_Sleep.jpg', lessonCount: 16, order: 4, isUnlocked: false },
      { questId: 'int-speak-2', title: 'Speak & Inspire Advanced', author: 'Lisa Nichols', image: '/covers/Speak_and_Inspire.png', lessonCount: 20, order: 5, isUnlocked: false },
      { questId: 'int-lifebook-2', title: 'Lifebook Integration', author: 'Jon & Missy Butcher', image: '/covers/Lifebook.png', lessonCount: 25, order: 6, isUnlocked: false },
      { questId: 'int-extraordinary-2', title: 'Be Extraordinary Advanced', author: 'Vishen', image: '/covers/Be_Extraordinary.jpg', lessonCount: 22, order: 7, isUnlocked: false },
    ],
  },
];

export const MANIFESTING_PATHWAY: Pathway = {
  id: 'manifesting',
  name: 'Manifesting',
  tagline: 'Law of Attraction & Abundance',
  icon: '\u{2728}', // sparkles
  gradientColors: ['#2a1a4e', '#4a2a6e'],
  accentColor: '#7B68EE',
  phases: MANIFESTING_PHASES,
  totalPrograms: 30,
  totalLessons: 450,
};

// Second pathway for multi-pathway testing
const LONGEVITY_PHASES: Phase[] = [
  {
    id: 'lg-foundation',
    name: 'Foundation',
    description: 'Build healthy habits and routines',
    phaseNumber: 1,
    icon: '\u{1F331}',
    badgeName: 'Health Pioneer',
    programs: [
      { questId: 'ten-x-fitness-lg', title: '10x Fitness', author: 'Lorenzo Delano', image: '/covers/10X_Fitness.jpg', lessonCount: 26, order: 1, isUnlocked: true },
      { questId: 'sleep-lg', title: 'The Mastery of Sleep', author: 'Dr. Michael Breus', image: '/covers/The_Mastery_of_Sleep.jpg', lessonCount: 22, order: 2, isUnlocked: false },
      { questId: 'longevity-lg', title: 'Longevity Blueprint', author: 'Ben Greenfield', image: '/covers/The_Longevity_Blueprint.png', lessonCount: 24, order: 3, isUnlocked: false },
    ],
  },
  {
    id: 'lg-mastery',
    name: 'Mastery',
    description: 'Advanced longevity science',
    phaseNumber: 2,
    icon: '\u{26A1}',
    badgeName: 'Longevity Master',
    programs: [
      { questId: 'wildfit-lg', title: 'WildFit', author: 'Eric Edmeades', image: '/covers/Wildfit.png', lessonCount: 28, order: 1, isUnlocked: false },
      { questId: 'yogi-lg', title: "A Yogi's Guide to Joy", author: 'Sadhguru', image: '/covers/A_Yogis_Guide_to_Joy.jpg', lessonCount: 15, order: 2, isUnlocked: false },
    ],
  },
];

export const LONGEVITY_PATHWAY: Pathway = {
  id: 'longevity',
  name: 'Longevity',
  tagline: 'Health, Fitness & Longevity Science',
  icon: '\u{1F4AA}', // flexed bicep
  gradientColors: ['#0f1a4a', '#1e3a8a'],
  accentColor: '#60a5fa',
  phases: LONGEVITY_PHASES,
  totalPrograms: 5,
  totalLessons: 115,
};

// ─── Scenario Presets ───────────────────────────────────────────────────────

export const PATHWAY_SCENARIOS: PathwayScenario[] = [
  {
    id: 'no-pathway',
    label: 'No Pathway',
    ownedPathways: [],
    progressMap: {},
    activePathwayId: '',
    showCelebration: null,
  },
  {
    id: 'just-started',
    label: 'Just Started',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'silva',
        currentLessonId: 'silva-l1',
        currentLessonNumber: 1,
        currentLessonTitle: 'Welcome to Silva Ultramind',
        currentProgramTitle: 'The Silva Ultramind System',
        currentProgramLessonCount: 29,
        completedPrograms: [],
        completedPhases: [],
        startedAt: '2026-03-20T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 0,
        weeklyLessonGoal: 4,
        pathwayStreak: 0,
        totalHoursLearned: 0,
        earnedBadges: [],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: null,
  },
  {
    id: 'mid-progress',
    label: 'Mid-Progress (Phase 1)',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'art-manifesting',
        currentLessonId: 'am-l4',
        currentLessonNumber: 4,
        currentLessonTitle: 'The Alpha Level Technique',
        currentProgramTitle: 'The Art of Manifesting',
        currentProgramLessonCount: 15,
        completedPrograms: ['silva', 'duality'],
        completedPhases: [],
        startedAt: '2026-02-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 3,
        weeklyLessonGoal: 4,
        pathwayStreak: 5,
        totalHoursLearned: 62,
        earnedBadges: [],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: null,
  },
  {
    id: 'phase-1-complete',
    label: 'Phase 1 Complete',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-deepening',
        currentProgramId: 'be-extraordinary',
        currentLessonId: 'be-l1',
        currentLessonNumber: 1,
        currentLessonTitle: 'The Extraordinary You',
        currentProgramTitle: 'Be Extraordinary',
        currentProgramLessonCount: 30,
        completedPrograms: ['silva', 'duality', 'art-manifesting', 'manifesting-mastery', 'money-eq', 'feng-shui', 'six-phase'],
        completedPhases: ['mf-foundation'],
        startedAt: '2026-01-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 2,
        weeklyLessonGoal: 4,
        pathwayStreak: 12,
        totalHoursLearned: 105,
        earnedBadges: ['Foundation Builder'],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: null,
  },
  {
    id: 'celebrate-program',
    label: 'Celebrate: Program Complete',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'art-manifesting',
        currentLessonId: 'am-l1',
        currentLessonNumber: 1,
        currentLessonTitle: 'Introduction to Manifesting',
        currentProgramTitle: 'The Art of Manifesting',
        currentProgramLessonCount: 15,
        completedPrograms: ['silva', 'duality'],
        completedPhases: [],
        startedAt: '2026-02-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 4,
        weeklyLessonGoal: 4,
        pathwayStreak: 7,
        totalHoursLearned: 58,
        earnedBadges: [],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: 'program',
  },
  {
    id: 'celebrate-phase',
    label: 'Celebrate: Phase 1 Complete',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'six-phase',
        currentLessonId: 'sp-done',
        currentLessonNumber: 20,
        currentLessonTitle: 'Final Integration',
        currentProgramTitle: 'The 6 Phase Meditation',
        currentProgramLessonCount: 20,
        completedPrograms: ['silva', 'duality', 'art-manifesting', 'manifesting-mastery', 'money-eq', 'feng-shui', 'six-phase'],
        completedPhases: ['mf-foundation'],
        startedAt: '2026-01-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 4,
        weeklyLessonGoal: 4,
        pathwayStreak: 14,
        totalHoursLearned: 105,
        earnedBadges: ['Foundation Builder'],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: 'phase',
    celebrationPhaseNumber: 1,
  },
  {
    id: 'celebrate-pathway',
    label: 'Celebrate: Pathway Complete',
    ownedPathways: [MANIFESTING_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-integration',
        currentProgramId: 'int-extraordinary-2',
        currentLessonId: 'done',
        currentLessonNumber: 22,
        currentLessonTitle: 'The Extraordinary Life',
        currentProgramTitle: 'Be Extraordinary Advanced',
        currentProgramLessonCount: 22,
        completedPrograms: MANIFESTING_PHASES.flatMap(p => p.programs.map(pr => pr.questId)),
        completedPhases: MANIFESTING_PHASES.map(p => p.id),
        startedAt: '2025-06-01T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 4,
        weeklyLessonGoal: 4,
        pathwayStreak: 45,
        totalHoursLearned: 380,
        earnedBadges: ['Foundation Builder', 'Deep Diver', 'Master Manifestor', 'Integration Expert'],
      },
    },
    activePathwayId: 'manifesting',
    showCelebration: 'pathway',
  },
  {
    id: 'multi-pathway',
    label: 'Multiple Pathways',
    ownedPathways: [MANIFESTING_PATHWAY, LONGEVITY_PATHWAY],
    progressMap: {
      manifesting: {
        pathwayId: 'manifesting',
        currentPhaseId: 'mf-foundation',
        currentProgramId: 'art-manifesting',
        currentLessonId: 'am-l4',
        currentLessonNumber: 4,
        currentLessonTitle: 'The Alpha Level Technique',
        currentProgramTitle: 'The Art of Manifesting',
        currentProgramLessonCount: 15,
        completedPrograms: ['silva', 'duality'],
        completedPhases: [],
        startedAt: '2026-02-01T00:00:00Z',
        lastActivityAt: '2026-03-25T00:00:00Z',
        weeklyLessonCount: 3,
        weeklyLessonGoal: 4,
        pathwayStreak: 5,
        totalHoursLearned: 62,
        earnedBadges: [],
      },
      longevity: {
        pathwayId: 'longevity',
        currentPhaseId: 'lg-foundation',
        currentProgramId: 'ten-x-fitness-lg',
        currentLessonId: 'txf-l8',
        currentLessonNumber: 8,
        currentLessonTitle: 'Upper Body Power',
        currentProgramTitle: '10x Fitness',
        currentProgramLessonCount: 26,
        completedPrograms: [],
        completedPhases: [],
        startedAt: '2026-03-15T00:00:00Z',
        lastActivityAt: '2026-03-26T00:00:00Z',
        weeklyLessonCount: 2,
        weeklyLessonGoal: 4,
        pathwayStreak: 3,
        totalHoursLearned: 8,
        earnedBadges: [],
      },
    },
    activePathwayId: 'longevity', // most recent
    showCelebration: null,
  },
];

// ─── Social proof mock data ─────────────────────────────────────────────────

export const SOCIAL_PROOF = {
  activeLearners: 1247,
  phaseCompletionRate: 73, // percent
  peerPercentile: 27, // "Top 27%"
  forwardMotivation: 89, // "89% who reach Phase 2 finish the Pathway"
};
```

- [ ] **Step 2: Verify the file has no syntax errors**

Run: `cd /Users/nareshsanchana/Documents/Projects/transformation-progress && npx tsc --noEmit src/data/pathwayData.ts 2>&1 | head -20`

Expected: No errors, or only errors related to unresolved imports (which is fine since this file is self-contained).

- [ ] **Step 3: Commit**

```bash
git add src/data/pathwayData.ts
git commit -m "feat: add pathway data model, mock data, and scenario presets"
```

---

### Task 2: Pathway Context Provider

**Files:**
- Create: `src/context/PathwayContext.tsx`
- Modify: `App.tsx`

This context wraps the app and provides pathway state plus a scenario switcher. The scenario switcher is the key mechanism for reviewing all visual states.

- [ ] **Step 1: Create PathwayContext**

```typescript
// src/context/PathwayContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  PathwayScenario,
  Pathway,
  UserPathwayProgress,
  PATHWAY_SCENARIOS,
} from '../data/pathwayData';

interface PathwayContextType {
  // Current scenario
  scenario: PathwayScenario;
  setScenarioById: (id: string) => void;
  allScenarios: PathwayScenario[];

  // Derived state
  ownedPathways: Pathway[];
  activePathway: Pathway | null;
  activeProgress: UserPathwayProgress | null;
  hasPathway: boolean;

  // Switcher
  activePathwayId: string;
  setActivePathwayId: (id: string) => void;

  // Celebration
  showCelebration: null | 'program' | 'phase' | 'pathway';
  celebrationPhaseNumber: number | undefined;
  dismissCelebration: () => void;
}

const PathwayContext = createContext<PathwayContextType | undefined>(undefined);

export function PathwayProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioId] = useState('mid-progress');
  const [celebrationDismissed, setCelebrationDismissed] = useState(false);

  const scenario = PATHWAY_SCENARIOS.find(s => s.id === scenarioId) ?? PATHWAY_SCENARIOS[0];
  const [overrideActiveId, setOverrideActiveId] = useState<string | null>(null);

  const activePathwayId = overrideActiveId ?? scenario.activePathwayId;
  const activePathway = scenario.ownedPathways.find(p => p.id === activePathwayId) ?? null;
  const activeProgress = activePathwayId ? scenario.progressMap[activePathwayId] ?? null : null;

  const setScenarioById = (id: string) => {
    setScenarioId(id);
    setOverrideActiveId(null);
    setCelebrationDismissed(false);
  };

  const setActivePathwayId = (id: string) => {
    setOverrideActiveId(id);
  };

  const value: PathwayContextType = {
    scenario,
    setScenarioById,
    allScenarios: PATHWAY_SCENARIOS,
    ownedPathways: scenario.ownedPathways,
    activePathway,
    activeProgress,
    hasPathway: scenario.ownedPathways.length > 0,
    activePathwayId,
    setActivePathwayId,
    showCelebration: celebrationDismissed ? null : scenario.showCelebration,
    celebrationPhaseNumber: scenario.celebrationPhaseNumber,
    dismissCelebration: () => setCelebrationDismissed(true),
  };

  return (
    <PathwayContext.Provider value={value}>
      {children}
    </PathwayContext.Provider>
  );
}

export function usePathway() {
  const context = useContext(PathwayContext);
  if (context === undefined) {
    throw new Error('usePathway must be used within a PathwayProvider');
  }
  return context;
}
```

- [ ] **Step 2: Wrap App.tsx with PathwayProvider**

In `App.tsx`, add the import and wrap the existing providers:

Add import at top:
```typescript
import { PathwayProvider } from './src/context/PathwayContext';
```

Wrap inside `UserProvider`:
```tsx
<UserProvider>
  <PathwayProvider>
    {/* existing SafeAreaProvider + NavigationContainer */}
  </PathwayProvider>
</UserProvider>
```

- [ ] **Step 3: Commit**

```bash
git add src/context/PathwayContext.tsx App.tsx
git commit -m "feat: add PathwayContext with scenario switcher"
```

---

### Task 3: Scenario Selector in Header

**Files:**
- Modify: `src/components/Header.tsx`

Add a dropdown/picker below the existing tier selector that lets you switch between pathway scenarios.

- [ ] **Step 1: Read Header.tsx to understand current structure**

Read the full file first.

- [ ] **Step 2: Add scenario selector**

Add import at top of Header.tsx:
```typescript
import { usePathway } from '../context/PathwayContext';
```

Below the existing tier selector row, add a scenario selector row:

```tsx
// Inside the Header component, after the tier selector buttons
const { scenario, setScenarioById, allScenarios } = usePathway();

// Render after the existing tier buttons row:
<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 6 }} contentContainerStyle={{ paddingHorizontal: 12, gap: 6 }}>
  {allScenarios.map(s => (
    <TouchableOpacity
      key={s.id}
      onPress={() => setScenarioById(s.id)}
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: scenario.id === s.id ? '#7B68EE' : 'transparent',
      }}
    >
      <Text style={{
        fontSize: 10,
        color: scenario.id === s.id ? '#fff' : colors.textMuted,
        fontWeight: scenario.id === s.id ? '700' : '400',
      }}>
        {s.label}
      </Text>
    </TouchableOpacity>
  ))}
</ScrollView>
```

- [ ] **Step 3: Verify it renders**

Run: `cd /Users/nareshsanchana/Documents/Projects/transformation-progress && npx expo start --web` (or check that the app compiles without errors)

- [ ] **Step 4: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add pathway scenario selector to Header for state preview"
```

---

### Task 4: MyPathwayCard Component

**Files:**
- Create: `src/components/MyPathwayCard.tsx`

The action-forward card that sits at the top of the Today screen.

- [ ] **Step 1: Create the component**

```typescript
// src/components/MyPathwayCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { usePathway } from '../context/PathwayContext';
import { SOCIAL_PROOF } from '../data/pathwayData';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface MyPathwayCardProps {
  onSwitchPress?: () => void;
}

export default function MyPathwayCard({ onSwitchPress }: MyPathwayCardProps) {
  const navigation = useNavigation<NavigationProp>();
  const { activePathway, activeProgress, ownedPathways } = usePathway();

  if (!activePathway || !activeProgress) return null;

  const currentPhase = activePathway.phases.find(p => p.id === activeProgress.currentPhaseId);
  const completedInPhase = currentPhase
    ? currentPhase.programs.filter(p => activeProgress.completedPrograms.includes(p.questId)).length
    : 0;
  const totalInPhase = currentPhase?.programs.length ?? 0;
  const phaseProgress = totalInPhase > 0 ? completedInPhase / totalInPhase : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('PathwayDetail' as any, { pathwayId: activePathway.id })}
    >
      {/* Header row */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconBox, { backgroundColor: activePathway.accentColor + '33' }]}>
            <Text style={styles.iconText}>{activePathway.icon}</Text>
          </View>
          <View>
            <Text style={styles.label}>MY PATHWAY</Text>
            <Text style={styles.pathwayName}>{activePathway.name}</Text>
          </View>
        </View>
        {ownedPathways.length > 1 && (
          <TouchableOpacity onPress={onSwitchPress} style={styles.switchBtn}>
            <Text style={styles.switchText}>Switch</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Hero lesson block */}
      <View style={[styles.heroBlock, { backgroundColor: activePathway.gradientColors[0] }]}>
        <Text style={styles.durationBadge}>{Math.round(activeProgress.currentProgramLessonCount * 0.75)} min</Text>
        <Text style={styles.upNext}>UP NEXT</Text>
        <Text style={styles.lessonTitle} numberOfLines={1}>{activeProgress.currentLessonTitle}</Text>
        <Text style={styles.lessonMeta}>
          {activeProgress.currentProgramTitle} · Lesson {activeProgress.currentLessonNumber} of {activeProgress.currentProgramLessonCount}
        </Text>
        <TouchableOpacity style={styles.continueBtn} activeOpacity={0.8}>
          <Ionicons name="play" size={16} color="#fff" />
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom compact row */}
      <View style={styles.bottomRow}>
        <View style={styles.phaseInfo}>
          <Text style={styles.phaseText}>
            {currentPhase?.icon} {currentPhase?.name} · {completedInPhase}/{totalInPhase} programs
          </Text>
          <View style={styles.miniProgressTrack}>
            <View style={[styles.miniProgressFill, { width: `${phaseProgress * 100}%` }]} />
          </View>
        </View>
        <View style={styles.statsRow}>
          {activeProgress.pathwayStreak > 0 && (
            <Text style={styles.statText}>
              <Text style={{ color: colors.gold }}>{'\u{1F525}'} {activeProgress.pathwayStreak}</Text>
            </Text>
          )}
          <Text style={styles.statText}>
            {activeProgress.weeklyLessonCount}/{activeProgress.weeklyLessonGoal}{' '}
            <Text style={styles.statLabel}>wk</Text>
          </Text>
        </View>
      </View>

      {/* Social proof */}
      <View style={styles.socialRow}>
        <Text style={styles.socialText}>
          {SOCIAL_PROOF.activeLearners.toLocaleString()} active learners
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 18 },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1,
    fontWeight: '600',
  },
  pathwayName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  switchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  switchText: {
    fontSize: 12,
    color: colors.textMuted,
  },

  // Hero block
  heroBlock: {
    marginHorizontal: 12,
    borderRadius: 14,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  durationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    fontSize: 10,
    color: '#ccc',
  },
  upNext: {
    fontSize: 11,
    color: '#7B68EE',
    fontWeight: '600',
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  lessonMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#7B68EE',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 6,
  },
  continueBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  // Bottom row
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
  },
  phaseInfo: {
    flex: 1,
    marginRight: 12,
  },
  phaseText: {
    fontSize: 12,
    color: colors.teal,
    fontWeight: '600',
    marginBottom: 4,
  },
  miniProgressTrack: {
    height: 4,
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
    width: 120,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.teal,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '400',
  },

  // Social proof
  socialRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  socialText: {
    fontSize: 11,
    color: colors.textMuted,
    backgroundColor: colors.backgroundElevated,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MyPathwayCard.tsx
git commit -m "feat: add MyPathwayCard action-forward component"
```

---

### Task 5: PathwaySwitcher Component

**Files:**
- Create: `src/components/PathwaySwitcher.tsx`

Simple modal bottom sheet that lists owned pathways for switching.

- [ ] **Step 1: Create the component**

```typescript
// src/components/PathwaySwitcher.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { usePathway } from '../context/PathwayContext';

interface PathwaySwitcherProps {
  visible: boolean;
  onClose: () => void;
}

export default function PathwaySwitcher({ visible, onClose }: PathwaySwitcherProps) {
  const { ownedPathways, activePathwayId, setActivePathwayId } = usePathway();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.title}>Switch Pathway</Text>
          {ownedPathways.map(pw => (
            <TouchableOpacity
              key={pw.id}
              style={[styles.row, pw.id === activePathwayId && styles.rowActive]}
              onPress={() => { setActivePathwayId(pw.id); onClose(); }}
            >
              <Text style={styles.icon}>{pw.icon}</Text>
              <View style={styles.rowInfo}>
                <Text style={styles.rowName}>{pw.name}</Text>
                <Text style={styles.rowTagline}>{pw.tagline}</Text>
              </View>
              {pw.id === activePathwayId && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.backgroundCard,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: colors.backgroundElevated,
  },
  rowActive: {
    borderWidth: 1,
    borderColor: 'rgba(123,104,238,0.3)',
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  rowInfo: {
    flex: 1,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  rowTagline: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7B68EE',
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PathwaySwitcher.tsx
git commit -m "feat: add PathwaySwitcher bottom sheet component"
```

---

### Task 6: Integrate MyPathwayCard into TodayScreen

**Files:**
- Modify: `src/screens/TodayScreen.tsx`

Insert the card after the greeting, add the switcher modal, filter Continue Programs.

- [ ] **Step 1: Add imports at the top of TodayScreen.tsx**

```typescript
import MyPathwayCard from '../components/MyPathwayCard';
import PathwaySwitcher from '../components/PathwaySwitcher';
import { usePathway } from '../context/PathwayContext';
```

- [ ] **Step 2: Add state and context inside the component**

After the existing `const { isSubscriber, userName, dayStreak, userTier } = useUser();` line, add:

```typescript
const { hasPathway, activeProgress } = usePathway();
const [showSwitcher, setShowSwitcher] = useState(false);
```

Also add `useState` to the React import if not already there.

- [ ] **Step 3: Insert MyPathwayCard after the streak card**

After the closing `</TouchableOpacity>` of the Day Streak card (around line 110), add:

```tsx
{/* My Pathway */}
{hasPathway && (
  <MyPathwayCard onSwitchPress={() => setShowSwitcher(true)} />
)}
```

- [ ] **Step 4: Filter Continue Programs to exclude active pathway programs**

In the subscriber section where `continuePrograms.map(...)` is called, wrap it to filter:

```typescript
const filteredContinuePrograms = hasPathway && activeProgress
  ? continuePrograms.filter(p => !activeProgress.completedPrograms.includes(p.id) && p.id !== activeProgress.currentProgramId)
  : continuePrograms;
```

Add this before the return statement, then replace `continuePrograms.map(` with `filteredContinuePrograms.map(`.

- [ ] **Step 5: Add PathwaySwitcher modal at the end of the ScrollView**

Before the closing `</SafeAreaView>`, add:

```tsx
<PathwaySwitcher visible={showSwitcher} onClose={() => setShowSwitcher(false)} />
```

- [ ] **Step 6: Commit**

```bash
git add src/screens/TodayScreen.tsx
git commit -m "feat: integrate MyPathwayCard into TodayScreen with switcher"
```

---

### Task 7: ProgramTimelineItem Component

**Files:**
- Create: `src/components/ProgramTimelineItem.tsx`

Individual program row in the vertical timeline with three visual states: completed, current, locked.

- [ ] **Step 1: Create the component**

```typescript
// src/components/ProgramTimelineItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import type { PathwayProgram } from '../data/pathwayData';

type ProgramState = 'completed' | 'current' | 'locked';

interface ProgramTimelineItemProps {
  program: PathwayProgram;
  state: ProgramState;
  lessonProgress?: number; // current lesson / total lessons, 0-1
  currentLessonLabel?: string; // e.g., "Lesson 4 of 15 · 15 min"
  onPress?: () => void;
}

export default function ProgramTimelineItem({
  program,
  state,
  lessonProgress = 0,
  currentLessonLabel,
  onPress,
}: ProgramTimelineItemProps) {
  const imgSrc = typeof program.image === 'string' ? { uri: program.image } : (program.image as any);

  return (
    <View style={styles.row}>
      {/* Timeline dot */}
      <View style={styles.dotColumn}>
        {state === 'completed' && (
          <View style={styles.dotCompleted}>
            <Ionicons name="checkmark" size={10} color="#fff" />
          </View>
        )}
        {state === 'current' && <View style={styles.dotCurrent} />}
        {state === 'locked' && <View style={styles.dotLocked} />}
      </View>

      {/* Program card */}
      <TouchableOpacity
        style={[
          styles.card,
          state === 'current' && styles.cardCurrent,
          state === 'completed' && styles.cardCompleted,
          state === 'locked' && styles.cardLocked,
        ]}
        activeOpacity={state === 'locked' ? 1 : 0.7}
        onPress={state !== 'locked' ? onPress : undefined}
      >
        <View style={styles.thumbWrap}>
          <Image source={imgSrc} style={styles.thumb} />
          {state === 'current' && (
            <View style={styles.playOverlay}>
              <Ionicons name="play" size={14} color="#fff" />
            </View>
          )}
          {state === 'locked' && (
            <View style={styles.lockOverlay}>
              <Ionicons name="lock-closed" size={14} color="#5A6577" />
            </View>
          )}
        </View>

        <View style={styles.info}>
          <Text style={[styles.title, state === 'locked' && styles.textLocked]} numberOfLines={1}>
            {program.title}
          </Text>
          {state === 'completed' && (
            <Text style={styles.completedLabel}>Completed {'\u2713'}</Text>
          )}
          {state === 'current' && currentLessonLabel && (
            <>
              <Text style={styles.currentLabel}>{currentLessonLabel}</Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${lessonProgress * 100}%` }]} />
              </View>
            </>
          )}
          {state === 'locked' && (
            <Text style={styles.lockedLabel}>
              {program.isMostPopular ? 'Most popular in this phase' : 'Unlocks next'}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dotColumn: {
    width: 30,
    alignItems: 'center',
  },
  dotCompleted: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7B68EE',
    shadowColor: '#7B68EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
  dotLocked: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.backgroundElevated,
    borderWidth: 1.5,
    borderColor: colors.border,
  },

  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 10,
    padding: 10,
    gap: 10,
  },
  cardCurrent: {
    borderWidth: 1,
    borderColor: 'rgba(123,104,238,0.3)',
  },
  cardCompleted: {
    opacity: 0.7,
  },
  cardLocked: {
    opacity: 0.4,
  },

  thumbWrap: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.backgroundElevated,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },

  info: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  textLocked: {
    color: colors.textMuted,
  },
  completedLabel: {
    fontSize: 11,
    color: colors.teal,
    marginTop: 2,
  },
  currentLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  progressTrack: {
    height: 3,
    backgroundColor: colors.progressTrack,
    borderRadius: 2,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#7B68EE',
  },
  lockedLabel: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
});
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ProgramTimelineItem.tsx
git commit -m "feat: add ProgramTimelineItem with completed/current/locked states"
```

---

### Task 8: PhaseTimeline and PhaseCollapsed Components

**Files:**
- Create: `src/components/PhaseTimeline.tsx`
- Create: `src/components/PhaseCollapsed.tsx`

- [ ] **Step 1: Create PhaseTimeline (expanded phase)**

```typescript
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
```

- [ ] **Step 2: Create PhaseCollapsed**

```typescript
// src/components/PhaseCollapsed.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import type { Phase } from '../data/pathwayData';

interface PhaseCollapsedProps {
  phase: Phase;
  state: 'completed' | 'locked';
  opacity?: number;
  onPress?: () => void;
}

export default function PhaseCollapsed({ phase, state, opacity = 1, onPress }: PhaseCollapsedProps) {
  return (
    <TouchableOpacity
      style={[styles.container, { opacity }]}
      activeOpacity={state === 'completed' ? 0.7 : 1}
      onPress={state === 'completed' ? onPress : undefined}
    >
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{phase.icon}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>Phase {phase.phaseNumber}: {phase.name}</Text>
        <Text style={styles.meta}>
          {phase.programs.length} programs
          {state === 'locked' && ` · Unlocks after Phase ${phase.phaseNumber - 1}`}
          {state === 'completed' && ' · Completed'}
        </Text>
      </View>
      {state === 'locked' && (
        <Ionicons name="lock-closed" size={16} color={colors.textMuted} />
      )}
      {state === 'completed' && (
        <Ionicons name="checkmark-circle" size={16} color={colors.teal} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    marginBottom: 10,
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 14 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: '#fff' },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
});
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PhaseTimeline.tsx src/components/PhaseCollapsed.tsx
git commit -m "feat: add PhaseTimeline and PhaseCollapsed components"
```

---

### Task 9: PathwayDetailScreen

**Files:**
- Create: `src/screens/PathwayDetailScreen.tsx`
- Modify: `src/navigation/RootNavigator.tsx`

- [ ] **Step 1: Create PathwayDetailScreen**

```typescript
// src/screens/PathwayDetailScreen.tsx
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { usePathway } from '../context/PathwayContext';
import { SOCIAL_PROOF } from '../data/pathwayData';
import PhaseTimeline from '../components/PhaseTimeline';
import PhaseCollapsed from '../components/PhaseCollapsed';
import type { RootStackParamList } from '../navigation/RootNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function PathwayDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { activePathway, activeProgress } = usePathway();

  if (!activePathway || !activeProgress) return null;

  const completedProgramCount = activeProgress.completedPrograms.length;
  const overallProgress = activePathway.totalPrograms > 0
    ? completedProgramCount / activePathway.totalPrograms
    : 0;

  const currentPhaseIndex = activePathway.phases.findIndex(p => p.id === activeProgress.currentPhaseId);

  const navigateToQuest = (questId: string, title: string, image: string, author: string) => {
    navigation.navigate('QuestDetail', {
      questId,
      questTitle: title,
      questImage: image,
      author,
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.headerSection, { backgroundColor: activePathway.gradientColors[0] }]}>
          <View style={styles.navRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreBtn}>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.titleRow}>
            <View style={[styles.iconBox, { backgroundColor: activePathway.accentColor + '33' }]}>
              <Text style={styles.iconText}>{activePathway.icon}</Text>
            </View>
            <View style={styles.titleInfo}>
              <Text style={styles.pathwayTitle}>{activePathway.name} Pathway</Text>
              <Text style={styles.pathwayMeta}>
                {activePathway.totalPrograms} programs · {activePathway.totalLessons} lessons
              </Text>
            </View>
          </View>

          {/* Overall progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressPercent}>{Math.round(overallProgress * 100)}% complete</Text>
              <Text style={styles.progressCount}>{completedProgramCount} of {activePathway.totalPrograms} programs</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${overallProgress * 100}%` }]} />
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {activeProgress.pathwayStreak > 0 ? `\u{1F525} ${activeProgress.pathwayStreak}` : '0'}
              </Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {activeProgress.weeklyLessonCount}/{activeProgress.weeklyLessonGoal}
              </Text>
              <Text style={styles.statLabel}>This week</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{activeProgress.totalHoursLearned}h</Text>
              <Text style={styles.statLabel}>Learned</Text>
            </View>
            <View style={[styles.statBox, { flex: 1 }]}>
              <Text style={[styles.statValue, { color: '#7B68EE' }]}>
                {'\u{1F3C6}'} {activeProgress.earnedBadges.length}
              </Text>
              <Text style={styles.statLabel}>Badges</Text>
            </View>
          </View>
        </View>

        {/* Social proof bar */}
        <View style={styles.socialBar}>
          <View style={styles.avatarStack}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.avatarDot, { marginLeft: i > 0 ? -8 : 0, backgroundColor: ['#4a3a6e', '#3a4a6e', '#6a3a4e'][i] }]} />
            ))}
          </View>
          <Text style={styles.socialText}>
            {SOCIAL_PROOF.activeLearners.toLocaleString()} active · {SOCIAL_PROOF.phaseCompletionRate}% finish Phase 1
          </Text>
        </View>

        {/* Phases */}
        <View style={styles.phasesSection}>
          {activePathway.phases.map((phase, index) => {
            const isCompleted = activeProgress.completedPhases.includes(phase.id);
            const isCurrent = phase.id === activeProgress.currentPhaseId;
            const isFuture = index > currentPhaseIndex;

            if (isCurrent) {
              return (
                <PhaseTimeline
                  key={phase.id}
                  phase={phase}
                  progress={activeProgress}
                  onProgramPress={navigateToQuest}
                />
              );
            }

            if (isCompleted) {
              return (
                <PhaseCollapsed
                  key={phase.id}
                  phase={phase}
                  state="completed"
                />
              );
            }

            // Future/locked
            const distanceFromCurrent = index - currentPhaseIndex;
            const opacity = Math.max(0.25, 0.6 - (distanceFromCurrent - 1) * 0.15);
            return (
              <PhaseCollapsed
                key={phase.id}
                phase={phase}
                state="locked"
                opacity={opacity}
              />
            );
          })}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  headerSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  backBtn: { padding: 4 },
  moreBtn: { padding: 4 },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  titleInfo: { flex: 1 },
  pathwayTitle: { fontSize: 22, fontWeight: '800', color: '#fff' },
  pathwayMeta: { fontSize: 13, color: colors.textMuted, marginTop: 2 },

  progressSection: { marginBottom: 14 },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressPercent: { fontSize: 12, color: colors.teal, fontWeight: '600' },
  progressCount: { fontSize: 12, color: colors.textMuted },
  progressTrack: {
    height: 6,
    backgroundColor: colors.progressTrack,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.teal,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: { fontSize: 16, fontWeight: '700', color: '#fff' },
  statLabel: { fontSize: 10, color: colors.textMuted, marginTop: 2 },

  socialBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(123,104,238,0.08)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(123,104,238,0.15)',
    gap: 8,
  },
  avatarStack: { flexDirection: 'row' },
  avatarDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.background,
  },
  socialText: { fontSize: 12, color: colors.textMuted },

  phasesSection: {
    padding: 20,
  },
});
```

- [ ] **Step 2: Register in RootNavigator**

In `src/navigation/RootNavigator.tsx`:

Add import:
```typescript
import PathwayDetailScreen from '../screens/PathwayDetailScreen';
```

Add to `RootStackParamList`:
```typescript
PathwayDetail: {
  pathwayId: string;
};
```

Add Screen inside the Stack.Navigator, after the Progress screen:
```tsx
<Stack.Screen name="PathwayDetail" component={PathwayDetailScreen} options={{ animation: 'slide_from_right' }} />
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/PathwayDetailScreen.tsx src/navigation/RootNavigator.tsx
git commit -m "feat: add PathwayDetailScreen with vertical timeline and register route"
```

---

### Task 10: Milestone Celebration Modals

**Files:**
- Create: `src/components/MilestoneCelebration.tsx`
- Create: `src/components/ProgramCompleteCelebration.tsx`
- Modify: `src/screens/TodayScreen.tsx` (add celebration rendering)

- [ ] **Step 1: Create MilestoneCelebration (phase + pathway complete)**

```typescript
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
            {' of learners · '}
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
```

- [ ] **Step 2: Create ProgramCompleteCelebration (inline)**

```typescript
// src/components/ProgramCompleteCelebration.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { usePathway } from '../context/PathwayContext';

export default function ProgramCompleteCelebration() {
  const { showCelebration, dismissCelebration, activeProgress } = usePathway();

  if (showCelebration !== 'program' || !activeProgress) return null;

  const lastCompleted = activeProgress.completedPrograms[activeProgress.completedPrograms.length - 1];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={dismissCelebration}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.confetti}>{'\u{1F389}'}</Text>
          <Text style={styles.title}>Program Complete!</Text>
          <Text style={styles.subtitle}>
            You finished a program in your Pathway. Keep the momentum going!
          </Text>
          <Text style={styles.stat}>
            {activeProgress.completedPrograms.length} programs completed
          </Text>
          <TouchableOpacity style={styles.ctaButton} onPress={dismissCelebration}>
            <Text style={styles.ctaText}>
              Next: {activeProgress.currentProgramTitle} {'\u2192'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(10,14,23,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  confetti: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  stat: {
    fontSize: 14,
    color: colors.teal,
    fontWeight: '600',
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#7B68EE',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});
```

- [ ] **Step 3: Add celebrations to TodayScreen**

In `src/screens/TodayScreen.tsx`, add imports:
```typescript
import MilestoneCelebration from '../components/MilestoneCelebration';
import ProgramCompleteCelebration from '../components/ProgramCompleteCelebration';
```

Before the closing `</SafeAreaView>`, add (after the PathwaySwitcher):
```tsx
<MilestoneCelebration />
<ProgramCompleteCelebration />
```

- [ ] **Step 4: Commit**

```bash
git add src/components/MilestoneCelebration.tsx src/components/ProgramCompleteCelebration.tsx src/screens/TodayScreen.tsx
git commit -m "feat: add milestone celebration modals (program, phase, pathway)"
```

---

### Task 11: ProgressScreen Pathways Section

**Files:**
- Modify: `src/screens/ProgressScreen.tsx`

Add a "Pathways" section above the existing stats grid in the Overview tab.

- [ ] **Step 1: Add pathway import and hook**

At the top of `src/screens/ProgressScreen.tsx`, add:
```typescript
import { usePathway } from '../context/PathwayContext';
```

Inside the `OverviewTab` component (convert to use the hook — since it's currently a plain `const`, it needs to become a function component that can use hooks), add:
```typescript
const { ownedPathways, scenario } = usePathway();
```

- [ ] **Step 2: Add Pathways section before the Streak card**

Inside OverviewTab, before the `{/* Streak card */}` comment, add:

```tsx
{/* Pathways */}
{ownedPathways.length > 0 && (
  <View style={{ marginBottom: 20 }}>
    <Text style={ov.sectionTitle}>Pathways</Text>
    {ownedPathways.map(pw => {
      const progress = scenario.progressMap[pw.id];
      if (!progress) return null;
      const completedCount = progress.completedPrograms.length;
      const percentage = Math.round((completedCount / pw.totalPrograms) * 100);
      return (
        <View key={pw.id} style={{
          backgroundColor: colors.backgroundCard, borderRadius: 14, padding: 16,
          borderWidth: 1, borderColor: colors.border, marginBottom: 10,
          flexDirection: 'row', alignItems: 'center', gap: 12,
        }}>
          <Text style={{ fontSize: 24 }}>{pw.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>{pw.name} Pathway</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
              <View style={{ flex: 1, height: 4, backgroundColor: colors.backgroundElevated, borderRadius: 2 }}>
                <View style={{ width: `${percentage}%`, height: 4, borderRadius: 2, backgroundColor: pw.accentColor }} />
              </View>
              <Text style={{ fontSize: 12, color: colors.textMuted }}>{percentage}%</Text>
            </View>
            {progress.earnedBadges.length > 0 && (
              <View style={{ flexDirection: 'row', gap: 4, marginTop: 6 }}>
                {progress.earnedBadges.map((badge, i) => (
                  <View key={i} style={{
                    backgroundColor: 'rgba(245,200,66,0.15)', paddingHorizontal: 8, paddingVertical: 3,
                    borderRadius: 10,
                  }}>
                    <Text style={{ fontSize: 10, color: colors.gold }}>{'\u{1F3C6}'} {badge}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      );
    })}
  </View>
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/screens/ProgressScreen.tsx
git commit -m "feat: add Pathways section to ProgressScreen overview"
```

---

### Task 12: QuestDetailScreen Pathway Context (Breadcrumb + Next in Pathway)

**Files:**
- Modify: `src/screens/QuestDetailScreen.tsx`

- [ ] **Step 1: Add pathway context**

Add import:
```typescript
import { usePathway } from '../context/PathwayContext';
```

Inside the component, add:
```typescript
const { activePathway, activeProgress, hasPathway } = usePathway();

// Find breadcrumb info
const pathwayPhase = hasPathway && activePathway
  ? activePathway.phases.find(p => p.programs.some(pr => pr.questId === 'silva-ultramind' || pr.title === quest.programTitle))
  : null;
```

- [ ] **Step 2: Add breadcrumb below the header**

After the header `</View>` and before the ScrollView, add:
```tsx
{hasPathway && activePathway && pathwayPhase && (
  <View style={{
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8,
    backgroundColor: 'rgba(123,104,238,0.08)',
  }}>
    <Text style={{ fontSize: 11, color: colors.textMuted }}>
      {activePathway.name} Pathway {'>'} {pathwayPhase.name} {'>'} {quest.programTitle}
    </Text>
  </View>
)}
```

- [ ] **Step 3: Update the CTA button to show "Next in Pathway" context**

Replace the existing CTA container with:
```tsx
<View style={styles.ctaContainer}>
  <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
    <Text style={styles.ctaText}>Complete lesson</Text>
  </TouchableOpacity>
  {hasPathway && activeProgress && (
    <Text style={{
      fontSize: 11, color: colors.textMuted, textAlign: 'center', marginTop: 6,
    }}>
      Next in Pathway: {activeProgress.currentProgramTitle}
    </Text>
  )}
</View>
```

- [ ] **Step 4: Commit**

```bash
git add src/screens/QuestDetailScreen.tsx
git commit -m "feat: add pathway breadcrumb and 'Next in Pathway' to QuestDetailScreen"
```

---

### Task 13: Final Integration & Verification

**Files:**
- All previously created/modified files

- [ ] **Step 1: Verify the app compiles**

Run: `cd /Users/nareshsanchana/Documents/Projects/transformation-progress && npx tsc --noEmit 2>&1 | head -30`

Fix any type errors found.

- [ ] **Step 2: Test each scenario by switching in the Header**

Manually verify each scenario renders correctly:
1. **No Pathway** — My Pathway card should not appear
2. **Just Started** — Card shows first lesson, streak 0, 0/4 weekly
3. **Mid-Progress** — Card shows lesson 4 of Art of Manifesting, 2 completed, streak 5, 3/4 weekly
4. **Phase 1 Complete** — Detail screen shows Phase 1 collapsed (completed), Phase 2 expanded
5. **Celebrate: Program Complete** — Program celebration modal appears
6. **Celebrate: Phase 1 Complete** — Full phase celebration modal appears
7. **Celebrate: Pathway Complete** — Grand finale celebration with all badges
8. **Multiple Pathways** — "Switch" button visible, switcher opens, shows both pathways

- [ ] **Step 3: Commit all final fixes**

```bash
git add -A
git commit -m "fix: address integration issues and type errors"
```

- [ ] **Step 4: Final commit with all files verified**

Run `git status` to confirm clean working tree.
