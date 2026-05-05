import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

interface MomentumChartProps {
  programsPerMonth: number;
  trend: 'accelerating' | 'steady' | 'slowing';
}

const BARS = [
  { label: 'Oct', height: 0.3 },
  { label: 'Nov', height: 0.5 },
  { label: 'Dec', height: 0.6 },
  { label: 'Jan', height: 0.7 },
  { label: 'Feb', height: 0.85 },
  { label: 'Mar', height: 1.0 },
];

const CHART_HEIGHT = 80;

export default function MomentumChart({ programsPerMonth, trend }: MomentumChartProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.metric}>{programsPerMonth.toFixed(1)}</Text>
          <Text style={styles.metricLabel}>programs/month</Text>
        </View>
        <View style={styles.trendBadge}>
          <Text style={styles.trendText}>
            {trend === 'accelerating' ? '↗️ Accelerating' : '→ Steady'}
          </Text>
        </View>
      </View>

      <View style={styles.chart}>
        {/* bar columns aligned to bottom */}
        <View style={styles.bars}>
          {BARS.map((bar, index) => (
            <View key={index} style={styles.barContainer}>
              <View
                style={[
                  styles.barFill,
                  { height: Math.max(4, bar.height * CHART_HEIGHT) },
                ]}
              />
            </View>
          ))}
        </View>
        {/* labels row */}
        <View style={styles.labels}>
          {BARS.map((bar, index) => (
            <View key={index} style={styles.barContainer}>
              <Text style={styles.barLabel}>{bar.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.insight}>
        You're completing programs 3× faster than 6 months ago
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  metric: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 38,
  },
  metricLabel: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  trendBadge: {
    backgroundColor: 'rgba(93,202,165,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5DCAA5',
  },
  chart: {
    marginBottom: 16,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: CHART_HEIGHT,
    gap: 6,
  },
  labels: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  barLabel: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  insight: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    lineHeight: 18,
  },
});
