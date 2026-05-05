import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';

interface Pathway {
  id: string;
  name: string;
  icon: string;
}

interface PathwaySwitcherProps {
  pathways: Pathway[];
  activePathwayId: string;
  onSwitch: (pathwayId: string) => void;
}

export default function PathwaySwitcher({ pathways, activePathwayId, onSwitch }: PathwaySwitcherProps) {
  if (pathways.length <= 1) return null;

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabs}
      >
        {pathways.map((pathway) => (
          <TouchableOpacity
            key={pathway.id}
            style={[
              styles.tab,
              pathway.id === activePathwayId && styles.tabActive,
            ]}
            onPress={() => onSwitch(pathway.id)}
          >
            <Text style={styles.tabIcon}>{pathway.icon}</Text>
            <Text style={[
              styles.tabText,
              pathway.id === activePathwayId && styles.tabTextActive,
            ]}>
              {pathway.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  tabs: {
    gap: 8,
    paddingVertical: 4,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  tabActive: {
    backgroundColor: 'rgba(123,104,238,0.15)',
    borderColor: colors.primary,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  tabTextActive: {
    color: colors.primary,
  },
});
