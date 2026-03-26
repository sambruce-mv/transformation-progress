import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';

interface SectionProps {
  title: string;
  subtitle?: string;
  showSeeAll?: boolean;
  horizontal?: boolean;
  children: React.ReactNode;
}

export default function Section({ title, subtitle, showSeeAll, horizontal, children }: SectionProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {showSeeAll && (
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        )}
      </View>
      {horizontal ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalContent}>
          {children}
        </ScrollView>
      ) : (
        <View>{children}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  titleRow: { flex: 1, marginRight: 8 },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textAction,
  },
  horizontalContent: { paddingHorizontal: 20 },
});
