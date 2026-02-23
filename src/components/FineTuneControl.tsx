/**
 * 微調整コンポーネント（5段階ステップボタン）
 * -1/2, -1/4, 0, +1/4, +1/2 のディスクリートステップで調整
 * 「微調整」ラベルなし、初期値は中央(0)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { FINE_TUNE_STEPS } from '../constants/tuningData';

type FineTuneControlProps = {
  fineTuneCents: number;
  onValueChange: (value: number) => void;
};

export const FineTuneControl: React.FC<FineTuneControlProps> = ({
  fineTuneCents,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsRow}>
        {FINE_TUNE_STEPS.map((step) => {
          const isActive = fineTuneCents === step.value;
          return (
            <TouchableOpacity
              key={step.value}
              style={[styles.stepButton, isActive && styles.stepButtonActive]}
              onPress={() => onValueChange(step.value)}
              activeOpacity={0.6}
            >
              <Text style={[styles.stepText, isActive && styles.stepTextActive]}>
                {step.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* トラックライン（装飾用） */}
      <View style={styles.trackLine}>
        <View style={styles.trackBar} />
        {FINE_TUNE_STEPS.map((step) => {
          const isActive = fineTuneCents === step.value;
          return (
            <View
              key={`dot_${step.value}`}
              style={[styles.trackDot, isActive && styles.trackDotActive]}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    marginHorizontal: 2,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: 'transparent',
  },
  stepButtonActive: {
    backgroundColor: 'rgba(198, 162, 101, 0.85)',
  },
  stepText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textMuted,
    fontWeight: '500',
    fontFamily: 'serif',
  },
  stepTextActive: {
    color: COLORS.textDark,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.lg,
  },
  trackLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    height: 12,
    position: 'relative',
  },
  trackBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    height: 2,
    backgroundColor: COLORS.borderLight,
    top: 5,
  },
  trackDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.borderLight,
  },
  trackDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.goldBright,
  },
});
