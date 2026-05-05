import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { usePathway } from '../context/PathwayContext';
import WelcomeBanner from '../components/profile/WelcomeBanner';
import TransformationAttributes from '../components/profile/TransformationAttributes';
import FirstStepsChecklist from '../components/profile/FirstStepsChecklist';
import JourneyTimeline from '../components/profile/JourneyTimeline';
import MomentumChart from '../components/profile/MomentumChart';
import PredictionBanner from '../components/profile/PredictionBanner';
import DropoutReality from '../components/profile/DropoutReality';
import PathwaySwitcher from '../components/profile/PathwaySwitcher';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const {
    ownedPathways,
    scenario: currentScenario,
    allScenarios,
    setScenarioById,
    activePathway,
    activeProgress,
    setActivePathwayId,
    activePathwayId,
  } = usePathway();

  const handleBack = () => navigation.goBack();
  const handleSettings = () => navigation.navigate('Settings' as never);

  const isDay1 = currentScenario.id === 'day-1-just-started';
  const isFewLessons = currentScenario.id === 'few-lessons-complete';
  const is6Months = currentScenario.id === '6-months-2-quests';
  const isMultiPathway = currentScenario.id === 'multi-pathway-2';

  const getAttributes = () => {
    const currentPathwayId = isMultiPathway ? activePathwayId : (activePathway?.id ?? 'manifesting');

    if (isDay1) {
      return [
        { icon: '🧘', name: 'Intuition', progress: 0, unlockText: 'Unlocks after completing Silva Ultramind Quest', color: '#7B68EE' },
        { icon: '✨', name: 'Manifestation Confidence', progress: 0, unlockText: 'Grows as you complete Manifesting programs', color: '#5DCAA5' },
        { icon: '🪞', name: 'Self-Awareness', progress: 0, unlockText: 'Expands through meditation and journaling', color: '#F0997B' },
      ];
    } else if (isFewLessons) {
      return [
        { icon: '🧘', name: 'Intuition', progress: 18, evidence: 'Silva Ultramind in progress + 7 days meditation', color: '#7B68EE' },
        { icon: '✨', name: 'Manifestation Confidence', progress: 0, unlockText: 'Unlocks after completing first program', color: '#5DCAA5' },
        { icon: '🪞', name: 'Self-Awareness', progress: 24, evidence: '3 journal entries + meditation practice', color: '#F0997B' },
      ];
    } else if (currentPathwayId === 'longevity') {
      return [
        { icon: '💪', name: 'Physical Vitality', progress: 42, evidence: 'WildFit in progress + 10x Fitness started', color: '#5DCAA5' },
        { icon: '🌿', name: 'Recovery Capacity', progress: 35, evidence: '12 days of consistent training', color: '#7B68EE' },
        { icon: '😴', name: 'Sleep Quality', progress: 0, unlockText: 'Unlocks after completing Sleep Mastery', color: '#F0997B' },
      ];
    } else {
      return [
        { icon: '🧘', name: 'Intuition', progress: 72, evidence: 'Silva Ultramind + Duality + 24 days meditation', color: '#7B68EE' },
        { icon: '✨', name: 'Manifestation Confidence', progress: 45, evidence: '2/5 Manifesting programs complete', color: '#5DCAA5' },
        { icon: '🪞', name: 'Self-Awareness', progress: 88, evidence: '18 journal entries + daily meditation', color: '#F0997B' },
      ];
    }
  };

  const checklistItems = [
    { title: 'Start your first Quest', description: 'Silva Ultramind - Lesson 1', done: true },
    { title: 'Complete your first lesson', description: 'Unlock progress tracking', done: false },
    { title: 'Try your first meditation', description: 'Start building your practice', done: false },
    { title: 'Complete 3 days in a row', description: 'Build momentum early', done: false },
  ];

  const getMilestones = () => {
    if (isDay1) {
      return [
        { label: 'Today', title: 'Started Manifesting', description: 'Silva Ultramind - Lesson 1 in progress', status: 'current' as const },
        { label: 'Coming up', title: 'First breakthrough', description: 'Complete your first Quest', status: 'future' as const },
        { label: 'Ahead', title: 'Deep transformation', description: 'Multiple programs complete', status: 'future' as const },
      ];
    } else if (isFewLessons) {
      return [
        { label: '2 weeks ago', title: 'Started Manifesting', description: 'Silva Ultramind - Day 1', status: 'completed' as const },
        { label: 'Today', title: 'Building momentum', description: 'Silva Ultramind - Lesson 8', status: 'current' as const },
        { label: 'Coming up', title: 'First Quest Complete', description: 'Silva Ultramind finished', status: 'future' as const },
      ];
    } else {
      return [
        { label: '6 months ago', title: 'Started Manifesting', description: 'Silva Ultramind - Day 1', status: 'completed' as const },
        { label: '4 months ago', title: 'First Quest Complete', description: 'Silva Ultramind finished', status: 'completed' as const },
        { label: '2 months ago', title: 'Second Quest Complete', description: 'Duality mastered', status: 'completed' as const },
        { label: 'Today', title: 'Deep transformation', description: 'Art of Manifesting - Lesson 4', status: 'current' as const },
        { label: 'Coming up', title: 'Phase 1 Complete', description: 'Foundation mastered', status: 'future' as const },
      ];
    }
  };

  const getSubtitle = () => {
    if (isDay1) return 'Just started your journey';
    if (isFewLessons) return '2 weeks into transformation';
    return '6 months into transformation';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={handleSettings} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Scenario Switcher */}
      <View style={styles.scenarioSwitcher}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scenarioTabs}
        >
          {allScenarios.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={[
                styles.scenarioTab,
                s.id === currentScenario.id && styles.scenarioTabActive,
              ]}
              onPress={() => setScenarioById(s.id)}
            >
              <Text style={[
                styles.scenarioTabText,
                s.id === currentScenario.id && styles.scenarioTabTextActive,
              ]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileRow}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>Z</Text>
              </View>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Zoona B</Text>
              <Text style={styles.userSubtitle}>{getSubtitle()}</Text>
            </View>
            <TouchableOpacity style={styles.settingsIcon}>
              <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Pathway Switcher (Multi-Pathway only) */}
        {isMultiPathway && (
          <View style={styles.section}>
            <PathwaySwitcher
              pathways={ownedPathways}
              activePathwayId={activePathwayId}
              onSwitch={setActivePathwayId}
            />
          </View>
        )}

        {/* Welcome Banner (Day 1 only) */}
        {isDay1 && activePathway && (
          <View style={styles.section}>
            <WelcomeBanner pathwayName={activePathway.name} />
          </View>
        )}

        {/* Prediction Banner (6 months only) */}
        {is6Months && (
          <View style={styles.section}>
            <PredictionBanner
              programName="The Art of Manifesting"
              completionDate="June 15"
            />
          </View>
        )}

        {/* Transformation Attributes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Who you're becoming</Text>
          <TransformationAttributes attributes={getAttributes()} />
        </View>

        {/* Dropout Reality (6 months and multi-pathway only) */}
        {(is6Months || isMultiPathway) && (
          <View style={styles.section}>
            <DropoutReality dropoutPercentage={72} />
          </View>
        )}

        {/* First Steps Checklist OR Momentum Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {isDay1 ? 'Your first steps' : 'Your momentum'}
          </Text>
          {isDay1 ? (
            <FirstStepsChecklist items={checklistItems} />
          ) : (
            <MomentumChart
              programsPerMonth={isFewLessons ? 0.3 : 1.2}
              trend={isFewLessons ? 'steady' : 'accelerating'}
            />
          )}
        </View>

        {/* Journey Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your journey</Text>
          <JourneyTimeline milestones={getMilestones()} />
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  settingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scenarioSwitcher: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scenarioTabs: {
    gap: 8,
    paddingVertical: 4,
  },
  scenarioTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scenarioTabActive: {
    backgroundColor: 'rgba(123,104,238,0.15)',
    borderColor: colors.primary,
  },
  scenarioTabText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  scenarioTabTextActive: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userSubtitle: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  settingsIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  libraryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
