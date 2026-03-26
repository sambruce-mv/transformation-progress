import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

interface LiveClassCardProps {
  title: string;
  host: string;
  programName: string;
  programLabel?: string;
  time: string;
  image: string | number | object;
  onPress?: () => void;
  onRSVPPress?: () => void;
}

export default function LiveClassCard({
  title,
  host,
  programName,
  programLabel,
  time,
  image,
  onPress,
  onRSVPPress,
}: LiveClassCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={typeof image === 'string' ? { uri: image } : image as any} style={styles.image} />
        <View style={styles.mindvalleyLogo}>
          <Ionicons name="chevron-down" size={12} color="#fff" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.timeContainer}>
          <Text style={styles.todayLabel}>Today</Text>
          <Text style={styles.timeText}> · {time.replace('Today · ', '')}</Text>
        </View>

        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.host}>{host}</Text>

        <View style={styles.programContainer}>
          {programLabel && (
            <Text style={styles.programLabel}>{programLabel}</Text>
          )}
          <Text style={styles.programName}>{programName}</Text>
        </View>

        <TouchableOpacity style={styles.rsvpButton} onPress={onRSVPPress}>
          <Ionicons name="mail-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.rsvpText}>RSVP</Text>
          <Ionicons name="chevron-down" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mindvalleyLogo: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  todayLabel: {
    ...typography.caption,
    color: colors.teal,
    fontWeight: '600',
  },
  timeText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  title: {
    ...typography.label,
    color: colors.textPrimary,
    fontWeight: '600',
    marginBottom: 4,
  },
  host: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  programContainer: {
    marginBottom: 12,
  },
  programLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  programName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  rsvpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rsvpText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    marginLeft: 6,
    marginRight: 4,
  },
});
