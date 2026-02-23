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
              styles.outerRing,
              isActive && styles.outerRingActive,
              isAutoPlaying && !isActive && styles.buttonDisabled,
            ]}
            onPress={() => onStringToggle(string.id)}
            activeOpacity={0.8}
            disabled={isAutoPlaying}
          >
            <View style={[styles.innerButton, isActive && styles.innerButtonActive]}>
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
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  // 画像の「太い金の縁」を模した外枠
  outerRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3a2311',
    borderWidth: 4,
    borderColor: '#c6a265',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 10,
  },
  outerRingActive: {
    borderColor: COLORS.activeGlow,
    shadowColor: COLORS.activeGlow,
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  // ボタンの内側の暗い部分
  innerButton: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#1b0e06',
    borderWidth: 1,
    borderColor: '#5a3d24',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerButtonActive: {
    backgroundColor: '#2e1c0c',
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
