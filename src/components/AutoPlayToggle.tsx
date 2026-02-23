/**
 * 自動再生（アルペジオ）トグルコンポーネント
 * gear_and_toggle.svg のSVGカスタムトグルスイッチを適用
 * ギアアイコン + 緑グラデーションON / ダーク漆塗りOFF
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Rect,
  Ellipse,
  Path,
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import { FONT_SIZES, SPACING } from '../constants/theme';

// トグルサイズ (gear_and_toggle.svg から 0.6スケール)
const TRK_W = 54;
const TRK_H = 28;
const TRK_RX = TRK_H / 2;
const THUMB_R = 11;
const THUMB_OFF_X = TRK_H / 2;        // = 14
const THUMB_ON_X = TRK_W - TRK_H / 2; // = 40

// 8歯ギアパス (数学的 r=10, 歯高=4)
const GEAR_PATH = (() => {
  const N = 8;
  const Ro = 10;
  const Ri = 7.2;
  const halfTooth = Math.PI / N;
  let d = '';
  for (let i = 0; i < N; i++) {
    const a0 = (i / N) * 2 * Math.PI - halfTooth;
    const a1 = (i / N) * 2 * Math.PI + halfTooth;
    const a2 = a1 + halfTooth * 0.3;
    const a3 = ((i + 1) / N) * 2 * Math.PI - halfTooth * 0.3;
    const pts = [
      [Ri * Math.cos(a0), Ri * Math.sin(a0)],
      [Ro * Math.cos(a0 + halfTooth * 0.25), Ro * Math.sin(a0 + halfTooth * 0.25)],
      [Ro * Math.cos(a1 - halfTooth * 0.25), Ro * Math.sin(a1 - halfTooth * 0.25)],
      [Ri * Math.cos(a1), Ri * Math.sin(a1)],
    ];
    pts.forEach(([x, y], j) => {
      d += `${i === 0 && j === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)} `;
    });
  }
  return d + 'Z';
})();

type AutoPlayToggleProps = {
  isAutoPlaying: boolean;
  onToggle: () => void;
};

export const AutoPlayToggle: React.FC<AutoPlayToggleProps> = ({
  isAutoPlaying,
  onToggle,
}) => {
  const thumbX = isAutoPlaying ? THUMB_ON_X : THUMB_OFF_X;
  const TY = TRK_H / 2;

  return (
    <View style={styles.container}>
      {/* ギアアイコン */}
      <Svg width={28} height={28} style={styles.gearIcon}>
        <Defs>
          <RadialGradient id="atGear" cx="40%" cy="30%" r="65%">
            <Stop offset="0%"   stopColor="#FFF8A0" />
            <Stop offset="30%"  stopColor="#E8C040" />
            <Stop offset="65%"  stopColor="#C09018" />
            <Stop offset="100%" stopColor="#9A7010" />
          </RadialGradient>
          <RadialGradient id="atGearCenter" cx="50%" cy="50%" r="50%">
            <Stop offset="0%"   stopColor="#281608" />
            <Stop offset="100%" stopColor="#0A0402" />
          </RadialGradient>
        </Defs>
        <Path
          d={GEAR_PATH}
          fill="url(#atGear)"
          transform="translate(14,14)"
        />
        {/* センター穴 */}
        <Circle cx={14} cy={14} r={4} fill="url(#atGearCenter)" />
      </Svg>

      <Text style={styles.label}>自動再生</Text>

      {/* SVGカスタムトグル */}
      <TouchableOpacity onPress={onToggle} activeOpacity={0.8}>
        <Svg width={TRK_W} height={TRK_H}>
          <Defs>
            <SvgLinearGradient id="atTrackOn" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%"   stopColor="#5CE870" />
              <Stop offset="50%"  stopColor="#34C94A" />
              <Stop offset="100%" stopColor="#22A034" />
            </SvgLinearGradient>
            <SvgLinearGradient id="atTrackOff" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%"   stopColor="#2E1C08" />
              <Stop offset="100%" stopColor="#1A0C04" />
            </SvgLinearGradient>
            <RadialGradient id="atThumb" cx="40%" cy="30%" r="65%">
              <Stop offset="0%"   stopColor="#ffffff" />
              <Stop offset="60%"  stopColor="#F0F0F0" />
              <Stop offset="100%" stopColor="#D8D8D8" />
            </RadialGradient>
          </Defs>

          {/* トラック */}
          <Rect
            x={0} y={0}
            width={TRK_W} height={TRK_H}
            rx={TRK_RX}
            fill={isAutoPlaying ? 'url(#atTrackOn)' : 'url(#atTrackOff)'}
          />
          {/* トラック上部ハイライト */}
          <Rect
            x={2} y={1}
            width={TRK_W - 4} height={TRK_H * 0.42}
            rx={TRK_H * 0.2}
            fill="white"
            opacity={isAutoPlaying ? 0.16 : 0.06}
          />

          {/* サム（つまみ） */}
          {/* ドロップシャドウ */}
          <Circle cx={thumbX + 0.5} cy={TY + 1.5} r={THUMB_R} fill="black" opacity={0.3} />
          {/* 白グラデーション */}
          <Circle cx={thumbX} cy={TY} r={THUMB_R} fill="url(#atThumb)" />
          {/* リム */}
          <Circle
            cx={thumbX} cy={TY} r={THUMB_R}
            fill="none" stroke="#D0D0D0" strokeWidth={0.8}
          />
          {/* スペキュラー */}
          <Ellipse
            cx={thumbX - 3} cy={TY - 3}
            rx={5} ry={3}
            fill="white" opacity={0.45}
          />
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  gearIcon: {
    opacity: 0.85,
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: '#d8bd8a',
    fontFamily: 'serif',
  },
});
