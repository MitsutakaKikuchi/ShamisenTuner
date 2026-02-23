/**
 * 基音選択ピッカー（3D木製樽風ドラムロール）
 * 上下スワイプでスクロールし、中央の項目を選択状態にする
 * 選択行はゴールドグラデーション背景、上下はフェードアウト
 * 左右にゴールド装飾キャップと三角矢印を配置
 */

import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { COLORS, FONT_SIZES, SPACING } from '../constants/theme';
import type { BaseNote } from '../constants/tuningData';

const ITEM_HEIGHT = 56;
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
          <Text style={[styles.itemHonSuu, isSelected && styles.itemHonSuuSelected]}>
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
      <View style={styles.pickerWrapper}>
        {/* 左キャップ（木製装飾） */}
        <View style={styles.capLeft}>
          <Text style={styles.capArrow}>▶</Text>
        </View>

        {/* メインロール部 */}
        <View style={styles.pickerFrame}>
          {/* 選択行インジケーター（ゴールドハイライト） */}
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
              paddingVertical: ITEM_HEIGHT * 2,
            }}
          />

          {/* 上下フェードオーバーレイ */}
          <View style={styles.fadeTop} pointerEvents="none" />
          <View style={styles.fadeBottom} pointerEvents="none" />
        </View>

        {/* 右キャップ（木製装飾） */}
        <View style={styles.capRight}>
          <Text style={styles.capArrow}>◀</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capLeft: {
    width: 28,
    height: PICKER_HEIGHT,
    backgroundColor: COLORS.backgroundLight,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 2,
    borderRightWidth: 0,
    borderColor: COLORS.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capRight: {
    width: 28,
    height: PICKER_HEIGHT,
    backgroundColor: COLORS.backgroundLight,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 2,
    borderLeftWidth: 0,
    borderColor: COLORS.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capArrow: {
    fontSize: 10,
    color: COLORS.gold,
    opacity: 0.8,
  },
  pickerFrame: {
    height: PICKER_HEIGHT,
    width: 220,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    overflow: 'hidden',
    backgroundColor: '#D2B48C', // 白木（ヒノキ風）
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: COLORS.gold,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.goldBright,
    zIndex: -1,
  },
  item: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  itemSelected: {
    // スタイルは selectionIndicator のゴールド背景で表現
  },
  itemHonSuu: {
    fontSize: FONT_SIZES.lg,
    color: '#5D4037',
    opacity: 0.6,
  },
  itemHonSuuSelected: {
    color: '#3E2723',
    opacity: 1,
    fontWeight: '600',
  },
  itemNote: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    color: '#5D4037',
    opacity: 0.6,
  },
  itemNoteSelected: {
    color: '#3E2723',
    opacity: 1,
    fontSize: 30,
    fontWeight: 'bold',
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
    backgroundColor: '#D2B48C',
    opacity: 0.5,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
    backgroundColor: '#D2B48C',
    opacity: 0.5,
  },
});
