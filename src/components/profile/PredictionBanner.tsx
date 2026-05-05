import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface PredictionBannerProps {
  programName: string;
  completionDate: string;
}

export default function PredictionBanner({ programName, completionDate }: PredictionBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🔮</Text>
      <View style={styles.content}>
        <Text style={styles.title}>On track to complete</Text>
        <Text style={styles.program}>{programName}</Text>
        <Text style={styles.date}>by {completionDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(123,104,238,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(123,104,238,0.3)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  program: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  date: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
