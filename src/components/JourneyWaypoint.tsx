// src/components/JourneyWaypoint.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

type WaypointState = 'completed' | 'current' | 'locked';

interface JourneyWaypointProps {
  state: WaypointState;
  phaseIcon: string;
  phaseName: string;
  accentColor: string;
}

export default function JourneyWaypoint({
  state,
  phaseIcon,
  phaseName,
  accentColor,
}: JourneyWaypointProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View
        style={[
          styles.badge,
          state === 'completed' && styles.badgeCompleted,
          state === 'current' && [styles.badgeCurrent, { borderColor: accentColor }],
          state === 'locked' && styles.badgeLocked,
        ]}
      >
        {state === 'completed' ? (
          <Ionicons name="checkmark" size={8} color="#fff" />
        ) : (
          <Text style={styles.badgeIcon}>{phaseIcon}</Text>
        )}
      </View>
      <Text
        style={[
          styles.phaseName,
          state === 'completed' && styles.phaseNameCompleted,
          state === 'locked' && styles.phaseNameLocked,
        ]}
        numberOfLines={1}
      >
        {phaseName}
      </Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 50,
    paddingTop: 14,
  },
  line: {
    width: 1,
    height: 8,
    backgroundColor: colors.border,
  },
  badge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 3,
  },
  badgeCompleted: {
    backgroundColor: colors.teal,
  },
  badgeCurrent: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  badgeLocked: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  badgeIcon: {
    fontSize: 10,
  },
  phaseName: {
    fontSize: 8,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 2,
  },
  phaseNameCompleted: {
    color: colors.teal,
  },
  phaseNameLocked: {
    color: colors.textMuted,
  },
});
