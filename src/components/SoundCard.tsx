import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface SoundCardProps {
  id: string;
  title: string;
  author: string;
  image: string;
  rating?: number;
  onPress?: () => void;
}

export default function SoundCard({
  title,
  author,
  image,
  rating,
  onPress,
}: SoundCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} />
        <View style={styles.overlay}>
          <Text style={styles.overlayTitle}>{title}</Text>
          <Text style={styles.overlayAuthor}>{author}</Text>
        </View>
        <View style={styles.mindvalleyLogo}>
          <Ionicons name="chevron-down" size={12} color="#fff" />
        </View>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.author}>{author}</Text>
      {rating && (
        <View style={styles.ratingContainer}>
          <Text style={styles.rating}>{rating}</Text>
          <Ionicons name="star" size={12} color="#FFB800" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: 12,
  },
  imageContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: colors.backgroundCard,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  overlayTitle: {
    ...typography.h4,
    color: '#fff',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  overlayAuthor: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.9)',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  mindvalleyLogo: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  title: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  author: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    ...typography.caption,
    color: colors.textMuted,
    marginRight: 4,
  },
});
