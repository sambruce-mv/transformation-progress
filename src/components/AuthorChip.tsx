import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface AuthorChipProps {
  name: string;
  image: string;
  onPress?: () => void;
}

export default function AuthorChip({
  name,
  image,
  onPress,
}: AuthorChipProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 8,
  },
  image: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  name: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '500',
    maxWidth: 120,
  },
});
