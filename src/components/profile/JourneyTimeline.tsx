import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface Milestone {
  label: string;
  title: string;
  description: string;
  status: 'current' | 'completed' | 'future';
}

interface JourneyTimelineProps {
  milestones: Milestone[];
}

export default function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  return (
    <View style={styles.container}>
      <View style={styles.line} />

      {milestones.map((milestone, index) => (
        <View key={index} style={styles.milestone}>
          <View style={[
            styles.dot,
            milestone.status === 'current' && styles.dotCurrent,
            milestone.status === 'completed' && styles.dotCompleted,
            milestone.status === 'future' && styles.dotFuture,
          ]} />

          <View style={styles.content}>
            <Text style={styles.label}>{milestone.label}</Text>
            <Text style={[
              styles.title,
              milestone.status === 'future' && styles.titleFuture,
            ]}>
              {milestone.title}
            </Text>
            <Text style={[
              styles.description,
              milestone.status === 'future' && styles.descriptionFuture,
            ]}>
              {milestone.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 20,
    paddingLeft: 20,
    paddingRight: 18,
    position: 'relative',
  },
  line: {
    position: 'absolute',
    left: 28,
    top: 48,
    bottom: 48,
    width: 2,
    backgroundColor: 'rgba(93,202,165,0.3)',
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingLeft: 36,
    position: 'relative',
  },
  dot: {
    position: 'absolute',
    left: 0,
    top: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#000',
    zIndex: 1,
  },
  dotCurrent: {
    width: 18,
    height: 18,
    top: -1,
    left: -2,
    backgroundColor: '#5DCAA5',
    shadowColor: '#5DCAA5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  dotCompleted: {
    backgroundColor: '#5DCAA5',
  },
  dotFuture: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#888',
    marginBottom: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  titleFuture: {
    color: '#666',
  },
  description: {
    fontSize: 12,
    color: '#888',
  },
  descriptionFuture: {
    color: '#555',
  },
});
