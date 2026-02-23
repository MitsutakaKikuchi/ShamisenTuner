/**
 * 糸の再生ボタンコンポーネント
 * 3つの糸（一の糸、二の糸、三の糸）を横並びに配置
 * 押している間だけ音が鳴り、視覚フィードバックあり
 */

import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { COLORS, FONT_SIZES, SPACING, BORDER_RADIUS } from '../constants/theme';
import { SHAMISEN_STRINGS } from '../constants/tuningData';
import { getStringNoteName } from '../utils/noteNameHelper';

type StringPlayButtonsProps = {
  activeStringId: string | null;
  baseNoteId: string;
  tuningModeId: string;
  isAutoPlaying: boolean;
  onStringPressIn: (stringId: string) => void;
  onStringPressOut: () => void;
};

export const StringPlayButtons: React.FC<StringPlayButtonsProps> = ({
  activeStringId,
  baseNoteId,
  tuningModeId,
  isAutoPlaying,
  onStringPressIn,
  onStringPressOut,
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
          <Pressable
            key={string.id}
            style={[
              styles.button,
              isActive && styles.buttonActive,
              isAutoPlaying && !isActive && styles.buttonDisabled,
            ]}
            onPressIn={() => onStringPressIn(string.id)}
            onPressOut={onStringPressOut}
            disabled={false}
          >
            <View style={[styles.buttonInner, isActive && styles.buttonInnerActive]}>
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {string.label}
              </Text>
              <Text style={[styles.noteName, isActive && styles.noteNameActive]}>
                {string.noteName}
              </Text>
            </View>
          </Pressable>
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
    maxWidth: 120,
    aspectRatio: 1,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: COLORS.borderGold,
    backgroundColor: COLORS.surface,
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
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInnerActive: {
    // アクティブ時の追加スタイル（将来拡張用）
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
    color: COLORS.textBright,
  },
  noteNameActive: {
    color: COLORS.textWhite,
  },
});
