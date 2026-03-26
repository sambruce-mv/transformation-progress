import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

type ContentType = 'quest' | 'meditation' | 'sound';

interface FavoriteCardProps {
  title: string;
  author: string;
  image: string;
  type: ContentType;
  onPress?: () => void;
}

export default function FavoriteCard({
  title,
  author,
  image,
  type = 'quest',
  onPress,
}: FavoriteCardProps) {
  const imageStyle = imageStyles[type];
  const containerStyle = containerStyles[type];

  return (
    <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.imageWrapper, imageStyle]}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.author} numberOfLines={1}>{author}</Text>
    </TouchableOpacity>
  );
}

// Per-type container widths
const containerStyles = StyleSheet.create({
  quest: { width: 160 },
  meditation: { width: 120 },
  sound: { width: 110 },
});

// Per-type image shapes
const imageStyles = StyleSheet.create({
  // Quest/Program — landscape rectangle
  quest: {
    width: 160,
    height: 100,
    borderRadius: 10,
  },
  // Meditation — square
  meditation: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  // Sound — circle
  sound: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
    alignItems: 'center',
  },
  imageWrapper: {
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: colors.backgroundCard,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  author: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
