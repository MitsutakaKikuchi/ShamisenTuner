/**
 * 純正律調弦の表示フッター
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

export const Footer: React.FC = () => {
  return (
    <View style={styles.container}>
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
    fontFamily: 'serif',
  },
});
