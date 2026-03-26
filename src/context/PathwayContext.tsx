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
