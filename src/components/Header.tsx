/**
 * アプリヘッダーコンポーネント
 * タイトル「三味線 調弦」と調子笛ボタンを表示
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

type HeaderProps = {
  onSettingsPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onSettingsPress }) => {
  return (
    <View style={styles.container}>
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
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.md,
  },
  decorativeLine: {
    height: 2,
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
