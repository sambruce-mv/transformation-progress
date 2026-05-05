import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface Attribute {
  icon: string;
  name: string;
  progress: number;
  unlockText?: string;
  evidence?: string;
  color: string;
}

interface TransformationAttributesProps {
  attributes: Attribute[];
}

export default function TransformationAttributes({ attributes }: TransformationAttributesProps) {
  return (
    <View style={styles.container}>
      {attributes.map((attr, index) => (
        <View key={index} style={styles.attributeCard}>
          <View style={styles.attributeHeader}>
            <Text style={[styles.attributeIcon, attr.progress === 0 && styles.iconLocked]}>
              {attr.icon}
            </Text>
            <Text style={[
              styles.attributeName,
              attr.progress === 0 && styles.nameLocked,
            ]}>
              {attr.name}
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${attr.progress}%` as any, backgroundColor: attr.color },
              ]}
            />
          </View>

          {attr.progress === 0 ? (
            <Text style={styles.unlockText}>{attr.unlockText}</Text>
          ) : (
            <Text style={styles.evidence}>{attr.evidence}</Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  attributeCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
  },
  attributeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  attributeIcon: {
    fontSize: 22,
  },
  iconLocked: {
    opacity: 0.4,
  },
  attributeName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  nameLocked: {
    color: '#666',
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
  },
  unlockText: {
    fontSize: 12,
    color: '#888',
    lineHeight: 16,
  },
  evidence: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
});
