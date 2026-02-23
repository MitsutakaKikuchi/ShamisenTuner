/**
 * 基準ピッチ（キャリブレーション）コントロール
 * A=440Hz の基準ピッチを ±1Hz で調整
 * 調子笛ボタンを右側に配置
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
      {/* 左: 基準ピッチ */}
      <View style={styles.pitchSection}>
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

      {/* 右: 調子笛ボタン（将来拡張） */}
      <TouchableOpacity style={styles.choshiBueButton} activeOpacity={0.7}>
        <Text style={styles.choshiBueIcon}>🎵</Text>
        <Text style={styles.choshiBueText}>調子笛</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  pitchSection: {
    flexDirection: 'row',
    alignItems: 'center',
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
  choshiBueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.borderGold,
    gap: SPACING.xs,
  },
  choshiBueIcon: {
    fontSize: FONT_SIZES.md,
  },
  choshiBueText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
  },
});
