import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface DropoutRealityProps {
  dropoutPercentage: number;
}

export default function DropoutReality({ dropoutPercentage }: DropoutRealityProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.percentage}>{dropoutPercentage}%</Text>
      <Text style={styles.text}>quit at this point</Text>
      <Text style={styles.highlight}>You didn't.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(240,153,123,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(240,153,123,0.3)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  percentage: {
    fontSize: 48,
    fontWeight: '700',
    color: '#F0997B',
    lineHeight: 56,
  },
  text: {
    fontSize: 15,
    color: '#999',
    marginBottom: 8,
  },
  highlight: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
