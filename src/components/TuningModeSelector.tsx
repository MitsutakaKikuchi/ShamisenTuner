/**
 * 調弦モード選択コンポーネント
 * 本調子・二上り・三下り をタブ形式で選択
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import type { TuningMode } from '../constants/tuningData';

type TuningModeSelectorProps = {
  modes: TuningMode[];
  selectedModeId: string;
  onModeChange: (modeId: string) => void;
};

export const TuningModeSelector: React.FC<TuningModeSelectorProps> = ({
  modes,
  selectedModeId,
  onModeChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabGroup}>
        {modes.map((mode) => {
          const isSelected = mode.id === selectedModeId;
          return (
            <TouchableOpacity
              key={mode.id}
              style={[styles.tab, isSelected && styles.tabActive]}
              onPress={() => onModeChange(mode.id)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  tabGroup: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundLight,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderGold,
  },
  tabActive: {
    backgroundColor: COLORS.surfaceHighlight,
  },
  tabText: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.textWhite,
    fontWeight: 'bold',
  },
});
