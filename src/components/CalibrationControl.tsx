/**
 * 基準ピッチ（キャリブレーション）コントロール
 * A=440Hz の基準ピッチを ±1Hz で調整
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';

type CalibrationControlProps = {
  calibrationHz: number;
  onDecrease: () => void;
  onIncrease: () => void;
};

export const CalibrationControl: React.FC<CalibrationControlProps> = ({
  calibrationHz,
  onDecrease,
  onIncrease,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>基準</Text>
      <Text style={styles.value}>A={calibrationHz}Hz</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.button}
          onPress={onDecrease}
          activeOpacity={0.6}
        >
          <Text style={styles.buttonText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={onIncrease}
          activeOpacity={0.6}
        >
          <Text style={styles.buttonText}>＋</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
  },
  value: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textBright,
    marginRight: SPACING.md,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  button: {
    backgroundColor: COLORS.surface,
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  buttonText: {
    color: COLORS.textBright,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
});
