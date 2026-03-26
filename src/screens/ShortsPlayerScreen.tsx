import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { typography } from '../theme/typography';
import { dailyShorts } from '../data/mockData';
import type { RootStackParamList } from '../navigation/RootNavigator';

const { width, height } = Dimensions.get('window');

type ShortsPlayerRouteProp = RouteProp<RootStackParamList, 'ShortsPlayer'>;

interface ShortItem {
  id: string;
  title: string;
  author: string;
  authorDescription: string;
  image: string;
  authorImage: string | number | object;
}

interface ShortVideoProps {
  item: ShortItem;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

function ShortVideo({ item, isPlaying, onTogglePlay, isMuted, onToggleMute }: ShortVideoProps) {
  return (
    <View style={styles.videoContainer}>
      {/* Video/Image Background */}
      <Image source={{ uri: item.image }} style={styles.videoBackground} />

      {/* Overlay gradient */}
      <View style={styles.topOverlay} />
      <View style={styles.bottomOverlay} />

      {/* Mindvalley Logo */}
      <View style={styles.mindvalleyLogo}>
        <Ionicons name="chevron-down" size={24} color="#fff" />
      </View>

      {/* Title at top */}
      <View style={styles.titleContainer}>
        <Text style={styles.videoTitle}>{item.title}</Text>
      </View>

      {/* Author info at bottom */}
      <View style={styles.authorContainer}>
        <Image source={typeof item.authorImage === 'string' ? { uri: item.authorImage } : item.authorImage as any} style={styles.authorImage} />
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{item.author}</Text>
          <Text style={styles.authorDescription}>{item.authorDescription}</Text>
        </View>
        <View style={styles.swipeIndicator}>
          <Ionicons name="chevron-up" size={24} color="rgba(255,255,255,0.7)" />
        </View>
      </View>

      {/* Tap to play/pause overlay */}
      <TouchableOpacity
        style={styles.playOverlay}
        onPress={onTogglePlay}
        activeOpacity={1}
      >
        {!isPlaying && (
          <View style={styles.pausedIndicator}>
            <Ionicons name="play" size={60} color="rgba(255,255,255,0.8)" />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

export default function ShortsPlayerScreen() {
  const navigation = useNavigation();
  const route = useRoute<ShortsPlayerRouteProp>();
  const { initialIndex } = route.params;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleClose = () => {
    navigation.goBack();
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      setIsPlaying(true);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderItem = ({ item, index }: { item: ShortItem; index: number }) => (
    <ShortVideo
      item={item}
      isPlaying={isPlaying && currentIndex === index}
      onTogglePlay={handleTogglePlay}
      isMuted={isMuted}
      onToggleMute={handleToggleMute}
    />
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={handleClose}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Vertical scrolling shorts */}
      <FlatList
        ref={flatListRef}
        data={dailyShorts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height}
        snapToAlignment="start"
        decelerationRate="fast"
        initialScrollIndex={initialIndex}
        getItemLayout={(_, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        <TouchableOpacity onPress={handleTogglePlay} style={styles.controlButton}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleMute} style={styles.controlButton}>
          <Ionicons
            name={isMuted ? 'volume-mute' : 'volume-medium'}
            size={24}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 16,
    zIndex: 100,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoContainer: {
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  videoBackground: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: 'transparent',
    // Linear gradient simulation
    opacity: 0.7,
  },
  bottomOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 250,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  mindvalleyLogo: {
    position: 'absolute',
    top: height * 0.35,
    left: 20,
  },
  titleContainer: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  videoTitle: {
    ...typography.h2,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  authorContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  authorImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#fff',
  },
  authorInfo: {
    flex: 1,
    marginLeft: 12,
  },
  authorName: {
    ...typography.label,
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  authorDescription: {
    ...typography.bodySmall,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  swipeIndicator: {
    padding: 8,
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pausedIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#000',
  },
  controlButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
});
