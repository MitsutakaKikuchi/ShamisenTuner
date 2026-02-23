/**
 * 背景の3本絃（装飾）コンポーネント
 * 画面中央を縦に貫く3本の金色の糸を背景に配置
 * 三味線の糸をイメージした一体感のある構図を演出
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../constants/theme';

export const BackgroundStrings: React.FC = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      <LinearGradient
        colors={['transparent', COLORS.gold, 'transparent']}
        style={[styles.string, styles.stringLeft]}
      />
      <LinearGradient
        colors={['transparent', COLORS.gold, 'transparent']}
        style={[styles.string, styles.stringCenter]}
      />
      <LinearGradient
        colors={['transparent', COLORS.gold, 'transparent']}
        style={[styles.string, styles.stringRight]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 60,
    opacity: 0.12,
  },
  string: {
    width: 1.5,
    height: '100%',
  },
  stringLeft: {
    opacity: 0.06,
  },
  stringCenter: {
    opacity: 0.1,
    width: 2,
  },
  stringRight: {
    opacity: 0.06,
  },
});
