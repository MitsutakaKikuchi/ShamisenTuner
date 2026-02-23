/**
 * アプリヘッダーコンポーネント
 * タイトル「三味線 調弦」と設定アイコン
 * 和柄の装飾パターンを上部に配置
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

type HeaderProps = {
  onSettingsPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onSettingsPress }) => {
  return (
    <LinearGradient
      colors={['#2a1508', '#210e04', '#1a0a02']}
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

      {/* 装飾ライン（上） */}
      <View style={styles.decorativeLine} />
      
      <View style={styles.content}>
        <Text style={styles.title}>三味線 調弦</Text>
        {onSettingsPress && (
          <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
            <Text style={styles.settingsText}>⚙</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* 装飾ライン（下） */}
      <View style={styles.decorativeLine} />
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
  decorativeLine: {
    height: 1.5,
    backgroundColor: COLORS.borderGold,
    marginHorizontal: SPACING.xl,
    opacity: 0.5,
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
