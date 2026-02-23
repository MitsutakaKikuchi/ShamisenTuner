/**
 * 糸の再生ボタンコンポーネント
 * 3つの糸（一の糸、二の糸、三の糸）を横並びに配置
 * タップで音が鳴り始め、再タップで止まる（トグル方式）
 * 発音中はゴールドのグロー効果で視覚フィードバック
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import { SHAMISEN_STRINGS } from '../constants/tuningData';
import { getStringNoteName } from '../utils/noteNameHelper';

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
  // 各糸の音名を動的に計算
  const stringNotes = useMemo(() => {
    return SHAMISEN_STRINGS.map((string) => ({
      ...string,
      noteName: getStringNoteName(string.id, baseNoteId, tuningModeId),
    }));
  }, [baseNoteId, tuningModeId]);

  return (
    <View style={styles.container}>
      {stringNotes.map((string) => {
        const isActive = activeStringId === string.id;
        return (
          <TouchableOpacity
            key={string.id}
            style={[
              styles.button,
              isActive && styles.buttonActive,
              isAutoPlaying && !isActive && styles.buttonDisabled,
            ]}
            onPress={() => onStringToggle(string.id)}
            activeOpacity={0.7}
            disabled={isAutoPlaying}
          >
            <View style={styles.buttonInner}>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {string.label}
              </Text>
              <Text style={[styles.noteName, isActive && styles.noteNameActive]}>
                {string.noteName}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  button: {
    flex: 1,
    maxWidth: 110,
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: COLORS.borderGold,
    backgroundColor: COLORS.backgroundDark,
    alignItems: 'center',
    justifyContent: 'center',
    // 影（iOS）
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    // 影（Android）
    elevation: 8,
  },
  buttonActive: {
    borderColor: COLORS.activeGlow,
    backgroundColor: COLORS.surfaceHighlight,
    shadowColor: COLORS.activeGlow,
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 12,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  labelActive: {
    color: COLORS.activeGlow,
  },
  noteName: {
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
    color: COLORS.goldBright,
  },
  noteNameActive: {
    color: COLORS.textWhite,
  },
});
