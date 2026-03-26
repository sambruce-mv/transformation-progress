import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';

const ACTIVITIES = [
  { id: 'a1', icon: 'flame', iconBg: '#B91C1C', text: 'Your streak is on fire 🔥 You\'ve meditated 7 days in a row. Keep it up!', time: '2m ago', hasThumb: false },
  { id: 'a2', avatar: require('../../assets/authors/vishen-lakhiani.jpg'), text: 'Vishen Lakhiani posted a new update in Be Extraordinary.', time: '18m ago', hasThumb: true, thumb: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=200&q=80' },
  { id: 'a3', icon: 'checkmark-circle', iconBg: '#059669', text: 'You completed Lesson 3: E.S.P. & the Mental Screen in The Silva Ultramind System.', time: '1h ago', hasThumb: false },
  { id: 'a4', icon: 'heart', iconBg: '#DB2777', text: 'Jeffrey Allen liked your comment in the Duality community.', time: '3h ago', hasThumb: false },
  { id: 'a5', avatar: require('../../assets/authors/jim-kwik.jpg'), text: 'Jim Kwik shared a new tip: "The best time to learn is right after waking up."', time: '5h ago', hasThumb: false },
  { id: 'a6', icon: 'trophy', iconBg: '#D97706', text: 'Milestone unlocked: 10 lessons completed in Superbrain. You\'re in the top 15%!', time: '8h ago', hasThumb: false },
  { id: 'a7', icon: 'calendar', iconBg: '#7C5CFC', text: 'Reminder: Mindvalley AI Summit starts tomorrow at 11:00 PM. You\'re registered!', time: '1d ago', hasThumb: true, thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=200&q=80' },
  { id: 'a8', icon: 'people', iconBg: '#0284C7', text: '3 new members joined your Silva Method network.', time: '1d ago', hasThumb: false },
  { id: 'a9', icon: 'star', iconBg: '#D97706', text: 'You received a new review on your profile: "Inspiring member of the community!"', time: '2d ago', hasThumb: false },
];

const ANNOUNCEMENTS = [
  { id: 'n1', title: 'New Program Launch: Bold Conversations', body: 'Vernā Myers\' groundbreaking new program is now live. Learn to have courageous conversations that create real change.', time: '1h ago', thumb: 'https://images.unsplash.com/photo-1522881451255-f59ad836fdfb?w=600&q=80' },
  { id: 'n2', title: 'Mindvalley AI Summit — Free Event', body: 'Join us March 20–22 for 3 days of AI breakthroughs, live sessions and exclusive workshops. Register now — spots are limited.', time: '3h ago', thumb: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80' },
  { id: 'n3', title: 'App Update: New Meditations Added', body: 'We\'ve added 12 new guided meditations from Gabriel Loynaz and Ariya Lorenz. Explore the Sound Healing section now.', time: '1d ago', thumb: null },
  { id: 'n4', title: 'Community Milestone 🎉', body: 'Mindvalley just crossed 10 million members worldwide! Thank you for being part of this extraordinary journey.', time: '2d ago', thumb: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80' },
  { id: 'n5', title: 'Limited Time: Unlock All Programs', body: 'For the next 48 hours, get full access to every Mindvalley program. Upgrade to All Access and transform every area of your life.', time: '3d ago', thumb: null },
  { id: 'n6', title: 'New Feature: Eve AI Goal Setting', body: 'Eve can now help you set and track 90-day goals based on your program progress. Try it now from the Eve AI tab.', time: '4d ago', thumb: null },
];

const MV_LOGO_BG = '#1a0533';

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'Activities' | 'Announcements'>('Activities');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="checkmark-done-outline" size={22} color={colors.teal} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['Activities', 'Announcements'] as const).map(tab => (
          <TouchableOpacity key={tab} style={styles.tabItem} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Activities */}
      {activeTab === 'Activities' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {ACTIVITIES.map(item => (
            <TouchableOpacity key={item.id} style={styles.row} activeOpacity={0.75}>
              {/* Avatar or icon */}
              {'avatar' in item ? (
                <Image source={item.avatar as any} style={styles.avatar} />
              ) : (
                <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
                  <Ionicons name={item.icon as any} size={20} color="#fff" />
                </View>
              )}
              {/* Text */}
              <View style={styles.rowBody}>
                <Text style={styles.rowText}>{item.text}</Text>
                <Text style={styles.rowTime}>{item.time}</Text>
              </View>
              {/* Thumb if present */}
              {item.hasThumb && item.thumb && (
                <Image source={{ uri: item.thumb }} style={styles.rowThumb} />
              )}
            </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}

      {/* Announcements */}
      {activeTab === 'Announcements' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {ANNOUNCEMENTS.map(item => (
            <TouchableOpacity key={item.id} style={styles.announcementRow} activeOpacity={0.75}>
              <View style={styles.announcementTop}>
                {/* MV logo */}
                <View style={[styles.iconCircle, { backgroundColor: MV_LOGO_BG }]}>
                  <Text style={styles.mvLogo}>M</Text>
                </View>
                <View style={styles.announcementBody}>
                  <Text style={styles.announcementTitle}>{item.title}</Text>
                  <Text style={styles.announcementText} numberOfLines={2}>{item.body}</Text>
                  <Text style={styles.rowTime}>{item.time}</Text>
                </View>
              </View>
              {item.thumb && (
                <Image source={{ uri: item.thumb }} style={styles.announcementThumb} />
              )}
            </TouchableOpacity>
          ))}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  tabBar: {
    flexDirection: 'row', paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tabItem: { marginRight: 24, paddingBottom: 12, paddingTop: 12, position: 'relative' },
  tabText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: '#fff' },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: '#fff', borderRadius: 1,
  },
  row: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingVertical: 14, gap: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.backgroundCard },
  iconCircle: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  rowText: { fontSize: 14, color: '#fff', lineHeight: 20, marginBottom: 4 },
  rowTime: { fontSize: 12, color: colors.textMuted },
  rowThumb: { width: 52, height: 52, borderRadius: 8, backgroundColor: colors.backgroundCard },

  announcementRow: {
    paddingHorizontal: 20, paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  announcementTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 10 },
  announcementBody: { flex: 1 },
  announcementTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 4 },
  announcementText: { fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: 4 },
  announcementThumb: {
    width: '100%', height: 160, borderRadius: 12,
    backgroundColor: colors.backgroundCard,
  },
  mvLogo: { fontSize: 20, fontWeight: '900', color: '#fff' },
});
