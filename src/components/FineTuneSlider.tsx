/**
 * 微調整スライダーコンポーネント
 * -1/4音～+1/4音の範囲でスライダー操作
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { FINE_TUNE_MIN_CENTS, FINE_TUNE_MAX_CENTS } from '../constants/tuningData';

type FineTuneSliderProps = {
  fineTuneCents: number;
  onValueChange: (value: number) => void;
};

export const FineTuneSlider: React.FC<FineTuneSliderProps> = ({
  fineTuneCents,
  onValueChange,
}) => {
  // 表示用テキスト
  const displayText = (): string => {
    if (fineTuneCents === 0) {
      return '0';
    }
    const sign = fineTuneCents > 0 ? '+' : '';
    const fraction = fineTuneCents / 100;
    // 1/4音単位で表示
    if (Math.abs(fineTuneCents) === 25) {
      return `${sign}1/4`;
    }
    if (Math.abs(fineTuneCents) === 50) {
      return `${sign}1/2`;
    }
    return `${sign}${fraction.toFixed(2)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>微調整</Text>
      <View style={styles.sliderRow}>
        <Text style={styles.rangeLabel}>-1/4</Text>
        <Slider
          style={styles.slider}
          minimumValue={FINE_TUNE_MIN_CENTS}
          maximumValue={FINE_TUNE_MAX_CENTS}
          value={fineTuneCents}
          step={1}
          onSlidingComplete={onValueChange}
          minimumTrackTintColor={COLORS.gold}
          maximumTrackTintColor={COLORS.borderLight}
          thumbTintColor={COLORS.goldBright}
        />
        <Text style={styles.rangeLabel}>+1/4</Text>
      </View>
      <View style={styles.tickMarks}>
        <View style={styles.tickMark} />
        <View style={[styles.tickMark, styles.tickMarkCenter]} />
        <View style={styles.tickMark} />
      </View>
      <Text style={styles.valueText}>{displayText()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slider: {
    flex: 1,
    height: 40,
  },
  rangeLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    width: 32,
    textAlign: 'center',
  },
  tickMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: -8,
  },
  tickMark: {
    width: 1,
    height: 8,
    backgroundColor: COLORS.textMuted,
  },
  tickMarkCenter: {
    height: 12,
    backgroundColor: COLORS.textPrimary,
  },
  valueText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textBright,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
});
