import React, { useRef } from 'react';
import { Animated, Image, Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import ScreenFrame from '../../components/ScreenFrame';
import GlassPanel from '../../components/GlassPanel';
import { journalData } from '../../data/blog';
import { RootStackParamList } from '../../types';
import { colors, fontSizes, IS_SMALL_SCREEN, radius, spacing } from '../../theme/theme';
import { useFadeIn, useFadeInScale } from '../../hooks/useFadeIn';
import { useAppInsets } from '../../hooks/useInsets';

type Props = NativeStackScreenProps<RootStackParamList, 'JournalEntry'>;

const JournalEntryScreen: React.FC<Props> = ({ route, navigation }) => {
  const insets = useAppInsets();
  const post = journalData.find(p => p.id === route.params.postId);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerAnim = useFadeIn(0, 420);
  const titleAnim = useFadeIn(120, 440);
  const quoteAnim = useFadeInScale(240, 480);
  const bodyAnim = useFadeIn(360, 440);

  if (!post) {
    return (
      <ScreenFrame>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>Story not found</Text>
        </View>
      </ScreenFrame>
    );
  }

  const onShare = () => Share.share({ message: `${post.title} — ${post.intro}` });

  const COVER_HEIGHT = IS_SMALL_SCREEN ? 280 : 340;

  const coverScale = scrollY.interpolate({
    inputRange: [-120, 0, 120],
    outputRange: [1.15, 1, 0.95],
    extrapolate: 'clamp',
  });

  return (
    <ScreenFrame contentPaddingTop={false}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <Animated.View
          style={[
            styles.cover,
            { height: COVER_HEIGHT },
            { opacity: headerAnim.opacity },
          ]}
        >
          <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ scale: coverScale }] }]}>
            <Image source={post.cover} style={StyleSheet.absoluteFillObject} />
          </Animated.View>
          <LinearGradient
            colors={['rgba(14,16,32,0.55)', 'rgba(14,16,32,0.1)', 'rgba(14,16,32,0.95)']}
            style={StyleSheet.absoluteFill}
          />

          <View style={[styles.coverTop, { paddingTop: insets.top + 8 }]}>
            <Pressable onPress={() => navigation.goBack()} style={styles.roundBtn}>
              <Text style={styles.roundIcon}>←</Text>
            </Pressable>
            <Pressable onPress={onShare} style={styles.roundBtn}>
              <Text style={styles.roundIcon}>↗</Text>
            </Pressable>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.titleBlock,
            { opacity: titleAnim.opacity, transform: [{ translateY: titleAnim.translateY }] },
          ]}
        >
          <View style={styles.tag}>
            <Text style={styles.tagText}>◈ {post.tag.toUpperCase()}</Text>
          </View>
          <Text style={styles.title}>{post.title}</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>✎</Text>
              <Text style={styles.metaText}>{post.author}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Text style={styles.metaIcon}>◇</Text>
              <Text style={styles.metaText}>{post.readTime}</Text>
            </View>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{post.date}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View
          style={[
            styles.quoteWrap,
            { opacity: quoteAnim.opacity, transform: [{ scale: quoteAnim.scale }] },
          ]}
        >
          <GlassPanel variant="accent" style={styles.quoteCard}>
            <Text style={styles.quoteMark}>"</Text>
            <Text style={styles.quoteText}>{post.intro}</Text>
            <View style={styles.quoteFooter}>
              <View style={styles.quoteLine} />
              <Text style={styles.quoteAuthor}>ALEX</Text>
              <View style={styles.quoteLine} />
            </View>
          </GlassPanel>
        </Animated.View>

        <Animated.View
          style={[
            styles.bodyWrap,
            { opacity: bodyAnim.opacity, transform: [{ translateY: bodyAnim.translateY }] },
          ]}
        >
          {post.body.map((paragraph, i) => (
            <View key={i} style={styles.paragraphBlock}>
              <View style={styles.paragraphSide}>
                <View style={styles.paragraphNumBox}>
                  <Text style={styles.paragraphNum}>{String(i + 1).padStart(2, '0')}</Text>
                </View>
                <View style={styles.paragraphLine} />
              </View>
              <Text style={styles.paragraph}>{paragraph}</Text>
            </View>
          ))}

          <View style={styles.endmarker}>
            <View style={styles.endLine} />
            <Text style={styles.endText}>✦ END OF ENTRY ✦</Text>
            <View style={styles.endLine} />
          </View>

          <Pressable style={styles.shareBtn} onPress={onShare}>
            <Text style={styles.shareIcon}>↗</Text>
            <Text style={styles.shareText}>Share this story</Text>
          </Pressable>
        </Animated.View>
      </Animated.ScrollView>
    </ScreenFrame>
  );
};

const styles = StyleSheet.create({
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { color: colors.textMuted, fontSize: fontSizes.lg },
  cover: { overflow: 'hidden' },
  coverTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingBottom: 10,
  },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(14,16,32,0.75)',
    borderWidth: 1,
    borderColor: colors.borderSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundIcon: { color: colors.text, fontSize: 18, fontWeight: '900' },
  titleBlock: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.chipBgMustard,
    borderWidth: 1,
    borderColor: colors.mustard,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 12,
  },
  tagText: { color: colors.mustard, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  title: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.lg + 4 : fontSizes.xl + 2,
    fontWeight: '900',
    lineHeight: (IS_SMALL_SCREEN ? fontSizes.lg + 4 : fontSizes.xl + 2) * 1.2,
    marginBottom: 12,
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaIcon: { color: colors.terracotta, fontSize: 12, marginRight: 4, fontWeight: '900' },
  metaText: { color: colors.textMuted, fontSize: fontSizes.xs, fontWeight: '700' },
  metaDot: { width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textDim, marginHorizontal: 8 },
  quoteWrap: {
    paddingHorizontal: spacing.xl,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  quoteCard: { padding: 20, alignItems: 'center' },
  quoteMark: {
    color: colors.terracotta,
    fontSize: 48,
    fontWeight: '900',
    lineHeight: 48,
    marginBottom: 4,
  },
  quoteText: {
    color: colors.text,
    fontSize: fontSizes.md,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: fontSizes.md * 1.6,
  },
  quoteFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  quoteLine: { width: 30, height: 1, backgroundColor: colors.mustard },
  quoteAuthor: { color: colors.mustard, fontSize: 10, fontWeight: '900', letterSpacing: 3, marginHorizontal: 10 },
  bodyWrap: { paddingHorizontal: spacing.xl },
  paragraphBlock: { flexDirection: 'row', marginBottom: spacing.lg },
  paragraphSide: {
    width: 42,
    alignItems: 'center',
    paddingTop: 2,
  },
  paragraphNumBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.mustard,
    backgroundColor: colors.chipBgMustard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paragraphNum: {
    color: colors.mustard,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  paragraphLine: {
    width: 1,
    flex: 1,
    backgroundColor: colors.borderSoft,
    marginTop: 6,
  },
  paragraph: {
    flex: 1,
    color: colors.textMuted,
    fontSize: fontSizes.md,
    lineHeight: fontSizes.md * 1.65,
    paddingTop: 2,
  },
  endmarker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.lg,
  },
  endLine: { width: 30, height: 1, backgroundColor: colors.borderSoft },
  endText: {
    color: colors.mustard,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginHorizontal: 12,
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.terracotta,
    paddingVertical: 14,
    backgroundColor: colors.chipBg,
  },
  shareIcon: { color: colors.terracotta, fontSize: 16, marginRight: 8, fontWeight: '900' },
  shareText: { color: colors.terracotta, fontSize: fontSizes.md, fontWeight: '800', letterSpacing: 0.5 },
});

export default JournalEntryScreen;