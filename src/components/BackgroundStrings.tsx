/**
 * 背景の3本絃（装飾）コンポーネント
 * 画面中央を縦に貫く3本の金色の糸を背景に配置
 * 三味線の糸をイメージした一体感のある構図を演出
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

export const BackgroundStrings: React.FC = () => {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={[styles.string, styles.stringLeft]} />
      <View style={[styles.string, styles.stringCenter]} />
      <View style={[styles.string, styles.stringRight]} />
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
    width: 2,
    backgroundColor: COLORS.gold,
    height: '100%',
  },
  stringLeft: {
    opacity: 0.7,
  },
  stringCenter: {
    opacity: 1.0,
    width: 2.5,
  },
  stringRight: {
    opacity: 0.7,
  },
});
