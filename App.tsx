/**
 * 三味線調弦アプリ メインコンポーネント
 *
 * 設計原則:
 * - 早期リターン（ガード節）の徹底
 * - indexフリー（オブジェクトID）のデータ管理
 * - コンポーネント分割による責務の明確化
 */

import { StatusBar } from 'expo-status-bar';
import { useKeepAwake } from 'expo-keep-awake';
import { useState, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';

import { Header } from './src/components/Header';
import { CalibrationControl } from './src/components/CalibrationControl';
import { BasePitchPicker } from './src/components/BasePitchPicker';
import { FineTuneControl } from './src/components/FineTuneControl';
import { TuningModeSelector } from './src/components/TuningModeSelector';
import { AutoPlayToggle } from './src/components/AutoPlayToggle';
import { StringPlayButtons } from './src/components/StringPlayButtons';
import { Footer } from './src/components/Footer';
import { BackgroundStrings } from './src/components/BackgroundStrings';

import {
  BASE_NOTES,
  TUNING_MODES,
  DEFAULT_CALIBRATION_HZ,
  DEFAULT_BASE_NOTE_ID,
  DEFAULT_TUNING_MODE_ID,
  DEFAULT_FINE_TUNE_CENTS,
  CALIBRATION_STEP_HZ,
  CALIBRATION_MIN_HZ,
  CALIBRATION_MAX_HZ,
} from './src/constants/tuningData';
import { COLORS } from './src/constants/theme';
import { calculateStringFrequency, calculateBaseFrequency } from './src/utils/frequencyCalculator';
import { useAutoPlay } from './src/hooks/useAutoPlay';
import type { AppState } from './src/types/appState';

// ネイティブモジュール（Web/ネイティブ自動切替）
import ShamisenAudioModule from './modules/shamisen-audio';

export default function App() {
  // 画面スリープ防止（アプリ起動中は常にON）
  useKeepAwake();

  // === 状態管理 ===
  const [appState, setAppState] = useState<AppState>({
    calibrationHz: DEFAULT_CALIBRATION_HZ,
    baseNoteId: DEFAULT_BASE_NOTE_ID,
    fineTuneCents: DEFAULT_FINE_TUNE_CENTS,
    tuningModeId: DEFAULT_TUNING_MODE_ID,
    isAutoPlaying: false,
    activeStringId: null,
  });

  // === イベントハンドラ（useCallbackでメモ化） ===

  // 基準ピッチ: 減少
  const handleCalibrationDecrease = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      calibrationHz: Math.max(CALIBRATION_MIN_HZ, prev.calibrationHz - CALIBRATION_STEP_HZ),
    }));
  }, []);

  // 基準ピッチ: 増加
  const handleCalibrationIncrease = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      calibrationHz: Math.min(CALIBRATION_MAX_HZ, prev.calibrationHz + CALIBRATION_STEP_HZ),
    }));
  }, []);

  // 基音選択
  const handleBaseNoteChange = useCallback((noteId: string) => {
    setAppState((prev) => ({ ...prev, baseNoteId: noteId }));
  }, []);

  // 微調整（離散ステップ）
  const handleFineTuneChange = useCallback((value: number) => {
    setAppState((prev) => ({ ...prev, fineTuneCents: value }));
  }, []);

  // 調弦モード切替
  const handleTuningModeChange = useCallback((modeId: string) => {
    setAppState((prev) => ({ ...prev, tuningModeId: modeId }));
  }, []);

  // 自動再生トグル
  const handleAutoPlayToggle = useCallback(() => {
    setAppState((prev) => ({ ...prev, isAutoPlaying: !prev.isAutoPlaying }));
  }, []);

  // 自動再生フックからの糸変更コールバック
  const handleAutoPlayStringChange = useCallback((stringId: string | null) => {
    setAppState((prev) => ({ ...prev, activeStringId: stringId }));
  }, []);

  // 糸をタップした時（トグル再生：タップで鳴り始め、再タップで止まる）
  const handleStringToggle = useCallback(
    (stringId: string) => {
      // 早期リターン: 自動再生中は手動操作をブロック
      if (appState.isAutoPlaying) {
        return;
      }

      // 同じ糸を再タップ → 音を止める
      if (appState.activeStringId === stringId) {
        try {
          ShamisenAudioModule.stopTone();
          setAppState((prev) => ({ ...prev, activeStringId: null }));
        } catch (error) {
          console.error('音の停止に失敗:', error);
        }
        return;
      }

      // 基音周波数を計算
      const baseFrequency = calculateBaseFrequency(
        appState.baseNoteId,
        appState.calibrationHz,
        appState.fineTuneCents
      );
      // 早期リターン: 計算失敗
      if (!baseFrequency) {
        console.error('基音周波数の計算に失敗');
        return;
      }

      // 糸の周波数を計算
      const frequency = calculateStringFrequency(
        stringId,
        baseFrequency,
        appState.tuningModeId
      );
      // 早期リターン: 計算失敗
      if (!frequency) {
        console.error('糸の周波数の計算に失敗');
        return;
      }

      // 音を再生
      try {
        ShamisenAudioModule.playTone(frequency);
        setAppState((prev) => ({ ...prev, activeStringId: stringId }));
      } catch (error) {
        console.error('音の再生に失敗:', error);
      }
    },
    [
      appState.isAutoPlaying,
      appState.activeStringId,
      appState.baseNoteId,
      appState.calibrationHz,
      appState.fineTuneCents,
      appState.tuningModeId,
    ]
  );

  // === 自動再生フック ===
  useAutoPlay({
    isAutoPlaying: appState.isAutoPlaying,
    baseNoteId: appState.baseNoteId,
    tuningModeId: appState.tuningModeId,
    calibrationHz: appState.calibrationHz,
    fineTuneCents: appState.fineTuneCents,
    onStringChange: handleAutoPlayStringChange,
  });

  // === レンダリング ===
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      {/* 背景の3本金色絃 */}
      <BackgroundStrings />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* ヘッダー */}
          <Header />

          {/* 基準ピッチ調整 + 調子笛 */}
          <CalibrationControl
            calibrationHz={appState.calibrationHz}
            onDecrease={handleCalibrationDecrease}
            onIncrease={handleCalibrationIncrease}
          />

          {/* 基音選択ドラムロール */}
          <BasePitchPicker
            notes={BASE_NOTES}
            selectedNoteId={appState.baseNoteId}
            onNoteChange={handleBaseNoteChange}
          />

          {/* 微調整（5段階ステップ） */}
          <FineTuneControl
            fineTuneCents={appState.fineTuneCents}
            onValueChange={handleFineTuneChange}
          />

          {/* 調弦モード選択 */}
          <TuningModeSelector
            modes={TUNING_MODES}
            selectedModeId={appState.tuningModeId}
            onModeChange={handleTuningModeChange}
          />

          {/* 自動再生トグル */}
          <AutoPlayToggle
            isAutoPlaying={appState.isAutoPlaying}
            onToggle={handleAutoPlayToggle}
          />

          {/* 糸の再生ボタン（トグル方式） */}
          <View style={styles.stringSection}>
            <StringPlayButtons
              activeStringId={appState.activeStringId}
              baseNoteId={appState.baseNoteId}
              tuningModeId={appState.tuningModeId}
              isAutoPlaying={appState.isAutoPlaying}
              onStringToggle={handleStringToggle}
            />
          </View>

          {/* フッター */}
          <Footer />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundDark,
  },
  scrollContent: {
    flexGrow: 1,
  },
  stringSection: {
    paddingVertical: 24,
  },
});
