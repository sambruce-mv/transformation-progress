import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { coursesGrid } from '../data/mockData';

export default function CoursesTab() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.grid}>
        {coursesGrid.map(course => {
          const imgSrc = typeof course.coverImage === 'string' ? { uri: course.coverImage } : (course.coverImage as any);
          return (
            <TouchableOpacity key={course.id} style={styles.card} activeOpacity={0.85}>
              <Image source={imgSrc} style={styles.image} />
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  card: {
    width: '48%',
    margin: '1%',
    aspectRatio: 0.75,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
