/**
 * 純正律調弦の表示フッター
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

export const Footer: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.decorativeLine} />
      <Text style={styles.text}>純正律調弦</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingBottom: SPACING.xxxl,
  },
  decorativeLine: {
    height: 1,
    backgroundColor: COLORS.borderGold,
    width: '60%',
    marginBottom: SPACING.sm,
    opacity: 0.5,
  },
  text: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    letterSpacing: 4,
  },
});
