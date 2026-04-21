import React from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { JournalPost } from '../types';
import { colors, fontSizes, IS_SMALL_SCREEN, radius } from '../theme/theme';
import { useFadeIn } from '../hooks/useFadeIn';

interface Props {
  post: JournalPost;
  onPress: () => void;
  index?: number;
}

const JournalEntry: React.FC<Props> = ({ post, onPress, index = 0 }) => {
  const { opacity, translateY } = useFadeIn(index * 70, 440);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable style={styles.card} onPress={onPress}>
        <View style={styles.leftRail}>
          <Text style={styles.dateTop}>{post.date.split(' ')[0].slice(0, 3).toUpperCase()}</Text>
          <Text style={styles.dateNum}>{post.date.replace(',', '').split(' ')[1]}</Text>
          <View style={styles.railLine} />
          <Text style={styles.dateYear}>{post.date.split(' ')[2]}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.tagRow}>
            <Text style={styles.tagText}>◈ {post.tag.toUpperCase()}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.readTime}>{post.readTime}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{post.title}</Text>
          <Text style={styles.intro} numberOfLines={2}>{post.intro}</Text>
          <View style={styles.bottomRow}>
            <Image source={post.cover} style={styles.thumb} />
            <View style={styles.authorBox}>
              <Text style={styles.authorKicker}>WRITTEN BY</Text>
              <Text style={styles.authorName}>{post.author}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    padding: 12,
    marginBottom: 12,
  },
  leftRail: {
    width: 56,
    alignItems: 'center',
    marginRight: 12,
    paddingTop: 4,
  },
  dateTop: { color: colors.terracotta, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 2 },
  dateNum: { color: colors.text, fontSize: IS_SMALL_SCREEN ? 22 : 26, fontWeight: '900', marginTop: 2 },
  railLine: {
    width: 1,
    height: 20,
    backgroundColor: colors.borderSoft,
    marginVertical: 6,
  },
  dateYear: { color: colors.textDim, fontSize: fontSizes.xs, fontWeight: '700' },
  body: { flex: 1 },
  tagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  tagText: { color: colors.mustard, fontSize: fontSizes.xs, fontWeight: '800', letterSpacing: 1 },
  dot: { color: colors.textDim, marginHorizontal: 6 },
  readTime: { color: colors.textDim, fontSize: fontSizes.xs, fontWeight: '600' },
  title: { color: colors.text, fontSize: fontSizes.md, fontWeight: '800', lineHeight: fontSizes.md * 1.3 },
  intro: { color: colors.textMuted, fontSize: fontSizes.sm, fontStyle: 'italic', marginTop: 4, lineHeight: fontSizes.sm * 1.4 },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    marginRight: 10,
  },
  authorBox: { flex: 1 },
  authorKicker: { color: colors.textDim, fontSize: 9, fontWeight: '700', letterSpacing: 1.2 },
  authorName: { color: colors.text, fontSize: fontSizes.sm, fontWeight: '700', marginTop: 1 },
  arrow: { color: colors.terracotta, fontSize: 20, fontWeight: '900', marginLeft: 8 },
});

export default JournalEntry;