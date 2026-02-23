/**
 * 自動再生（アルペジオ）トグルコンポーネント
 */

import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';

type AutoPlayToggleProps = {
  isAutoPlaying: boolean;
  onToggle: () => void;
};

export const AutoPlayToggle: React.FC<AutoPlayToggleProps> = ({
  isAutoPlaying,
  onToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>自動再生 (アルペジオ)</Text>
      <Switch
        value={isAutoPlaying}
        onValueChange={onToggle}
        trackColor={{ false: COLORS.switchOff, true: '#4CAF50' }}
        thumbColor={'#ffffff'}
        ios_backgroundColor={COLORS.switchOff}
      />
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
  label: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
});
