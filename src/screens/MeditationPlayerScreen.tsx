import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import type { RootStackParamList } from '../navigation/RootNavigator';

const { width } = Dimensions.get('window');

type MeditationPlayerRouteProp = RouteProp<RootStackParamList, 'MeditationPlayer'>;

export default function MeditationPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute<MeditationPlayerRouteProp>();
  const { title, author, image, duration } = route.params;

  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(6);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Parse duration string to seconds (e.g., "8m" -> 480)
  const parseDuration = (dur: string): number => {
    const match = dur.match(/(\d+)/);
    if (match) {
      const minutes = parseInt(match[1], 10);
      return minutes * 60;
    }
    return 300; // Default 5 minutes
  };

  const totalSeconds = parseDuration(duration);
  const progress = currentTime / totalSeconds;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTotalTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="download-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="share-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.headerIcon}
              onPress={() => setIsBookmarked(!isBookmarked)}
            >
              <Ionicons
                name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Album Artwork */}
          <View style={styles.artworkContainer}>
            <Image source={{ uri: image }} style={styles.artwork} />
          </View>

          {/* Title and Author */}
          <Text style={styles.title}>{title}</Text>
          <View style={styles.authorContainer}>
            <View style={styles.authorAvatar}>
              <Ionicons name="person" size={16} color="#fff" />
            </View>
            <Text style={styles.authorName}>{author}</Text>
          </View>

          {/* Playback Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.seekButton}>
              <Ionicons name="refresh" size={28} color="#fff" style={styles.seekIcon} />
              <Text style={styles.seekText}>15</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.playButton}
              onPress={() => setIsPlaying(!isPlaying)}
            >
              <Ionicons
                name={isPlaying ? 'pause' : 'play'}
                size={40}
                color="#1a1a2e"
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.seekButton}>
              <Ionicons name="refresh" size={28} color="#fff" style={[styles.seekIcon, styles.seekIconForward]} />
              <Text style={styles.seekText}>15</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          {/* Ambient Sound info pill */}
          <View style={styles.ambientContainer}>
            <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.6)" />
            <Text style={styles.ambientLabel}>This meditation has a pre-set ambient sound</Text>
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={22} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              <View style={[styles.progressDot, { left: `${progress * 100}%` }]} />
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTotalTime(totalSeconds)}</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const ARTWORK_SIZE = width - 120;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 20,
    padding: 4,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  artworkContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
    marginBottom: 32,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    ...typography.h3,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
  },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  authorName: {
    ...typography.body,
    color: '#fff',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  seekButton: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 32,
    position: 'relative',
  },
  seekIcon: {
    transform: [{ scaleX: -1 }],
  },
  seekIconForward: {
    transform: [{ scaleX: 1 }],
  },
  seekText: {
    ...typography.caption,
    color: '#fff',
    position: 'absolute',
    fontSize: 10,
    fontWeight: '700',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  ambientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 30,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    gap: 10,
  },
  ambientLabel: {
    flex: 1,
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
  },
  infoButton: {
    padding: 4,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 12,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressDot: {
    position: 'absolute',
    top: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginLeft: -6,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.6)',
  },
});
