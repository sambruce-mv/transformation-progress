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
