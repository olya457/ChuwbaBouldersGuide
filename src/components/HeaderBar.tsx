import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSizes, IS_SMALL_SCREEN } from '../theme/theme';

interface Props {
  kicker: string;
  title: string;
  right?: React.ReactNode;
}

const HeaderBar: React.FC<Props> = ({ kicker, title, right }) => {
  return (
    <View style={styles.wrap}>
      <View style={styles.mark}>
        <View style={styles.markRing}>
          <Text style={styles.markText}>◈</Text>
        </View>
      </View>
      <View style={styles.center}>
        <Text style={styles.kicker}>{kicker}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {right ? <View style={styles.right}>{right}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: IS_SMALL_SCREEN ? 8 : 12,
  },
  mark: { marginRight: 10 },
  markRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: colors.mustard,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.chipBgMustard,
  },
  markText: { color: colors.mustard, fontSize: 18, fontWeight: '900' },
  center: { flex: 1 },
  kicker: { color: colors.terracotta, fontSize: fontSizes.xs, fontWeight: '900', letterSpacing: 2 },
  title: {
    color: colors.text,
    fontSize: IS_SMALL_SCREEN ? fontSizes.xl : fontSizes.xxl,
    fontWeight: '900',
    marginTop: 2,
  },
  right: { marginLeft: 8 },
});

export default HeaderBar;