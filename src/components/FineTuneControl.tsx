/**
 * 微調整コンポーネント（5段階ステップ）
 * -1/2, -1/4, 0, +1/4, +1/2 のディスクリートステップで調整
 * slider_tuning.svg のデザイン + PanResponder によるドラッグ操作
 * 漆塗りトラック＋金箔目盛り＋ドラッグ可能な金ノブ
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PanResponder,
  type LayoutChangeEvent,
} from 'react-native';
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

const SVG_H = 68;
const TRACK_Y = 28;
const TRACK_H = 14;
const TRACK_PAD = 22; // ノブが端でもはみ出さない余白

export const FineTuneControl: React.FC<FineTuneControlProps> = ({
  fineTuneCents,
  onValueChange,
}) => {
  const [svgW, setSvgW] = useState(300);
  const svgWRef = useRef(300);
  const trackPageXRef = useRef(0);
  const trackViewRef = useRef<View>(null);

  // 最新の onValueChange と自身の値を ref で保持（PanResponder クロージャ問題回避）
  const onValueChangeRef = useRef(onValueChange);
  onValueChangeRef.current = onValueChange;

  // X座標からステップ値を計算する関数（ref で最新値を参照）
  const getValueFromPageXRef = useRef((pageX: number): number => {
    const trackInner = svgWRef.current - TRACK_PAD * 2;
    const relX = pageX - trackPageXRef.current - TRACK_PAD;
    const ratio = Math.max(0, Math.min(1, relX / trackInner));
    const idx = Math.round(ratio * (FINE_TUNE_STEPS.length - 1));
    return FINE_TUNE_STEPS[idx]?.value ?? 0;
  });
  // svgWRef/trackPageXRef は ref なので常に最新値を参照 → 関数更新不要

  // PanResponder：一度だけ生成（useRef で安定）
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        onValueChangeRef.current(getValueFromPageXRef.current(evt.nativeEvent.pageX));
      },
      onPanResponderMove: (evt) => {
        onValueChangeRef.current(getValueFromPageXRef.current(evt.nativeEvent.pageX));
      },
      onPanResponderRelease: (evt) => {
        onValueChangeRef.current(getValueFromPageXRef.current(evt.nativeEvent.pageX));
      },
    })
  ).current;

  const onTrackLayout = useCallback((e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    svgWRef.current = width;
    setSvgW(width);
    // ScrollView 内でも正確な絶対X座標を取得
    trackViewRef.current?.measure((_x, _y, _w, _h, pageX) => {
      trackPageXRef.current = pageX;
    });
  }, []);

  const activeIndex = FINE_TUNE_STEPS.findIndex((s) => s.value === fineTuneCents);
  const trackInner = svgW - TRACK_PAD * 2;
  const stepX = (i: number) => TRACK_PAD + trackInner * (i / (FINE_TUNE_STEPS.length - 1));
  const knobX = activeIndex >= 0 ? stepX(activeIndex) : stepX(2);
  const knobY = TRACK_Y + TRACK_H / 2;

  return (
    <View style={styles.container}>
      {/* タップも可能なラベル行 */}
      <View style={styles.stepsRow}>
        {FINE_TUNE_STEPS.map((step) => {
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

      {/* ドラッグ可能な SVG スライダートラック */}
      <View
        ref={trackViewRef}
        onLayout={onTrackLayout}
        style={styles.svgWrapper}
        {...panResponder.panHandlers}
      >
        <Svg width={svgW} height={SVG_H}>
          <Defs>
            {/* 漆塗りトラック */}
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

          {/* 漆塗りトラック本体 */}
          <Rect
            x={TRACK_PAD}
            y={TRACK_Y}
            width={trackInner}
            height={TRACK_H}
            rx={TRACK_H / 2}
            fill="url(#ftTrack)"
          />
          {/* トラック上部ツヤ */}
          <Rect
            x={TRACK_PAD + 2}
            y={TRACK_Y + 1}
            width={trackInner - 4}
            height={TRACK_H * 0.42}
            rx={TRACK_H * 0.2}
            fill="white"
            opacity={0.06}
          />

          {/* 金の目盛り */}
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
                {/* 下目盛り（主のみ） */}
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

          {/* 金ノブ（ドラッグ可能） */}
          {/* シャドウ */}
          <Circle cx={knobX + 1} cy={knobY + 2} r={14} fill="black" opacity={0.35} />
          {/* ゴールドリング */}
          <Circle cx={knobX} cy={knobY} r={13} fill="url(#ftKnobOuter)" />
          {/* 溝リング */}
          <Circle
            cx={knobX} cy={knobY} r={10.5}
            fill="none" stroke="#7A5808" strokeWidth={1.3}
          />
          {/* 漆フェイス */}
          <Circle cx={knobX} cy={knobY} r={9} fill="url(#ftKnobFace)" />
          {/* 蒔絵センタードット */}
          <Circle cx={knobX} cy={knobY} r={2.8} fill="#D4A820" opacity={0.7} />
          <Circle cx={knobX} cy={knobY} r={1.3} fill="#FFF8A0" opacity={0.85} />
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
    fontFamily: 'ZenOldMincho_400Regular',
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

