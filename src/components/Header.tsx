import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useUser } from '../context/UserContext';
import { usePathway } from '../context/PathwayContext';

export default function Header() {
  const { userAvatar, userTier, setUserTier } = useUser();
  const isSubscriber = userTier === 'L3' || userTier === 'L3L4';
  const navigation = useNavigation();
  const { scenario, setScenarioById, allScenarios } = usePathway();

  const TIERS: Array<{ key: 'L1' | 'L3' | 'L3L4'; label: string }> = [
    { key: 'L1', label: 'L1' },
    { key: 'L3', label: 'L3' },
    { key: 'L3L4', label: 'L3+L4' },
  ];

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Profile' as never)}>
          <Image
            source={typeof userAvatar === 'string' ? { uri: userAvatar } : userAvatar as any}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {/* Tier Selector */}
        <View style={styles.tierSelector}>
          {TIERS.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tierBtn, userTier === t.key && styles.tierBtnActive]}
              onPress={() => setUserTier(t.key)}
            >
              <Text style={[styles.tierBtnText, userTier === t.key && styles.tierBtnTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Search' as never)}>
            <Ionicons name="search" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate('Notifications' as never)}>
            <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scenarioBar} contentContainerStyle={styles.scenarioBarContent}>
        {allScenarios.map(s => (
          <TouchableOpacity
            key={s.id}
            onPress={() => setScenarioById(s.id)}
            style={[styles.scenarioBtn, scenario.id === s.id && styles.scenarioBtnActive]}
          >
            <Text style={[styles.scenarioBtnText, scenario.id === s.id && styles.scenarioBtnTextActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundCard,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginLeft: 16,
  },
  tierSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
    padding: 3,
    gap: 2,
  },
  tierBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  tierBtnActive: {
    backgroundColor: colors.primary,
  },
  tierBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
  },
  tierBtnTextActive: {
    color: '#fff',
  },
  scenarioBar: {
    maxHeight: 28,
    marginBottom: 4,
  },
  scenarioBarContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 4,
  },
  scenarioBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scenarioBtnActive: {
    backgroundColor: '#7B68EE',
  },
  scenarioBtnText: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '400',
  },
  scenarioBtnTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
