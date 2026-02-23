/**
 * 純正律調弦の表示フッター
 * 金色の装飾ラインと「純正律調弦」表記
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line as SvgLine, Defs, LinearGradient as SvgLinGrad, Stop } from 'react-native-svg';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

export const Footer: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* 金色グラデーション装飾ライン（SVG） */}
      <Svg width="100%" height={3} style={styles.goldLine}>
        <Defs>
          <SvgLinGrad id="footerGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#D4A820" stopOpacity={0} />
            <Stop offset="15%" stopColor="#F0CC50" stopOpacity={0.6} />
            <Stop offset="50%" stopColor="#FFF0A0" stopOpacity={0.9} />
            <Stop offset="85%" stopColor="#F0CC50" stopOpacity={0.6} />
            <Stop offset="100%" stopColor="#D4A820" stopOpacity={0} />
          </SvgLinGrad>
        </Defs>
        <SvgLine x1="0" y1="1.5" x2="100%" y2="1.5" stroke="url(#footerGold)" strokeWidth={2} />
      </Svg>
      <View style={styles.decorativeContainer}>
        <View style={styles.decorativeLine} />
        <Text style={styles.decorativeSymbol}>◆</Text>
        <View style={styles.decorativeLine} />
      </View>
      <Text style={styles.text}>純正律調弦</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  goldLine: {
    marginBottom: SPACING.md,
  },
  decorativeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xxxl,
    gap: SPACING.sm,
  },
  decorativeLine: {
    height: 1,
    backgroundColor: COLORS.borderGold,
    flex: 1,
    opacity: 0.3,
  },
  decorativeSymbol: {
    fontSize: 8,
    color: COLORS.gold,
    opacity: 0.4,
  },
  text: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    letterSpacing: 4,
    fontFamily: 'ZenOldMincho_400Regular',
  },
});
