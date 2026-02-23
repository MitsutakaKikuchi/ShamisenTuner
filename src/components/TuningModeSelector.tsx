/**
 * 調弦モード選択コンポーネント
 * 本調子・二上り・三下り をタブ形式で選択
 * tuning_mode_buttons.svg のデザインを適用
 * 非選択：欅材（ケヤキ）ダーク、選択：金箔ゴールド
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { FONT_SIZES, SPACING } from '../constants/theme';
import type { TuningMode } from '../constants/tuningData';

type TuningModeSelectorProps = {
  modes: TuningMode[];
  selectedModeId: string;
  onModeChange: (modeId: string) => void;
};

export const TuningModeSelector: React.FC<TuningModeSelectorProps> = ({
  modes,
  selectedModeId,
  onModeChange,
}) => {
  const [containerW, setContainerW] = useState(300);
  const [containerH, setContainerH] = useState(54);

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerW(e.nativeEvent.layout.width);
    setContainerH(e.nativeEvent.layout.height);
  };

  // タブ幅（同幅3分割）＋ 仕切り位置
  const tabW = containerW / modes.length;
  const dividerXs = modes.slice(0, -1).map((_, i) => tabW * (i + 1));

  return (
    <View style={styles.outerWrapper}>
      {/* 漆塗りコンテナ背景 */}
      <LinearGradient
        colors={['#2E1C08', '#1E1006', '#140A04', '#0A0602']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradientContainer}
      >
        {/* 金縁SVGオーバーレイ */}
        <Svg
          width={containerW}
          height={containerH}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
        >
          <Defs>
            <SvgLinearGradient id="tmBorder" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%"   stopColor="#D4A820" stopOpacity="0" />
              <Stop offset="25%"  stopColor="#E8C040" stopOpacity="0.7" />
              <Stop offset="50%"  stopColor="#F0CC50" stopOpacity="0.9" />
              <Stop offset="75%"  stopColor="#E8C040" stopOpacity="0.7" />
              <Stop offset="100%" stopColor="#D4A820" stopOpacity="0" />
            </SvgLinearGradient>
            <SvgLinearGradient id="tmDivider" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%"   stopColor="#D4A820" stopOpacity="0" />
              <Stop offset="30%"  stopColor="#E8C040" stopOpacity="0.8" />
              <Stop offset="50%"  stopColor="#F0CC50" stopOpacity="1" />
              <Stop offset="70%"  stopColor="#E8C040" stopOpacity="0.8" />
              <Stop offset="100%" stopColor="#D4A820" stopOpacity="0" />
            </SvgLinearGradient>
          </Defs>
          {/* 外枠ボーダー */}
          <Rect
            x={0.75} y={0.75}
            width={containerW - 1.5} height={containerH - 1.5}
            rx={14} ry={14}
            fill="none"
            stroke="url(#tmBorder)"
            strokeWidth={1.5}
          />
          {/* タブ間仕切り */}
          {dividerXs.map((x, i) => (
            <Rect
              key={i}
              x={x - 1} y={4}
              width={2} height={containerH - 8}
              fill="url(#tmDivider)"
            />
          ))}
        </Svg>

        {/* タブ行 */}
        <View style={styles.tabRow} onLayout={onLayout}>
          {modes.map((mode, index) => {
            const isSelected = mode.id === selectedModeId;
            return (
              <TouchableOpacity
                key={mode.id}
                style={styles.tabTouch}
                onPress={() => onModeChange(mode.id)}
                activeOpacity={0.75}
              >
                {isSelected ? (
                  <LinearGradient
                    colors={[
                      '#FFF8D0', '#F5E090', '#E8C840',
                      '#D4A820', '#C09018', '#A87810', '#906808',
                    ]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.tabGradient}
                  >
                    {/* 上部ハイライト */}
                    <View style={styles.activeTopHairline} />
                    <Text style={styles.tabTextActive}>{mode.label}</Text>
                  </LinearGradient>
                ) : (
                  <LinearGradient
                    colors={['#4A2E12', '#3A2010', '#281608', '#200E06', '#180A04']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={styles.tabGradient}
                  >
                    <Text style={styles.tabText}>{mode.label}</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerWrapper: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  gradientContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 6,
    elevation: 8,
  },
  tabRow: {
    flexDirection: 'row',
  },
  tabTouch: {
    flex: 1,
  },
  tabGradient: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeTopHairline: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#FFF8D0',
    opacity: 0.4,
  },
  tabText: {
    fontSize: FONT_SIZES.xl,
    color: '#A88860',
    fontFamily: 'serif',
  },
  tabTextActive: {
    fontSize: FONT_SIZES.xl,
    color: '#3E2008',
    fontFamily: 'serif',
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 248, 200, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
