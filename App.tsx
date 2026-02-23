import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Switch } from 'react-native';
import ShamisenAudioModule from './modules/shamisen-audio';
import {
  BASE_NOTES,
  TUNING_MODES,
  SHAMISEN_STRINGS,
  DEFAULT_CALIBRATION_HZ,
  DEFAULT_BASE_NOTE_ID,
  DEFAULT_TUNING_MODE_ID,
  DEFAULT_FINE_TUNE_CENTS,
  CALIBRATION_STEP_HZ,
  FINE_TUNE_STEP_CENTS,
} from './src/constants/tuningData';
import { calculateStringFrequency, calculateBaseFrequency } from './src/utils/frequencyCalculator';
import { useAutoPlay } from './src/hooks/useAutoPlay';
import type { AppState } from './src/types/appState';

export default function App() {
  // 状態管理
  const [appState, setAppState] = useState<AppState>({
    calibrationHz: DEFAULT_CALIBRATION_HZ,
    baseNoteId: DEFAULT_BASE_NOTE_ID,
    fineTuneCents: DEFAULT_FINE_TUNE_CENTS,
    tuningModeId: DEFAULT_TUNING_MODE_ID,
    isAutoPlaying: false,
    activeStringId: null,
  });

  // 自動再生機能
  useAutoPlay({
    isAutoPlaying: appState.isAutoPlaying,
    baseNoteId: appState.baseNoteId,
    tuningModeId: appState.tuningModeId,
    calibrationHz: appState.calibrationHz,
    fineTuneCents: appState.fineTuneCents,
    onStringChange: (stringId) => {
      setAppState((prev) => ({
        ...prev,
        activeStringId: stringId,
      }));
    },
  });

  // 基準ピッチの変更
  const handleCalibrationChange = (delta: number) => {
    setAppState((prev) => ({
      ...prev,
      calibrationHz: prev.calibrationHz + delta,
    }));
  };

  // 基音の変更
  const handleBaseNoteChange = (noteId: string) => {
    setAppState((prev) => ({
      ...prev,
      baseNoteId: noteId,
    }));
  };


  // 自動再生のトグル
  const handleAutoPlayToggle = () => {
    setAppState((prev) => ({
      ...prev,
      isAutoPlaying: !prev.isAutoPlaying,
    }));
  };
  // 微調整の変更
  const handleFineTuneChange = (delta: number) => {
    setAppState((prev) => ({
      ...prev,
      fineTuneCents: Math.max(-50, Math.min(50, prev.fineTuneCents + delta)),
    }));
  };

  // 調弦モードの変更
  const handleTuningModeChange = (modeId: string) => {
    setAppState((prev) => ({
      ...prev,
      tuningModeId: modeId,
    }));
  };

  // 糸のタップ（音を鳴らす）
  const handleStringPress = (stringId: string) => {
    // 早期リターン: 自動再生中は手動操作をブロック
    if (appState.isAutoPlaying) {
      return;
    }

    // 周波数を計算
    const baseFrequency = calculateBaseFrequency(
      appState.baseNoteId,
      appState.calibrationHz,
      appState.fineTuneCents
    );

    // 早期リターン: 基音周波数の計算に失敗
    if (!baseFrequency) {
      console.error('基音周波数の計算に失敗しました');
      return;
    }

    const frequency = calculateStringFrequency(
      stringId,
      baseFrequency,
      appState.tuningModeId
    );

    // 早期リターン: 周波数の計算に失敗
    if (!frequency) {
      console.error('周波数の計算に失敗しました');
      return;
    }

    // 音を再生
    try {
      ShamisenAudioModule.playTone(frequency);
      setAppState((prev) => ({
        ...prev,
        activeStringId: stringId,
      }));
    } catch (error) {
      console.error('音の再生に失敗しました:', error);
    }
  };

  // 糸のリリース（音を止める）
  const handleStringRelease = () => {
    // 早期リターン: 自動再生中は何もしない
    if (appState.isAutoPlaying) {
      return;
    }

    try {
      ShamisenAudioModule.stopTone();
      setAppState((prev) => ({
        ...prev,
        activeStringId: null,
      }));
    } catch (error) {
      console.error('音の停止に失敗しました:', error);
    }
  };

  // 選択中の基音データを取得
  const selectedBaseNote = BASE_NOTES.find(
    (note) => note.id === appState.baseNoteId
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>三味線 調弦</Text>
        </View>

        {/* 基準ピッチ調整 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基準 A={appState.calibrationHz}Hz</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleCalibrationChange(-CALIBRATION_STEP_HZ)}
            >
              <Text style={styles.buttonText}>−</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleCalibrationChange(CALIBRATION_STEP_HZ)}
            >
              <Text style={styles.buttonText}>＋</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 基音選択 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>本數（基音）</Text>
          <View style={styles.currentNote}>
            <Text style={styles.honSuuText}>{selectedBaseNote?.honSuu}</Text>
            <Text style={styles.noteText}>{selectedBaseNote?.note}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.noteRow}>
              {BASE_NOTES.map((note) => (
                <TouchableOpacity
                  key={note.id}
                  style={[
                    styles.noteButton,
                    appState.baseNoteId === note.id && styles.noteButtonActive,
                  ]}
                  onPress={() => handleBaseNoteChange(note.id)}
                >
                  <Text style={styles.noteButtonText}>{note.honSuu}</Text>
                  <Text style={styles.noteButtonSubText}>{note.note}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* 微調整 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            微調整: {appState.fineTuneCents > 0 ? '+' : ''}{appState.fineTuneCents / 100}音
          </Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleFineTuneChange(-FINE_TUNE_STEP_CENTS)}
            >
              <Text style={styles.buttonText}>-1/4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleFineTuneChange(0 - appState.fineTuneCents)}
            >
              <Text style={styles.buttonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.smallButton}
              onPress={() => handleFineTuneChange(FINE_TUNE_STEP_CENTS)}
            >
              <Text style={styles.buttonText}>+1/4</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 調弦モード選択 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>調弦モード</Text>
          <View style={styles.buttonRow}>
            {TUNING_MODES.map((mode) => (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeButton,
                  appState.tuningModeId === mode.id && styles.modeButtonActive,
                ]}
                onPress={() => handleTuningModeChange(mode.id)}
              >
                <Text
                  style={[
                    styles.modeButtonText,
                    appState.tuningModeId === mode.id && styles.modeButtonTextActive,
                  ]}
                >
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 自動再生トグル */}
        <View style={styles.section}>
          <View style={styles.autoPlayRow}>
            <Text style={styles.sectionTitle}>自動再生（アルペジオ）</Text>
            <Switch
              value={appState.isAutoPlaying}
              onValueChange={handleAutoPlayToggle}
              trackColor={{ false: '#3a2818', true: '#8a6040' }}
              thumbColor={appState.isAutoPlaying ? '#d4a574' : '#6a5040'}
            />
          </View>
        </View>

        {/* 糸のボタン */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>糸</Text>
          <View style={styles.stringRow}>
            {SHAMISEN_STRINGS.map((string) => (
              <TouchableOpacity
                key={string.id}
                style={[
                  styles.stringButton,
                  appState.activeStringId === string.id && styles.stringButtonActive,
                ]}
                onPressIn={() => handleStringPress(string.id)}
                onPressOut={handleStringRelease}
              >
                <Text style={styles.stringLabel}>{string.label}</Text>
                <Text style={styles.stringNote}>{string.noteLabel}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c1810',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4a574',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#d4a574',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  smallButton: {
    backgroundColor: '#4a3728',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 60,
  },
  buttonText: {
    color: '#d4a574',
    fontSize: 16,
    textAlign: 'center',
  },
  currentNote: {
    alignItems: 'center',
    backgroundColor: '#4a3728',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
  },
  honSuuText: {
    fontSize: 24,
    color: '#d4a574',
    marginBottom: 5,
  },
  noteText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#f4d4a4',
  },
  noteRow: {
    flexDirection: 'row',
    gap: 10,
  },
  noteButton: {
    backgroundColor: '#3a2818',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 70,
    alignItems: 'center',
  },
  noteButtonActive: {
    backgroundColor: '#6a5040',
  },
  noteButtonText: {
    color: '#d4a574',
    fontSize: 12,
  },
  noteButtonSubText: {
    color: '#f4d4a4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modeButton: {
    backgroundColor: '#3a2818',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 8,
    flex: 1,
  },
  modeButtonActive: {
    backgroundColor: '#8a6040',
  },
  modeButtonText: {
    color: '#d4a574',
    fontSize: 16,
    textAlign: 'center',
  },
  modeButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  autoPlayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4a3728',
    padding: 15,
    borderRadius: 8,
  },
  stringRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: 10,
  },
  stringButton: {
    backgroundColor: '#4a3728',
    paddingVertical: 30,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#6a5040',
  },
  stringButtonActive: {
    backgroundColor: '#8a6040',
    borderColor: '#d4a574',
  },
  stringLabel: {
    color: '#d4a574',
    fontSize: 14,
    marginBottom: 5,
  },
  stringNote: {
    color: '#f4d4a4',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
