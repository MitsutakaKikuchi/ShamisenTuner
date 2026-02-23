/**
 * 基音選択ピッカー（ドラムロール風）
 * 上下スワイプでスクロールし、中央の項目を選択状態にする
 */

import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  type ViewToken,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import type { BaseNote } from '../constants/tuningData';

const ITEM_HEIGHT = 60;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

type BasePitchPickerProps = {
  notes: BaseNote[];
  selectedNoteId: string;
  onNoteChange: (noteId: string) => void;
};

export const BasePitchPicker: React.FC<BasePitchPickerProps> = ({
  notes,
  selectedNoteId,
  onNoteChange,
}) => {
  const flatListRef = useRef<FlatList>(null);
  
  // 選択中のindexを算出
  const selectedIndex = useMemo(() => {
    const idx = notes.findIndex((note) => note.id === selectedNoteId);
    return idx >= 0 ? idx : 0;
  }, [notes, selectedNoteId]);

  // スクロール終了時に中央の項目を選択
  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const index = Math.round(offsetY / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(notes.length - 1, index));
      const targetNote = notes[clampedIndex];
      
      if (!targetNote) {
        return;
      }
      
      if (targetNote.id !== selectedNoteId) {
        onNoteChange(targetNote.id);
      }
    },
    [notes, selectedNoteId, onNoteChange]
  );

  // 項目タップ時のハンドラ
  const handleItemPress = useCallback(
    (noteId: string, index: number) => {
      onNoteChange(noteId);
      flatListRef.current?.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated: true,
      });
    },
    [onNoteChange]
  );

  // 各項目のレンダリング
  const renderItem = useCallback(
    ({ item, index }: { item: BaseNote; index: number }) => {
      const isSelected = item.id === selectedNoteId;
      return (
        <TouchableOpacity
          style={[styles.item, isSelected && styles.itemSelected]}
          onPress={() => handleItemPress(item.id, index)}
          activeOpacity={0.7}
        >
          <Text style={[styles.itemHonSuu, isSelected && styles.itemTextSelected]}>
            {item.honSuu}
          </Text>
          <Text style={[styles.itemNote, isSelected && styles.itemNoteSelected]}>
            {item.note}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedNoteId, handleItemPress]
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      {/* 装飾ボーダー（左右） */}
      <View style={styles.pickerFrame}>
        {/* 選択インジケーター */}
        <View style={styles.selectionIndicator} />
        
        <FlatList
          ref={flatListRef}
          data={notes}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          getItemLayout={getItemLayout}
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          decelerationRate="fast"
          onMomentumScrollEnd={handleMomentumScrollEnd}
          initialScrollIndex={selectedIndex}
          contentContainerStyle={{
            paddingVertical: ITEM_HEIGHT * 2, // 上下のパディングで中央配置
          }}
        />

        {/* 上下グラデーション風のオーバーレイ */}
        <View style={styles.fadeTop} pointerEvents="none" />
        <View style={styles.fadeBottom} pointerEvents="none" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  pickerFrame: {
    height: PICKER_HEIGHT,
    width: 200,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundMedium,
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: COLORS.surfaceActive,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.borderBright,
    zIndex: -1,
  },
  item: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  itemSelected: {
    // スタイルは selectionIndicator で表現
  },
  itemHonSuu: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textMuted,
  },
  itemNote: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  itemTextSelected: {
    color: COLORS.textPrimary,
  },
  itemNoteSelected: {
    color: COLORS.textBright,
    fontSize: FONT_SIZES.hero,
    fontWeight: 'bold',
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
    backgroundColor: COLORS.backgroundMedium,
    opacity: 0.6,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
    backgroundColor: COLORS.backgroundMedium,
    opacity: 0.6,
  },
});
