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

export default function SettingsScreen() {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={28} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* General Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General settings</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="person-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.settingText}>Account settings</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="card-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.settingText}>Billing</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.settingText}>Notifications</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="language-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.settingText}>Language</Text>
              <Text style={styles.settingValue}>English</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.lastItem]}>
              <Ionicons name="moon-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.settingText}>Dark/Light Mode</Text>
              <Text style={styles.settingValue}>Light</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Get Help */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="help-circle-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.settingText}>Support</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.lastItem]}>
              <Ionicons name="information-circle-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.settingText}>About</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.settingItem}>
              <Ionicons name="document-text-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.settingText}>Terms of Use</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.settingItem, styles.lastItem]}>
              <Ionicons name="shield-outline" size={24} color={colors.textPrimary} />
              <Text style={styles.settingText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingText: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    marginLeft: 16,
  },
  settingValue: {
    ...typography.body,
    color: colors.textMuted,
    marginRight: 8,
  },
  logoutButton: {
    backgroundColor: '#000',
    marginHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    ...typography.label,
    color: '#fff',
    fontSize: 16,
  },
  bottomPadding: {
    height: 40,
  },
});
