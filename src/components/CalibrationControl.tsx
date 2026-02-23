/**
 * 基準ピッチ（キャリブレーション）コントロール
 * A=440Hz の基準ピッチを ±1Hz で調整
 * 調子笛ボタンを右側に配置
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Rect, Line } from 'react-native-svg';
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
          {/* マイナスボタン（SVGアイコン） */}
          <TouchableOpacity
            style={styles.button}
            onPress={onDecrease}
            activeOpacity={0.6}
          >
            <Svg width={20} height={20} viewBox="0 0 20 20">
              <Rect x={2} y={8} width={16} height={4} rx={2} fill="#D4A820" />
            </Svg>
          </TouchableOpacity>
          {/* プラスボタン（SVGアイコン - 中央揃え） */}
          <TouchableOpacity
            style={styles.button}
            onPress={onIncrease}
            activeOpacity={0.6}
          >
            <Svg width={20} height={20} viewBox="0 0 20 20">
              <Rect x={2} y={8} width={16} height={4} rx={2} fill="#D4A820" />
              <Rect x={8} y={2} width={4} height={16} rx={2} fill="#D4A820" />
            </Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* 右: 音色トグル（電子音/調子笛） */}
      <TouchableOpacity
        style={[styles.toneButton, toneType === 'pipe' && styles.toneButtonActive]}
        onPress={onToneTypeToggle}
        activeOpacity={0.7}
      >
        {/* 調子笛アイコン（SVG） */}
        <Svg width={18} height={18} viewBox="0 0 18 18">
          <Rect x={6} y={1} width={6} height={13} rx={1.5} fill={toneType === 'pipe' ? '#FFF0A0' : '#9e8568'} />
          <Rect x={5} y={12} width={8} height={4} rx={1.5} fill={toneType === 'pipe' ? '#D4A820' : '#70542c'} />
          <Line x1={7.5} y1={3} x2={7.5} y2={11} stroke="#FFFFFF" strokeWidth={1} opacity={0.2} />
        </Svg>
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
    fontFamily: 'ZenOldMincho_400Regular',
  },
  value: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textBright,
    marginRight: SPACING.md,
    fontFamily: 'ZenOldMincho_700Bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  button: {
    backgroundColor: 'rgba(59, 35, 20, 0.85)',
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderGold,
  },
  toneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 35, 20, 0.85)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: COLORS.borderLight,
    gap: SPACING.xs,
  },
  toneButtonActive: {
    backgroundColor: 'rgba(112, 84, 44, 0.9)',
    borderColor: COLORS.gold,
  },
  toneText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    fontFamily: 'ZenOldMincho_400Regular',
  },
  toneTextActive: {
    color: COLORS.textBright,
    fontWeight: 'bold',
  },
});
