import React, { useState } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, StyleSheet,
  SafeAreaView, StatusBar, Modal, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { questLessons } from '../data/mockData';

interface Props {
  navigation?: any;
  route?: any;
}

export default function QuestDetailScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<'Lesson' | 'Discussions'>('Lesson');
  const [showLessonList, setShowLessonList] = useState(false);

  // Use Silva Ultramind as default
  const quest = questLessons.silvaUltramind;
  const lesson = quest.currentLesson;

  const imgSrc = typeof lesson.videoThumbnail === 'string'
    ? { uri: lesson.videoThumbnail }
    : (lesson.videoThumbnail as any);
  const medImgSrc = typeof lesson.meditation.image === 'string'
    ? { uri: lesson.meditation.image }
    : (lesson.meditation.image as any);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{quest.programTitle}</Text>
        <TouchableOpacity onPress={() => setShowLessonList(true)} style={styles.listBtn}>
          <Ionicons name="list" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Video hero */}
        <View style={styles.videoContainer}>
          <Image source={imgSrc} style={styles.videoThumb} />
          <View style={styles.videoOverlay}>
            <TouchableOpacity style={styles.playBtn}>
              <Ionicons name="play" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.videoDuration}>{lesson.videoDuration}</Text>
          </View>
          <View style={styles.mvChevron}>
            <Ionicons name="chevron-down" size={16} color="rgba(255,255,255,0.6)" />
          </View>
        </View>

        {/* Lesson info */}
        <View style={styles.lessonInfo}>
          <View style={styles.lessonInfoTop}>
            <View style={styles.lessonInfoLeft}>
              <Text style={styles.lessonNumber}>LESSON {lesson.number}</Text>
              <Text style={styles.lessonTitle}>{lesson.title}</Text>
              <Text style={styles.lessonAuthor}>{lesson.author}</Text>
              <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            </View>
            <View style={styles.lessonActions}>
              <TouchableOpacity style={styles.actionIcon}>
                <Ionicons name="download-outline" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon}>
                <Ionicons name="bookmark-outline" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* AI Action pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
          {[
            { icon: 'chatbubble-outline', label: 'Ask Eve' },
            { icon: 'help-circle-outline', label: 'Quiz me' },
            { icon: 'document-text-outline', label: 'Summarize lesson' },
          ].map(p => (
            <TouchableOpacity key={p.label} style={styles.aiPill} activeOpacity={0.75}>
              <Ionicons name={p.icon as any} size={15} color="#fff" style={{ marginRight: 5 }} />
              <Text style={styles.aiPillText}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lesson / Discussions tabs */}
        <View style={styles.tabRow}>
          {(['Lesson', 'Discussions'] as const).map(t => (
            <TouchableOpacity key={t} style={styles.tab} onPress={() => setActiveTab(t)}>
              <Text style={[styles.tabText, activeTab === t && styles.tabTextActive]}>{t}</Text>
              {activeTab === t && <View style={styles.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'Lesson' ? (
          <View style={styles.lessonContent}>
            {/* Meditation card */}
            <TouchableOpacity style={styles.meditationCard} activeOpacity={0.85}>
              <View style={styles.meditationLeft}>
                <Ionicons name="musical-note" size={12} color={colors.textMuted} />
                <Text style={styles.meditationLabel}> MEDITATIONS · {lesson.meditation.duration}</Text>
              </View>
              <View style={styles.meditationBody}>
                <Image source={medImgSrc} style={styles.meditationThumb} />
                <View style={styles.meditationInfo}>
                  <Text style={styles.meditationTitle} numberOfLines={2}>{lesson.meditation.title}</Text>
                  <Text style={styles.meditationAuthor}>{lesson.meditation.author}</Text>
                </View>
                <TouchableOpacity style={styles.meditationPlay}>
                  <Ionicons name="play" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {/* Lesson body text */}
            {lesson.bodyText.split('\n\n').map((para, i) => {
              if (para.startsWith('**') && para.endsWith('**')) {
                return (
                  <Text key={i} style={styles.bodyBold}>
                    {para.slice(2, -2)}
                  </Text>
                );
              }
              if (para.match(/^\d\./)) {
                return (
                  <Text key={i} style={styles.bodyText}>{para}</Text>
                );
              }
              return <Text key={i} style={styles.bodyText}>{para}</Text>;
            })}
          </View>
        ) : (
          <View style={styles.discussionsEmpty}>
            <Ionicons name="chatbubbles-outline" size={40} color={colors.textMuted} />
            <Text style={styles.discussionsText}>No discussions yet. Be the first!</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Complete lesson sticky CTA */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.9}>
          <Text style={styles.ctaText}>Complete lesson</Text>
        </TouchableOpacity>
      </View>

      {/* Lesson list modal */}
      <Modal
        visible={showLessonList}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowLessonList(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{quest.programTitle}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {quest.weeks.map(week => (
              <View key={week.title}>
                <Text style={styles.weekTitle}>{week.title}</Text>
                {week.lessons.map(l => {
                  const lImgSrc = typeof l.image === 'string' ? { uri: l.image } : (l.image as any);
                  return (
                    <TouchableOpacity
                      key={l.number}
                      style={styles.lessonRow}
                      onPress={() => setShowLessonList(false)}
                      activeOpacity={0.75}
                    >
                      <View style={styles.lessonThumbWrap}>
                        <Image source={lImgSrc} style={styles.lessonThumb} />
                        {l.completed && (
                          <View style={styles.checkBadge}>
                            <Ionicons name="checkmark" size={12} color="#fff" />
                          </View>
                        )}
                      </View>
                      <View style={styles.lessonRowInfo}>
                        <Text style={styles.lessonRowNumber}>Lesson {l.number}</Text>
                        <Text style={styles.lessonRowTitle} numberOfLines={2}>{l.title}</Text>
                        <Text style={styles.lessonRowAuthor}>{l.author}</Text>
                        <Text style={styles.lessonRowDuration}>{l.duration}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { padding: 8 },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  listBtn: { padding: 8 },

  scroll: { flex: 1 },

  // Video
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
    backgroundColor: '#000',
  },
  videoThumb: { width: '100%', height: '100%' },
  videoOverlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoDuration: { fontSize: 14, fontWeight: '600', color: '#fff' },
  mvChevron: {
    position: 'absolute',
    bottom: 8,
    alignSelf: 'center',
    left: '50%',
  },

  // Lesson info
  lessonInfo: { padding: 16 },
  lessonInfoTop: { flexDirection: 'row', justifyContent: 'space-between' },
  lessonInfoLeft: { flex: 1, paddingRight: 12 },
  lessonNumber: { fontSize: 11, color: colors.textMuted, letterSpacing: 1, marginBottom: 6 },
  lessonTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 6, lineHeight: 26 },
  lessonAuthor: { fontSize: 14, color: colors.textSecondary, marginBottom: 2 },
  lessonDuration: { fontSize: 13, color: colors.textMuted },
  lessonActions: { flexDirection: 'row', gap: 4, paddingTop: 4 },
  actionIcon: { padding: 6 },

  // AI pills
  pillsRow: { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  aiPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 8,
  },
  aiPillText: { fontSize: 13, color: '#fff', fontWeight: '500' },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  tab: { marginRight: 24, paddingBottom: 10, position: 'relative' },
  tabText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: '#fff' },
  tabUnderline: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 2, backgroundColor: '#fff', borderRadius: 1,
  },

  // Lesson content
  lessonContent: { paddingHorizontal: 16 },
  meditationCard: {
    backgroundColor: colors.backgroundElevated,
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
  },
  meditationLeft: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  meditationLabel: { fontSize: 11, color: colors.textMuted, letterSpacing: 0.5 },
  meditationBody: { flexDirection: 'row', alignItems: 'center' },
  meditationThumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: colors.backgroundCard, marginRight: 12 },
  meditationInfo: { flex: 1 },
  meditationTitle: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 3, lineHeight: 19 },
  meditationAuthor: { fontSize: 12, color: colors.textSecondary },
  meditationPlay: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.backgroundCard,
    alignItems: 'center', justifyContent: 'center',
  },

  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 14,
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    marginTop: 4,
  },

  discussionsEmpty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  discussionsText: { fontSize: 14, color: colors.textMuted },

  // CTA
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ctaButton: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#000' },

  // Modal
  modal: { flex: 1, backgroundColor: colors.background, paddingTop: 12 },
  modalHandle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: colors.border, alignSelf: 'center', marginBottom: 16,
  },
  modalTitle: {
    fontSize: 16, fontWeight: '700', color: '#fff',
    textAlign: 'center', marginBottom: 20, paddingHorizontal: 16,
  },
  weekTitle: {
    fontSize: 14, fontWeight: '700', color: '#fff',
    paddingHorizontal: 16, paddingVertical: 12,
    lineHeight: 20,
  },
  lessonRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-start',
    gap: 12,
  },
  lessonThumbWrap: { position: 'relative' },
  lessonThumb: { width: 72, height: 72, borderRadius: 8, backgroundColor: colors.backgroundCard },
  checkBadge: {
    position: 'absolute', bottom: 4, right: 4,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: colors.teal,
    alignItems: 'center', justifyContent: 'center',
  },
  lessonRowInfo: { flex: 1 },
  lessonRowNumber: { fontSize: 11, color: colors.textMuted, marginBottom: 3 },
  lessonRowTitle: { fontSize: 14, fontWeight: '700', color: '#fff', lineHeight: 19, marginBottom: 3 },
  lessonRowAuthor: { fontSize: 12, color: colors.textSecondary, marginBottom: 2 },
  lessonRowDuration: { fontSize: 12, color: colors.textMuted },
});
