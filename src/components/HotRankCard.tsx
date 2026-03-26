import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface HotRankCardProps {
  rank: number;
  title: string;
  author: string;
  image: string | number | object;
  onPress?: () => void;
}

export default function HotRankCard({ rank, title, author, image, onPress }: HotRankCardProps) {
  const imgSource = typeof image === 'string' ? { uri: image } : (image as any);
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.inner}>
        <Text style={styles.rank}>{rank}</Text>
        <Image source={imgSource} style={styles.image} />
      </View>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.author} numberOfLines={1}>{author}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    marginRight: 4,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  rank: {
    fontSize: 52,
    fontWeight: '900',
    color: 'rgba(255,255,255,0.18)',
    lineHeight: 52,
    marginRight: -8,
    zIndex: 1,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 10,
    backgroundColor: colors.backgroundCard,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
    lineHeight: 16,
  },
  author: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
