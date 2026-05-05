import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface WelcomeBannerProps {
  pathwayName: string;
}

export default function WelcomeBanner({ pathwayName }: WelcomeBannerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✨</Text>
      <Text style={styles.title}>Welcome to {pathwayName}</Text>
      <Text style={styles.subtitle}>
        Your transformation starts here. Complete your first lesson to unlock progress tracking.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(123,104,238,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(123,104,238,0.3)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    textAlign: 'center',
  },
});
