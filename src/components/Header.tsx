/**
 * アプリヘッダーコンポーネント
 * タイトル「三味線 調弦」と設定アイコン
 * 和柄の装飾パターンを上部に配置
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

type HeaderProps = {
  onSettingsPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onSettingsPress }) => {
  return (
    <View style={styles.container}>
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
    </View>
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
    gap: 12,
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
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
