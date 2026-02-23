/**
 * 自動再生機能のカスタムフック
 */

import { useEffect, useRef } from 'react';
import ShamisenAudioModule from '../../modules/shamisen-audio';
import { SHAMISEN_STRINGS } from '../constants/tuningData';
import { calculateBaseFrequency, calculateStringFrequency } from '../utils/frequencyCalculator';

type UseAutoPlayParams = {
  isAutoPlaying: boolean;
  baseNoteId: string;
  tuningModeId: string;
  calibrationHz: number;
  fineTuneCents: number;
  onStringChange: (stringId: string | null) => void;
};

export const useAutoPlay = ({
  isAutoPlaying,
  baseNoteId,
  tuningModeId,
  calibrationHz,
  fineTuneCents,
  onStringChange,
}: UseAutoPlayParams) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const currentIndexRef = useRef<number>(0);

  useEffect(() => {
    // 早期リターン: 自動再生がOFFの場合
    if (!isAutoPlaying) {
      // インターバルをクリア
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // 音を停止
      try {
        ShamisenAudioModule.stopTone();
      } catch (error) {
        console.error('音の停止に失敗:', error);
      }
      onStringChange(null);
      currentIndexRef.current = 0;
      return;
    }

    // 自動再生の開始
    const playNextString = () => {
      // 基音周波数を計算
      const baseFrequency = calculateBaseFrequency(
        baseNoteId,
        calibrationHz,
        fineTuneCents
      );

      // 早期リターン: 基音周波数の計算に失敗
      if (!baseFrequency) {
        console.error('基音周波数の計算に失敗しました');
        return;
      }

      // 現在の糸を取得
      const currentString = SHAMISEN_STRINGS[currentIndexRef.current];
      
      // 早期リターン: 糸データが存在しない
      if (!currentString) {
        return;
      }

      // 周波数を計算
      const frequency = calculateStringFrequency(
        currentString.id,
        baseFrequency,
        tuningModeId
      );

      // 早期リターン: 周波数の計算に失敗
      if (!frequency) {
        console.error('周波数の計算に失敗しました');
        return;
      }

      // 音を再生
      try {
        ShamisenAudioModule.playTone(frequency);
        onStringChange(currentString.id);
      } catch (error) {
        console.error('音の再生に失敗:', error);
      }

      // 次の糸へ（ループ）
      currentIndexRef.current = (currentIndexRef.current + 1) % SHAMISEN_STRINGS.length;
    };

    // 最初の音を即座に再生
    playNextString();

    // 1.5秒ごとに次の糸を再生
    intervalRef.current = setInterval(playNextString, 1500);

    // クリーンアップ
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [
    isAutoPlaying,
    baseNoteId,
    tuningModeId,
    calibrationHz,
    fineTuneCents,
    onStringChange,
  ]);
};
