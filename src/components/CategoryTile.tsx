import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

interface CategoryTileProps {
  name: string;
  image: string | number | object;
  onPress?: () => void;
}

export default function CategoryTile({ name, image, onPress }: CategoryTileProps) {
  const imgSource = typeof image === 'string' ? { uri: image } : (image as any);
  return (
    <TouchableOpacity style={styles.tile} onPress={onPress} activeOpacity={0.85}>
      <Image source={imgSource} style={styles.image} />
      <View style={styles.overlay} />
      <Text style={styles.name}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    margin: 4,
    backgroundColor: colors.backgroundCard,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  name: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
});
