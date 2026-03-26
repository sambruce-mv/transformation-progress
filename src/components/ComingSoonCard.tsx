import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface ComingSoonCardProps {
  title: string;
  author: string;
  lessonCount: number;
  description: string;
  image: string | number | object;
  onPress?: () => void;
}

export default function ComingSoonCard({ title, author, lessonCount, description, image, onPress }: ComingSoonCardProps) {
  const imgSource = typeof image === 'string' ? { uri: image } : (image as any);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={imgSource} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
        <Text style={styles.lessons}>{lessonCount} lessons</Text>
        <Text style={styles.description} numberOfLines={3}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    backgroundColor: colors.backgroundCard,
    marginBottom: 12,
  },
  info: {},
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  author: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  lessons: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
