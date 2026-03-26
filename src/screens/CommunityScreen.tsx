import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, ImageBackground, Dimensions, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');
const TABS = ['Networks', 'Live', 'People'];

// ─── Mock data ────────────────────────────────────────────────────────────

const MASTERY_NETWORKS = [
  {
    id: 'mn1', title: 'AI MASTERY', level: 'ADVANCED',
    desc: 'Mindvalley Book Club with Melinda Wenner Moyer',
    members: 2847, joined: false,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    gradient: ['#0D0221', '#1a0533', '#2d0b6b'],
  },
  {
    id: 'mn2', title: 'MINDFULNESS MASTERY', level: 'INTERMEDIATE',
    desc: 'Weekly live sessions with Jeffrey Allen',
    members: 4120, joined: true,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    gradient: ['#021D0A', '#053314', '#0a5c22'],
  },
  {
    id: 'mn3', title: 'PEAK PERFORMANCE', level: 'ADVANCED',
    desc: 'Elite circle for high achievers and entrepreneurs',
    members: 1560, joined: false,
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    gradient: ['#1a0800', '#3d1000', '#6b1d00'],
  },
];

const YOUR_NETWORKS = [
  { id: 'yn1', name: 'Silva Method', image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=200&q=80' },
  { id: 'yn2', name: 'Fitness Circle', image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&q=80' },
  { id: 'yn3', name: 'Mindfulness', image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=200&q=80' },
  { id: 'yn4', name: 'Writers Hub', image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=200&q=80' },
  { id: 'yn5', name: 'AI Builders', image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=200&q=80' },
];

const HIGHLIGHTED_EVENT = {
  id: 'ev0', title: 'Mindvalley AI Summit',
  category: 'Free Live Event', dateLabel: 'Mar 20',
  timeLabel: '11:00pm – 5:00am',
  date: 'March 20–22, 2026',
  author: 'Mindvalley', virtual: true,
  attending: 1154,
  image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
  cardLabel: 'AI SUMMIT',
  attendeeAvatars: [
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
  ],
};

const TODAY_EVENTS = [
  {
    id: 'ev1', title: 'Spiritual Mastery Live Session',
    category: 'Spiritual Mastery', dateLabel: 'Today',
    timeLabel: '8:00pm – 9:30pm',
    author: 'Jeffrey Allen', virtual: true, attending: 312,
    image: 'https://images.unsplash.com/photo-1490750967868-88df5691cc96?w=800&q=80',
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&q=80',
    ],
  },
];

const WEEK_EVENTS = [
  {
    id: 'ev2', title: 'Unlocking New Revenue Streams with Innovation',
    category: 'Entrepreneurship Mastery', dateLabel: 'Mar 17',
    timeLabel: '10:00pm – 11:30pm',
    author: 'Vishen Lakhiani', virtual: true, attending: 38,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80',
    ],
  },
  {
    id: 'ev3', title: 'Community Builders: Growing a Tribe That Thrives',
    category: 'Community Mastery', dateLabel: 'Mar 18',
    timeLabel: '9:00pm – 10:00pm',
    author: 'Mindvalley Coaches', virtual: true, attending: 39,
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&q=80',
    ],
  },
  {
    id: 'ev4', title: 'Deep Dive: The Science of Manifestation',
    category: 'Mindvalley U',  dateLabel: 'Mar 19',
    timeLabel: '7:00pm – 8:30pm',
    author: 'Vishen Lakhiani', virtual: true, attending: 215,
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80',
    attendeeAvatars: [
      'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&q=80',
    ],
  },
];

// ─── Shared event card component ──────────────────────────────────────────

interface Event {
  id: string; title: string; category: string;
  dateLabel: string; timeLabel: string; author: string;
  virtual: boolean; attending: number; image: string;
  attendeeAvatars: string[];
  cardLabel?: string;
}

const EventCard = ({ event, highlighted = false }: { event: Event; highlighted?: boolean }) => {
  const [rsvped, setRsvped] = useState(false);
  return (
    <View style={[evStyles.card, highlighted && evStyles.cardHighlighted]}>
      <View style={evStyles.imageWrap}>
        <Image source={{ uri: event.image }} style={evStyles.image} />
        {event.cardLabel && (
          <View style={evStyles.cardLabelWrap}>
            <Text style={evStyles.cardLabelText}>{event.cardLabel}</Text>
          </View>
        )}
        <View style={evStyles.categoryTag}>
          <Text style={evStyles.categoryText}>{event.category}</Text>
        </View>
      </View>
      <View style={evStyles.body}>
        <View style={evStyles.pillsRow}>
          <View style={evStyles.pill}><Text style={evStyles.pillText}>{event.dateLabel}</Text></View>
          <View style={evStyles.pill}><Text style={evStyles.pillText}>{event.timeLabel}</Text></View>
        </View>
        <Text style={evStyles.title}>{event.title}</Text>
        <Text style={evStyles.author}>{event.author}</Text>
        <View style={evStyles.footer}>
          <View style={evStyles.footerLeft}>
            <Ionicons name="videocam-outline" size={14} color={colors.textMuted} />
            <Text style={evStyles.virtualText}> Virtual call</Text>
            <View style={evStyles.avatarRow}>
              {event.attendeeAvatars.slice(0, 3).map((a, i) => (
                <Image key={i} source={{ uri: a }} style={[evStyles.attendeeAvatar, { marginLeft: i > 0 ? -8 : 12 }]} />
              ))}
            </View>
            <Text style={evStyles.attendingText}>
              {event.attending.toLocaleString()} attending
            </Text>
          </View>
          <TouchableOpacity
            style={[evStyles.rsvpBtn, rsvped && evStyles.rsvpBtnActive]}
            onPress={() => setRsvped(!rsvped)}
          >
            <Text style={[evStyles.rsvpText, rsvped && evStyles.rsvpTextActive]}>
              {rsvped ? '✓ Going' : 'RSVP'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const evStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 16, overflow: 'hidden',
    marginBottom: 20, borderWidth: 1, borderColor: colors.border,
  },
  cardHighlighted: { marginHorizontal: 16 },
  imageWrap: { position: 'relative' },
  image: { width: '100%', height: 200 },
  cardLabelWrap: {
    position: 'absolute', top: '30%', left: 0, right: 0,
    alignItems: 'center',
  },
  cardLabelText: { fontSize: 36, fontWeight: '900', color: '#fff', letterSpacing: 4 },
  categoryTag: {
    position: 'absolute', top: 12, left: 12,
    backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  categoryText: { fontSize: 11, color: '#fff', fontWeight: '700' },
  body: { padding: 14 },
  pillsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  pill: {
    backgroundColor: colors.backgroundElevated, borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  pillText: { fontSize: 12, color: '#fff', fontWeight: '600' },
  title: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4, lineHeight: 22 },
  author: { fontSize: 13, color: colors.textSecondary, marginBottom: 12 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  footerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  virtualText: { fontSize: 12, color: colors.textMuted },
  avatarRow: { flexDirection: 'row', alignItems: 'center' },
  attendeeAvatar: { width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: colors.background },
  attendingText: { fontSize: 12, color: colors.textMuted, marginLeft: 6 },
  rsvpBtn: {
    backgroundColor: '#fff', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 8,
  },
  rsvpBtnActive: { backgroundColor: '#7C5CFC' },
  rsvpText: { fontSize: 13, fontWeight: '700', color: '#000' },
  rsvpTextActive: { color: '#fff' },
});

// ─── Networks tab ─────────────────────────────────────────────────────────

const NetworksTab = () => {
  const [page, setPage] = useState(0);
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {/* Mastery networks carousel */}
      <View style={netStyles.section}>
        <Text style={netStyles.sectionTitle}>Mastery networks</Text>
        <ScrollView
          horizontal pagingEnabled showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => setPage(Math.round(e.nativeEvent.contentOffset.x / (width - 32)))}
        >
          {MASTERY_NETWORKS.map(n => (
            <TouchableOpacity key={n.id} style={netStyles.masteryCard} activeOpacity={0.9}>
              <ImageBackground source={{ uri: n.image }} style={netStyles.masteryBg} imageStyle={netStyles.masteryBgImg}>
                <View style={netStyles.masteryOverlay} />
                <View style={netStyles.masteryBadge}>
                  <Text style={netStyles.masteryBadgeText}>{n.level}</Text>
                </View>
                <Text style={netStyles.masteryTitle}>{n.title}</Text>
                <Text style={netStyles.masteryDesc}>{n.desc}</Text>
                <View style={netStyles.masteryFooter}>
                  <View style={netStyles.masteryMembers}>
                    <Ionicons name="people-outline" size={14} color="rgba(255,255,255,0.7)" />
                    <Text style={netStyles.masteryMembersText}> {n.members.toLocaleString()} members</Text>
                  </View>
                  <TouchableOpacity style={[netStyles.joinBtn, n.joined && netStyles.joinBtnActive]}>
                    <Text style={[netStyles.joinText, n.joined && netStyles.joinTextActive]}>
                      {n.joined ? '✓ Joined' : 'Join'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Page dots */}
        <View style={netStyles.dots}>
          {MASTERY_NETWORKS.map((_, i) => (
            <View key={i} style={[netStyles.dot, i === page && netStyles.dotActive]} />
          ))}
        </View>
      </View>

      {/* Your networks */}
      <View style={netStyles.section}>
        <View style={netStyles.rowHeader}>
          <Text style={netStyles.sectionTitle}>Your networks</Text>
          <TouchableOpacity><Text style={netStyles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={netStyles.hScroll}>
          {YOUR_NETWORKS.map(n => (
            <TouchableOpacity key={n.id} style={netStyles.networkItem} activeOpacity={0.85}>
              <Image source={{ uri: n.image }} style={netStyles.networkAvatar} />
              <Text style={netStyles.networkName} numberOfLines={1}>{n.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Discover more */}
      <View style={netStyles.section}>
        <View style={netStyles.rowHeader}>
          <Text style={netStyles.sectionTitle}>Discover networks</Text>
          <TouchableOpacity><Text style={netStyles.seeAll}>See all</Text></TouchableOpacity>
        </View>
        {[
          { id: 'd1', name: 'Superbrain Alumni', members: 12430, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&q=80' },
          { id: 'd2', name: 'Duality Practitioners', members: 8770, image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=200&q=80' },
          { id: 'd3', name: 'Be Extraordinary Circle', members: 6540, image: 'https://images.unsplash.com/photo-1455849318743-b2233052fcff?w=200&q=80' },
        ].map(n => (
          <TouchableOpacity key={n.id} style={netStyles.discoverRow} activeOpacity={0.8}>
            <Image source={{ uri: n.image }} style={netStyles.discoverAvatar} />
            <View style={netStyles.discoverInfo}>
              <Text style={netStyles.discoverName}>{n.name}</Text>
              <View style={netStyles.discoverMeta}>
                <Ionicons name="people-outline" size={12} color={colors.textMuted} />
                <Text style={netStyles.discoverMembers}> {n.members.toLocaleString()} members</Text>
              </View>
            </View>
            <TouchableOpacity style={netStyles.joinBtnSmall}>
              <Text style={netStyles.joinTextSmall}>Join</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const netStyles = StyleSheet.create({
  section: { marginBottom: 32 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', paddingHorizontal: 20, marginBottom: 14 },
  seeAll: { fontSize: 14, color: colors.teal },
  hScroll: { paddingHorizontal: 20 },

  // Mastery card
  masteryCard: { width: width - 32, marginHorizontal: 16, height: 200, borderRadius: 16, overflow: 'hidden' },
  masteryBg: { flex: 1, justifyContent: 'flex-end', padding: 20 },
  masteryBgImg: { borderRadius: 16 },
  masteryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: 16 },
  masteryBadge: {
    position: 'absolute', top: 16, right: 16,
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  masteryBadgeText: { fontSize: 10, fontWeight: '800', color: '#fff', letterSpacing: 1 },
  masteryTitle: { fontSize: 24, fontWeight: '900', color: '#fff', marginBottom: 4, letterSpacing: 1 },
  masteryDesc: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 14, lineHeight: 18 },
  masteryFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  masteryMembers: { flexDirection: 'row', alignItems: 'center' },
  masteryMembersText: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  joinBtn: { backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  joinBtnActive: { backgroundColor: '#7C5CFC' },
  joinText: { fontSize: 13, fontWeight: '700', color: '#000' },
  joinTextActive: { color: '#fff' },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.border },
  dotActive: { backgroundColor: '#fff', width: 18 },

  // Your networks
  networkItem: { width: 72, alignItems: 'center', marginRight: 16 },
  networkAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.backgroundCard, marginBottom: 6 },
  networkName: { fontSize: 11, color: colors.textSecondary, textAlign: 'center' },

  // Discover
  discoverRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  discoverAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.backgroundCard },
  discoverInfo: { flex: 1 },
  discoverName: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3 },
  discoverMeta: { flexDirection: 'row', alignItems: 'center' },
  discoverMembers: { fontSize: 12, color: colors.textMuted },
  joinBtnSmall: { backgroundColor: colors.backgroundElevated, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  joinTextSmall: { fontSize: 13, fontWeight: '600', color: '#fff' },
});

// ─── Live tab ─────────────────────────────────────────────────────────────

const LiveTab = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}>
    {/* Highlighted */}
    <Text style={liveStyles.sectionTitle}>Highlighted</Text>
    <EventCard event={HIGHLIGHTED_EVENT} highlighted />

    {/* Happening Today */}
    <View style={liveStyles.sectionHeader}>
      <Text style={liveStyles.sectionTitle}>Happening today</Text>
      <TouchableOpacity><Text style={liveStyles.seeAll}>See all</Text></TouchableOpacity>
    </View>
    <View style={{ paddingHorizontal: 16 }}>
      {TODAY_EVENTS.map(e => <EventCard key={e.id} event={e} />)}
    </View>

    {/* This Week */}
    <View style={liveStyles.sectionHeader}>
      <Text style={liveStyles.sectionTitle}>This week</Text>
      <TouchableOpacity><Text style={liveStyles.seeAll}>See all</Text></TouchableOpacity>
    </View>
    <View style={{ paddingHorizontal: 16 }}>
      {WEEK_EVENTS.map(e => <EventCard key={e.id} event={e} />)}
    </View>
  </ScrollView>
);

const liveStyles = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff', paddingHorizontal: 20, marginBottom: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 14, marginTop: 8 },
  seeAll: { fontSize: 14, color: colors.teal },
});

// ─── People tab ───────────────────────────────────────────────────────────

const PeopleTab = () => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
    {/* Introduction card */}
    <TouchableOpacity activeOpacity={0.9} style={peopleStyles.introCard}>
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80' }}
        style={peopleStyles.introBg}
        imageStyle={peopleStyles.introBgImg}
      >
        <View style={peopleStyles.introOverlay} />
        <View style={peopleStyles.introContent}>
          <Text style={peopleStyles.introTitle}>Get introduced to people you'll click with</Text>
          <Text style={peopleStyles.introSubtitle}>
            All you'll need is a profile picture and short bio about yourself
          </Text>
          <TouchableOpacity style={peopleStyles.introBtn}>
            <Text style={peopleStyles.introBtnText}>See introductions</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </TouchableOpacity>

    {/* Suggested connections */}
    <View style={peopleStyles.suggestedHeader}>
      <Text style={peopleStyles.suggestedTitle}>People you may know</Text>
      <TouchableOpacity><Text style={peopleStyles.seeAll}>See all</Text></TouchableOpacity>
    </View>
    {[
      { id: 'p1', name: 'Amelia Tan', location: 'Kuala Lumpur, MY', programs: 12, avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80' },
      { id: 'p2', name: 'James Ong', location: 'Singapore', programs: 8, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80' },
      { id: 'p3', name: 'Priya Krishnan', location: 'Petaling Jaya, MY', programs: 15, avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80' },
    ].map(p => (
      <View key={p.id} style={peopleStyles.personRow}>
        <Image source={{ uri: p.avatar }} style={peopleStyles.personAvatar} />
        <View style={peopleStyles.personInfo}>
          <Text style={peopleStyles.personName}>{p.name}</Text>
          <Text style={peopleStyles.personMeta}>{p.location} · {p.programs} programs</Text>
        </View>
        <TouchableOpacity style={peopleStyles.connectBtn}>
          <Text style={peopleStyles.connectText}>Connect</Text>
        </TouchableOpacity>
      </View>
    ))}
  </ScrollView>
);

const peopleStyles = StyleSheet.create({
  introCard: { borderRadius: 20, overflow: 'hidden', marginBottom: 32 },
  introBg: { height: 360 },
  introBgImg: { borderRadius: 20 },
  introOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(20,0,40,0.55)', borderRadius: 20 },
  introContent: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', padding: 28, paddingBottom: 36 },
  introTitle: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 33, marginBottom: 12 },
  introSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 21, marginBottom: 24 },
  introBtn: { backgroundColor: '#fff', borderRadius: 30, paddingVertical: 16, paddingHorizontal: 32 },
  introBtnText: { fontSize: 15, fontWeight: '700', color: '#000' },
  suggestedHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  suggestedTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  seeAll: { fontSize: 14, color: colors.teal },
  personRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
  personAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.backgroundCard },
  personInfo: { flex: 1 },
  personName: { fontSize: 15, fontWeight: '700', color: '#fff', marginBottom: 3 },
  personMeta: { fontSize: 12, color: colors.textSecondary },
  connectBtn: { backgroundColor: colors.backgroundElevated, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  connectText: { fontSize: 13, fontWeight: '600', color: '#fff' },
});

// ─── Main screen ──────────────────────────────────────────────────────────

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState('Networks');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            {activeTab === tab && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'Networks' && <NetworksTab />}
      {activeTab === 'Live'     && <LiveTab />}
      {activeTab === 'People'   && <PeopleTab />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  tabBar: {
    flexDirection: 'row', paddingHorizontal: 20,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  tabItem: { marginRight: 24, paddingBottom: 12, paddingTop: 4, position: 'relative' },
  tabText: { fontSize: 16, fontWeight: '500', color: colors.textMuted },
  tabTextActive: { color: '#fff', fontWeight: '700' },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: '#fff', borderRadius: 1,
  },
});
