/**
 * 自動再生（アルペジオ）トグルコンポーネント
 */

import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

type AutoPlayToggleProps = {
  isAutoPlaying: boolean;
  onToggle: () => void;
};

export const AutoPlayToggle: React.FC<AutoPlayToggleProps> = ({
  isAutoPlaying,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>自動再生（アルペジオ）</Text>
      <View style={styles.switchRow}>
        <Text style={[styles.stateText, isAutoPlaying && styles.stateTextActive]}>
          {isAutoPlaying ? 'ON' : 'OFF'}
        </Text>
        <Switch
          value={isAutoPlaying}
          onValueChange={onToggle}
          trackColor={{ false: COLORS.switchOff, true: COLORS.switchOn }}
          thumbColor={isAutoPlaying ? COLORS.goldBright : COLORS.borderLight}
          ios_backgroundColor={COLORS.switchOff}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  stateText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontWeight: 'bold',
  },
  stateTextActive: {
    color: COLORS.switchOn,
  },
});
