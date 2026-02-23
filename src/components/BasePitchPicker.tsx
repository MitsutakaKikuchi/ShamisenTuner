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
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Ellipse,
  Polygon,
  Defs,
  RadialGradient,
  LinearGradient as SvgLinearGradient,
  Stop,
} from 'react-native-svg';
import type { BaseNote } from '../constants/tuningData';

const ITEM_HEIGHT = 56;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const CAP_W = 44;

/** 左右の鼓胴エンドキャップ SVG */
const DrumCap: React.FC<{ side: 'left' | 'right' }> = ({ side }) => {
  const CY = PICKER_HEIGHT / 2;
  const RY = PICKER_HEIGHT / 2 - 2;
  const isLeft = side === 'left';
  // 左：エリプスは右寄り(cx=CAP_W-4)、右：左寄り(cx=4)
  const ecx = isLeft ? CAP_W - 4 : 4;
  const rimCx = isLeft ? CAP_W + 6 : -6;
  // 矢印の向き
  const arrowPoints = isLeft
    ? `${CAP_W - 14},${CY - 10} ${CAP_W - 6},${CY} ${CAP_W - 14},${CY + 10}`
    : `${14},${CY - 10} ${6},${CY} ${14},${CY + 10}`;
  return (
    <Svg width={CAP_W} height={PICKER_HEIGHT}>
      <Defs>
        <RadialGradient id={`cap_rw_${side}`} cx="50%" cy="25%" r="65%">
          <Stop offset="0%"   stopColor="#7A4428" />
          <Stop offset="20%"  stopColor="#5C2E18" />
          <Stop offset="50%"  stopColor="#3E1C0C" />
          <Stop offset="75%"  stopColor="#2A1008" />
          <Stop offset="100%" stopColor="#0A0402" />
        </RadialGradient>
        <SvgLinearGradient id={`cap_gold_${side}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%"   stopColor="#FFF0A0" />
          <Stop offset="20%"  stopColor="#F0CC50" />
          <Stop offset="50%"  stopColor="#C89820" />
          <Stop offset="75%"  stopColor="#E8B828" />
          <Stop offset="100%" stopColor="#D4A428" />
        </SvgLinearGradient>
      </Defs>
      {/* 漆胴体エリプス */}
      <Ellipse cx={ecx} cy={CY} rx={22} ry={RY} fill={`url(#cap_rw_${side})`} />
      {/* 金箔リム */}
      <Ellipse cx={rimCx} cy={CY} rx={8} ry={RY - 2} fill={`url(#cap_gold_${side})`} />
      {/* 矢印 */}
      <Polygon points={arrowPoints} fill="#C89820" opacity={0.9} />
    </Svg>
  );
};

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
        {/* 左キャップ（鼓胴 漆+金箔） */}
        <View style={styles.capLeft}>
          <DrumCap side="left" />
        </View>

        {/* メインロール部 */}
        <View style={styles.pickerFrame}>
          {/* 選択行インジケーター（ゴールドグラデーション） */}
          <LinearGradient
            colors={['#c6a265', '#dfc78a', '#c6a265']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.selectionIndicator}
          />
          
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
          <LinearGradient
            colors={['#4A2C10', 'rgba(74, 44, 16, 0)']}
            style={styles.fadeTop}
            pointerEvents="none"
          />
          <LinearGradient
            colors={['rgba(74, 44, 16, 0)', '#4A2C10']}
            style={styles.fadeBottom}
            pointerEvents="none"
          />
        </View>

        {/* 右キャップ（鼓胴 漆+金箔） */}
        <View style={styles.capRight}>
          <DrumCap side="right" />
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
    width: CAP_W,
    height: PICKER_HEIGHT,
    overflow: 'hidden',
  },
  capRight: {
    width: CAP_W,
    height: PICKER_HEIGHT,
    overflow: 'hidden',
  },
  pickerFrame: {
    height: PICKER_HEIGHT,
    width: 220,
    borderWidth: 2,
    borderColor: COLORS.borderGold,
    overflow: 'hidden',
    backgroundColor: '#8B5E2A', // 木目（ローズウッド風）
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
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
    fontSize: FONT_SIZES.xl,
    color: '#D4A860',
    opacity: 0.55,
    fontFamily: 'serif',
  },
  itemHonSuuSelected: {
    color: '#FFF8D0',
    opacity: 1,
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  itemNote: {
    fontSize: FONT_SIZES.lg,
    color: '#C89840',
    opacity: 0.5,
    fontFamily: 'serif',
  },
  itemNoteSelected: {
    color: '#F5E898',
    opacity: 1,
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  fadeTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
  },
  fadeBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT * 1.5,
  },
});
