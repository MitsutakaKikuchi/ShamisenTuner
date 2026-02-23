/**
 * アプリヘッダーコンポーネント
 * タイトル「三味線 調弦」と設定アイコン
 * 和柄の装飾パターンを上部に配置
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line as SvgLine, Defs, LinearGradient as SvgLinGrad, Stop } from 'react-native-svg';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

type HeaderProps = {
  onSettingsPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onSettingsPress }) => {
  return (
    <LinearGradient
      colors={['rgba(74, 48, 24, 0.95)', 'rgba(58, 34, 16, 0.9)', 'rgba(40, 20, 8, 0.85)']}
      style={styles.container}
    >
      {/* 和柄パターン装飾エリア */}
      <View style={styles.patternArea}>
        <View style={styles.patternRow}>
          {Array.from({ length: 12 }).map((_, i) => (
            <View key={i} style={styles.patternDot} />
          ))}
        </View>
      </View>

      {/* 装飾ライン（上） - 金色グラデーション */}
      <Svg width="100%" height={2} style={styles.goldSvgLine}>
        <Defs>
          <SvgLinGrad id="headerGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#D4A820" stopOpacity={0} />
            <Stop offset="15%" stopColor="#F0CC50" stopOpacity={0.6} />
            <Stop offset="35%" stopColor="#FFF0A0" stopOpacity={0.9} />
            <Stop offset="50%" stopColor="#F0CC50" stopOpacity={1.0} />
            <Stop offset="65%" stopColor="#FFF0A0" stopOpacity={0.9} />
            <Stop offset="85%" stopColor="#F0CC50" stopOpacity={0.6} />
            <Stop offset="100%" stopColor="#D4A820" stopOpacity={0} />
          </SvgLinGrad>
        </Defs>
        <SvgLine x1="0" y1="1" x2="100%" y2="1" stroke="url(#headerGold)" strokeWidth={2} />
      </Svg>
      
      <View style={styles.content}>
        <Text style={styles.title}>三味線 調弦</Text>
        {onSettingsPress && (
          <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
            <Text style={styles.settingsText}>⚙</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* 装飾ライン（下） - 金色グラデーション */}
      <Svg width="100%" height={3} style={styles.goldSvgLine}>
        <Defs>
          <SvgLinGrad id="headerGoldBottom" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#D4A820" stopOpacity={0} />
            <Stop offset="15%" stopColor="#F0CC50" stopOpacity={0.6} />
            <Stop offset="35%" stopColor="#FFF0A0" stopOpacity={0.9} />
            <Stop offset="50%" stopColor="#F0CC50" stopOpacity={1.0} />
            <Stop offset="65%" stopColor="#FFF0A0" stopOpacity={0.9} />
            <Stop offset="85%" stopColor="#F0CC50" stopOpacity={0.6} />
            <Stop offset="100%" stopColor="#D4A820" stopOpacity={0} />
          </SvgLinGrad>
        </Defs>
        <SvgLine x1="0" y1="1.5" x2="100%" y2="1.5" stroke="url(#headerGoldBottom)" strokeWidth={3} />
      </Svg>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  patternArea: {
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    opacity: 0.2,
  },
  patternRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  patternDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.gold,
  },
  goldSvgLine: {
    marginHorizontal: 0,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.goldBright,
    letterSpacing: 8,
    fontFamily: 'serif',
    textShadowColor: 'rgba(198, 162, 101, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  settingsButton: {
    position: 'absolute',
    right: SPACING.xl,
    padding: SPACING.sm,
  },
  settingsText: {
    fontSize: FONT_SIZES.xxl,
    color: COLORS.gold,
  },
});
