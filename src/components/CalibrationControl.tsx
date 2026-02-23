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
  toneType: 'electronic' | 'pipe';
  onDecrease: () => void;
  onIncrease: () => void;
  onToneTypeToggle: () => void;
};

export const CalibrationControl: React.FC<CalibrationControlProps> = ({
  calibrationHz,
  toneType,
  onDecrease,
  onIncrease,
  onToneTypeToggle,
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

      {/* 右: 音色トグル（電子音/調子笛） */}
      <TouchableOpacity
        style={[styles.toneButton, toneType === 'pipe' && styles.toneButtonActive]}
        onPress={onToneTypeToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.toneIcon}>{toneType === 'pipe' ? '🎵' : '🔊'}</Text>
        <Text style={[styles.toneText, toneType === 'pipe' && styles.toneTextActive]}>
          {toneType === 'pipe' ? '調子笛' : '電子音'}
        </Text>
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
    fontFamily: 'serif',
  },
  value: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textBright,
    marginRight: SPACING.md,
    fontFamily: 'serif',
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
  toneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    gap: SPACING.xs,
  },
  toneButtonActive: {
    backgroundColor: COLORS.goldDark,
    borderColor: COLORS.gold,
  },
  toneIcon: {
    fontSize: FONT_SIZES.md,
  },
  toneText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontFamily: 'serif',
  },
  toneTextActive: {
    color: COLORS.textBright,
    fontWeight: 'bold',
  },
});
