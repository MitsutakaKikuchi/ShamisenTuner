/**
 * アプリヘッダーコンポーネント
 * アプリ名「かなで」と青海波（せいがいは）背景パターン
 * ZenOldMinchoフォントで和の筆書き雰囲気を演出
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Path,
  Line as SvgLine,
  Defs,
  LinearGradient as SvgLinGrad,
  Stop,
} from 'react-native-svg';
import { COLORS, SPACING } from '../constants/theme';

// 青海波スケールサイズ
const SCALE_R = 26;

/**
 * 青海波（せいがいは）SVGパターンを生成するコンポーネント
 * 伝統的な半円形の魚鱗模様を重ね合わせて表現
 */
const SeigaihaPattern: React.FC<{ width: number; height: number }> = ({
  width,
  height,
}) => {
  const elements = useMemo(() => {
    const result: React.ReactNode[] = [];
    const SCALE_W = SCALE_R * 2;
    const cols = Math.ceil(width / SCALE_W) + 2;
    const rows = Math.ceil(height / SCALE_R) + 2;

    // 上の行から下の行へ描画（下の行が上に重なる）
    for (let row = 0; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const offsetX = row % 2 === 1 ? SCALE_R : 0;
        const cx = col * SCALE_W + offsetX;
        const cy = row * SCALE_R + SCALE_R;

        // 半円の塗りつぶしパス（弧を上向きに）
        const fillPath = `M ${cx - SCALE_R},${cy} A ${SCALE_R},${SCALE_R} 0 0,0 ${cx + SCALE_R},${cy} Z`;

        // 内側の同心弧
        const arc = (r: number) =>
          `M ${(cx - r).toFixed(1)},${cy} A ${r.toFixed(1)},${r.toFixed(1)} 0 0,0 ${(cx + r).toFixed(1)},${cy}`;

        // 偶数・奇数行で微妙に色を変えて奥行きを演出
        const fillColor = row % 2 === 0 ? '#07122A' : '#0A1838';
        const key = `sg_${row}_${col}`;

        result.push(
          <React.Fragment key={key}>
            <Path d={fillPath} fill={fillColor} stroke="#1A3060" strokeWidth={0.7} />
            <Path d={arc(SCALE_R * 0.82)} fill="none" stroke="rgba(80,150,255,0.22)" strokeWidth={0.9} />
            <Path d={arc(SCALE_R * 0.62)} fill="none" stroke="rgba(120,180,255,0.15)" strokeWidth={0.7} />
            <Path d={arc(SCALE_R * 0.40)} fill="none" stroke="rgba(180,220,255,0.09)" strokeWidth={0.5} />
          </React.Fragment>
        );
      }
    }
    return result;
  }, [width, height]);

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {elements}
    </Svg>
  );
};

type HeaderProps = {
  onSettingsPress?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onSettingsPress }) => {
  const [w, setW] = useState(375);
  const [h, setH] = useState(120);

  return (
    <View
      style={styles.container}
      onLayout={(e) => {
        setW(e.nativeEvent.layout.width);
        setH(e.nativeEvent.layout.height);
      }}
    >
      {/* 青海波パターン */}
      <SeigaihaPattern width={w} height={h} />

      {/* 上部金グラデーションライン */}
      <Svg width="100%" height={2} style={styles.goldLine}>
        <Defs>
          <SvgLinGrad id="hdrGoldTop" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%"   stopColor="#D4A820" stopOpacity={0} />
            <Stop offset="20%"  stopColor="#F0CC50" stopOpacity={0.6} />
            <Stop offset="50%"  stopColor="#FFF0A0" stopOpacity={1} />
            <Stop offset="80%"  stopColor="#F0CC50" stopOpacity={0.6} />
            <Stop offset="100%" stopColor="#D4A820" stopOpacity={0} />
          </SvgLinGrad>
        </Defs>
        <SvgLine x1="0" y1="1" x2="100%" y2="1" stroke="url(#hdrGoldTop)" strokeWidth={2} />
      </Svg>

      {/* メインコンテンツ */}
      <View style={styles.content}>
        {/* 左装飾（縦線 + 菱形ドット） */}
        <View style={styles.ornamentLeft}>
          <View style={styles.ornamentLine} />
          <View style={styles.ornamentDot} />
          <View style={styles.ornamentLineSm} />
        </View>

        <Text style={styles.title}>かなで</Text>

        {/* 右装飾（縦線 + 菱形ドット） */}
        <View style={styles.ornamentRight}>
          <View style={styles.ornamentLineSm} />
          <View style={styles.ornamentDot} />
          <View style={styles.ornamentLine} />
        </View>

        {onSettingsPress && (
          <TouchableOpacity style={styles.settingsButton} onPress={onSettingsPress}>
            <Svg width={28} height={28}>
              <Defs>
                <SvgLinGrad id="gearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%"   stopColor="#FFF8A0" />
                  <Stop offset="50%"  stopColor="#D4A820" />
                  <Stop offset="100%" stopColor="#906808" />
                </SvgLinGrad>
              </Defs>
              {/* 8歯ギアパス */}
              <Path
                d="M9.2,3.5 L10.5,6.8 L13.8,6.8 L11.2,8.9 L12.2,12.2 L9,10.3 L5.8,12.2 L6.8,8.9 L4.2,6.8 L7.5,6.8 Z"
                fill="url(#gearGrad)"
                transform="translate(0,0) scale(1.5)"
              />
              <Circle cx={14} cy={14} r={4} fill="#08122A" />
            </Svg>
          </TouchableOpacity>
        )}
      </View>

      {/* 副題：三味線 調弦 */}
      <Text style={styles.subTitle}>三味線 調律</Text>

      {/* 下部金グラデーションライン */}
      <Svg width="100%" height={3} style={styles.goldLine}>
        <Defs>
          <SvgLinGrad id="hdrGoldBot" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%"   stopColor="#D4A820" stopOpacity={0} />
            <Stop offset="20%"  stopColor="#F0CC50" stopOpacity={0.7} />
            <Stop offset="50%"  stopColor="#FFF0A0" stopOpacity={1} />
            <Stop offset="80%"  stopColor="#F0CC50" stopOpacity={0.7} />
            <Stop offset="100%" stopColor="#D4A820" stopOpacity={0} />
          </SvgLinGrad>
        </Defs>
        <SvgLine x1="0" y1="1.5" x2="100%" y2="1.5" stroke="url(#hdrGoldBot)" strokeWidth={3} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#070D1C',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  goldLine: {
    marginHorizontal: 0,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  ornamentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: SPACING.md,
  },
  ornamentRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: SPACING.md,
  },
  ornamentLine: {
    width: 28,
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.7,
  },
  ornamentLineSm: {
    width: 14,
    height: 1,
    backgroundColor: COLORS.gold,
    opacity: 0.5,
  },
  ornamentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.gold,
    opacity: 0.9,
  },
  title: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFF8C0',
    letterSpacing: 12,
    fontFamily: 'ZenOldMincho_900Black',
    textShadowColor: 'rgba(240, 204, 80, 0.7)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  subTitle: {
    fontSize: 13,
    color: '#A88840',
    letterSpacing: 6,
    fontFamily: 'ZenOldMincho_400Regular',
    textAlign: 'center',
    marginBottom: SPACING.xs,
    opacity: 0.8,
  },
  settingsButton: {
    position: 'absolute',
    right: SPACING.xl,
    padding: SPACING.sm,
  },
});
