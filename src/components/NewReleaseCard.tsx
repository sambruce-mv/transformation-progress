import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface NewReleaseCardProps {
  title: string;
  author: string;
  lessonCount: number;
  image: string | number | object;
  onPress?: () => void;
}

export default function NewReleaseCard({ title, author, lessonCount, image, onPress }: NewReleaseCardProps) {
  const imgSource = typeof image === 'string' ? { uri: image } : (image as any);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Image source={imgSource} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.meta}>{author} · {lessonCount} lessons</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    height: 162,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: colors.backgroundCard,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
    lineHeight: 19,
  },
  meta: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
});
