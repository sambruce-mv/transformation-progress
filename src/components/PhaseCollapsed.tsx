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
