/**
 * 微調整コンポーネント（5段階ステップ）
 * -1/2, -1/4, 0, +1/4, +1/2 のディスクリートステップで調整
 * slider_tuning.svg のデザインを適用
 * 漆塗りトラック＋金箔目盛り＋金ノブ
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import Svg, {
  Rect,
  Circle,
  Line,
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { FONT_SIZES, SPACING } from '../constants/theme';
import { FINE_TUNE_STEPS } from '../constants/tuningData';

type FineTuneControlProps = {
  fineTuneCents: number;
  onValueChange: (value: number) => void;
};

const SVG_H = 64;
const TRACK_Y = 26;
const TRACK_H = 14;
const TRACK_PAD = 12; // トラック左右余白

export const FineTuneControl: React.FC<FineTuneControlProps> = ({
  fineTuneCents,
  onValueChange,
}) => {
  const [svgW, setSvgW] = useState(300);

  const onLayout = (e: LayoutChangeEvent) => setSvgW(e.nativeEvent.layout.width);

  const activeIndex = FINE_TUNE_STEPS.findIndex((s) => s.value === fineTuneCents);
  const trackInner = svgW - TRACK_PAD * 2;

  // 各ステップのX座標
  const stepX = (i: number) => TRACK_PAD + trackInner * (i / (FINE_TUNE_STEPS.length - 1));
  const knobX = activeIndex >= 0 ? stepX(activeIndex) : stepX(2);

  return (
    <View style={styles.container}>
      {/* タップ操作行（ラベルは各ステップ位置に配置） */}
      <View style={styles.stepsRow} onLayout={onLayout}>
        {FINE_TUNE_STEPS.map((step, i) => {
          const isActive = fineTuneCents === step.value;
          return (
            <TouchableOpacity
              key={step.value}
              style={styles.stepTouch}
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

      {/* SVGスライダートラック */}
      <View style={styles.svgWrapper} pointerEvents="none">
        <Svg width={svgW} height={SVG_H}>
          <Defs>
            {/* 漆トラック */}
            <SvgLinearGradient id="ftTrack" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%"   stopColor="#0E0802" />
              <Stop offset="35%"  stopColor="#1A1006" />
              <Stop offset="70%"  stopColor="#241408" />
              <Stop offset="100%" stopColor="#0A0602" />
            </SvgLinearGradient>
            {/* ノブ外側ゴールド */}
            <RadialGradient id="ftKnobOuter" cx="40%" cy="30%" r="60%">
              <Stop offset="0%"   stopColor="#FFF8A0" />
              <Stop offset="28%"  stopColor="#F0CC50" />
              <Stop offset="58%"  stopColor="#C89820" />
              <Stop offset="80%"  stopColor="#9A7010" />
              <Stop offset="92%"  stopColor="#C09020" />
              <Stop offset="100%" stopColor="#E8B830" />
            </RadialGradient>
            {/* ノブフェイス（漆） */}
            <RadialGradient id="ftKnobFace" cx="42%" cy="32%" r="60%">
              <Stop offset="0%"   stopColor="#4A3018" />
              <Stop offset="40%"  stopColor="#281608" />
              <Stop offset="75%"  stopColor="#180A04" />
              <Stop offset="100%" stopColor="#0C0602" />
            </RadialGradient>
          </Defs>

          {/* 漆塗りトラック */}
          <Rect
            x={TRACK_PAD} y={TRACK_Y}
            width={trackInner} height={TRACK_H}
            rx={TRACK_H / 2}
            fill="url(#ftTrack)"
          />
          {/* トラック上部ツヤ */}
          <Rect
            x={TRACK_PAD + 2} y={TRACK_Y + 1}
            width={trackInner - 4} height={TRACK_H * 0.45}
            rx={TRACK_H * 0.2}
            fill="white" opacity={0.06}
          />

          {/* 金の目盛り（各ステップ上） */}
          {FINE_TUNE_STEPS.map((step, i) => {
            const x = stepX(i);
            const isMajor = i === 0 || i === 2 || i === 4;
            return (
              <React.Fragment key={step.value}>
                {/* 上目盛り */}
                <Line
                  x1={x} y1={TRACK_Y - 10}
                  x2={x} y2={TRACK_Y - 2}
                  stroke={isMajor ? '#D4A820' : '#8A6010'}
                  strokeWidth={isMajor ? 1.5 : 1}
                  opacity={isMajor ? 1 : 0.6}
                />
                {/* 下目盛り（主目盛りのみ） */}
                {isMajor && (
                  <Line
                    x1={x} y1={TRACK_Y + TRACK_H + 2}
                    x2={x} y2={TRACK_Y + TRACK_H + 9}
                    stroke="#D4A820"
                    strokeWidth={1.5}
                  />
                )}
              </React.Fragment>
            );
          })}

          {/* 金ノブ */}
          {/* シャドウ */}
          <Circle cx={knobX + 1} cy={TRACK_Y + TRACK_H / 2 + 2} r={13} fill="black" opacity={0.35} />
          {/* ゴールドリング */}
          <Circle cx={knobX} cy={TRACK_Y + TRACK_H / 2} r={12} fill="url(#ftKnobOuter)" />
          {/* 溝リング */}
          <Circle
            cx={knobX} cy={TRACK_Y + TRACK_H / 2} r={10}
            fill="none" stroke="#7A5808" strokeWidth={1.2}
          />
          {/* 漆フェイス */}
          <Circle cx={knobX} cy={TRACK_Y + TRACK_H / 2} r={8.5} fill="url(#ftKnobFace)" />
          {/* センター蒔絵 */}
          <Circle cx={knobX} cy={TRACK_Y + TRACK_H / 2} r={2.5} fill="#D4A820" opacity={0.7} />
          <Circle cx={knobX} cy={TRACK_Y + TRACK_H / 2} r={1.2} fill="#FFF8A0" opacity={0.8} />
        </Svg>
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
  stepTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  stepText: {
    fontSize: FONT_SIZES.md,
    color: '#8a7050',
    fontFamily: 'serif',
  },
  stepTextActive: {
    color: '#F0CC50',
    fontWeight: 'bold',
    fontSize: FONT_SIZES.lg,
    textShadowColor: 'rgba(240, 204, 80, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  svgWrapper: {
    marginTop: -4,
  },
});
