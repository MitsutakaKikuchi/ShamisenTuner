/**
 * 糸の再生ボタンコンポーネント
 * 3つの糸（一の糸、二の糸、三の糸）を横並びに配置
 * タップで音が鳴り始め、再タップで止まる（トグル方式）
 * string_buttons.svg のSVG多層ゴールドリングデザインを適用
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, {
  Circle,
  Ellipse,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { FONT_SIZES, SPACING } from '../constants/theme';
import { SHAMISEN_STRINGS } from '../constants/tuningData';
import { getStringNoteName } from '../utils/noteNameHelper';

// ボタン半径 94px 直径（SVG r=81 → スケール約0.58）
const R = 47;
const SIZE = R * 2;

type StringInfo = {
  id: string;
  label: string;
  noteName: string;
};

type SingleButtonProps = {
  string: StringInfo;
  isActive: boolean;
  isAutoPlaying: boolean;
  onPress: () => void;
};

/** SVG多層ゴールドリングボタン */
const StringButton: React.FC<SingleButtonProps> = ({
  string,
  isActive,
  isAutoPlaying,
  onPress,
}) => {
  // グラデーションIDをボタンごとに一意にする
  const sid = string.id.replace('_', '');
  const ogId = `og_${sid}`;
  const srId = `sr_${sid}`;
  const fcId = `fc_${sid}`;
  const fgId = `fg_${sid}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isAutoPlaying}
      activeOpacity={0.8}
      style={[
        styles.buttonWrapper,
        isAutoPlaying && !isActive && styles.buttonDisabled,
      ]}
    >
      {/* SVG レイヤースタック */}
      <Svg width={SIZE} height={SIZE}>
        <Defs>
          {/* 外側ゴールドリング */}
          <RadialGradient id={ogId} cx="50%" cy="30%" r="55%">
            <Stop offset="0%" stopColor="#FFF8A0" />
            <Stop offset="25%" stopColor="#F0CC50" />
            <Stop offset="55%" stopColor="#C89020" />
            <Stop offset="80%" stopColor="#7A5808" />
            <Stop offset="92%" stopColor="#C09020" />
            <Stop offset="100%" stopColor="#F5D060" />
          </RadialGradient>
          {/* セパレートリング */}
          <RadialGradient id={srId} cx="50%" cy="28%" r="55%">
            <Stop offset="0%" stopColor="#F8E888" />
            <Stop offset="30%" stopColor="#C89828" />
            <Stop offset="70%" stopColor="#8A6410" />
            <Stop offset="100%" stopColor="#D4A430" />
          </RadialGradient>
          {/* 漆面 */}
          <RadialGradient id={fcId} cx="42%" cy="32%" r="60%">
            <Stop offset="0%" stopColor="#3E2010" />
            <Stop offset="40%" stopColor="#200E06" />
            <Stop offset="70%" stopColor="#120804" />
            <Stop offset="88%" stopColor="#0A0402" />
            <Stop offset="100%" stopColor="#060200" />
          </RadialGradient>
          {/* 面グロー */}
          <RadialGradient id={fgId} cx="45%" cy="38%" r="55%">
            <Stop offset="0%" stopColor="#8A5820" stopOpacity="0.3" />
            <Stop offset="100%" stopColor="#8A5820" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* ドロップシャドウ */}
        <Circle cx={R + 1} cy={R + 3} r={R - 1} fill="black" opacity={0.45} />
        {/* 外側ゴールドリング */}
        <Circle cx={R} cy={R} r={R - 1} fill={`url(#${ogId})`} />
        {/* リングハイライト */}
        <Ellipse
          cx={R - 5}
          cy={R - 11}
          rx={R * 0.55}
          ry={R * 0.35}
          fill="white"
          opacity={0.12}
        />
        {/* ナーリング（外） */}
        <Circle
          cx={R} cy={R} r={R - 3}
          fill="none" stroke="#FFF8A0" strokeWidth={0.5} opacity={0.25}
        />
        {/* セパレートリング幅8px */}
        <Circle cx={R} cy={R} r={R - 9} fill={`url(#${srId})`} />
        <Circle
          cx={R} cy={R} r={R - 10}
          fill="none" stroke="#FFF0A0" strokeWidth={0.5} opacity={0.3}
        />
        {/* 漆フェイス */}
        <Circle cx={R} cy={R} r={R - 15} fill={`url(#${fcId})`} />
        <Circle cx={R} cy={R} r={R - 15} fill={`url(#${fgId})`} />
        {/* スペキュラーハイライト */}
        <Ellipse
          cx={R - 6} cy={R - 13}
          rx={13} ry={8}
          fill="white" opacity={0.07}
        />
        {/* インナーディテールリング */}
        <Circle
          cx={R} cy={R} r={R - 27}
          fill="none" stroke="#C89820" strokeWidth={1.2} opacity={0.4}
        />
        <Circle
          cx={R} cy={R} r={R - 37}
          fill="none" stroke="#8A6010" strokeWidth={0.6} opacity={0.25}
        />
        {/* アクティブグロー */}
        {isActive && (
          <Circle
            cx={R} cy={R} r={R - 1}
            fill="none" stroke="#FFE840" strokeWidth={2.5} opacity={0.85}
          />
        )}
        {/* 蒔絵センタードット */}
        <Circle cx={R} cy={R} r={4} fill="#C89820" opacity={0.5} />
        <Circle cx={R} cy={R} r={2} fill="#F8E888" opacity={0.6} />
      </Svg>

      {/* テキストオーバーレイ（pointer-eventsをnoneにしてタッチ透過） */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.textContainer}>
          <Text style={[styles.label, isActive && styles.labelActive]}>
            {string.label}
          </Text>
          <Text style={[styles.noteName, isActive && styles.noteNameActive]}>
            {string.noteName}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

type StringPlayButtonsProps = {
  activeStringId: string | null;
  baseNoteId: string;
  tuningModeId: string;
  isAutoPlaying: boolean;
  onStringToggle: (stringId: string) => void;
};

export const StringPlayButtons: React.FC<StringPlayButtonsProps> = ({
  activeStringId,
  baseNoteId,
  tuningModeId,
  isAutoPlaying,
  onStringToggle,
}) => {
  const stringNotes = useMemo(() => {
    return SHAMISEN_STRINGS.map((string) => ({
      ...string,
      noteName: getStringNoteName(string.id, baseNoteId, tuningModeId),
    }));
  }, [baseNoteId, tuningModeId]);

  return (
    <View style={styles.container}>
      {stringNotes.map((string) => (
        <StringButton
          key={string.id}
          string={string}
          isActive={activeStringId === string.id}
          isAutoPlaying={isAutoPlaying}
          onPress={() => onStringToggle(string.id)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  buttonWrapper: {
    width: SIZE,
    height: SIZE,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FONT_SIZES.md,
    color: '#d8bd8a',
    fontFamily: 'serif',
  },
  labelActive: {
    color: '#ffdf91',
  },
  noteName: {
    fontSize: FONT_SIZES.xxl,
    color: '#c6a265',
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginTop: 2,
  },
  noteNameActive: {
    color: '#ffdf91',
    textShadowColor: 'rgba(255, 223, 145, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
});
