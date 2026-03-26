import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const { width } = Dimensions.get('window');

interface FeaturedBannerProps {
  title: string;
  subtitle: string;
  label: string;
  buttonText: string;
  image: string;
  onPress?: () => void;
}

export default function FeaturedBanner({
  title,
  subtitle,
  label,
  buttonText,
  image,
  onPress,
}: FeaturedBannerProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <Image source={{ uri: image }} style={styles.backgroundImage} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={styles.labelContainer}>
            <Text style={styles.label}>{label}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width - 32,
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  leftContent: {
    flex: 1,
    justifyContent: 'center',
  },
  labelContainer: {
    backgroundColor: '#FF6B35',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  label: {
    ...typography.caption,
    color: '#fff',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  title: {
    ...typography.h2,
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  button: {
    backgroundColor: colors.teal,
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  buttonText: {
    ...typography.labelSmall,
    color: '#fff',
    fontWeight: '600',
  },
});
