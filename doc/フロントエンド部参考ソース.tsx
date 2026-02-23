import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, ScrollView, SafeAreaView } from 'react-native';

// データはオブジェクト単位で定義し、indexへの依存を排除
const TUNING_MODES = [
  { id: 'honchoshi', label: '本調子' },
  { id: 'niagari', label: '二上り' },
  { id: 'sansagari', label: '三下り' },
];

const SHAMISEN_STRINGS = [
  { id: 'string_1', label: '一の糸', note: 'D' },
  { id: 'string_2', label: '二の糸', note: 'G' },
  { id: 'string_3', label: '三の糸', note: "D'" },
];

const BASE_NOTES = [
  { id: 'note_3', jp: '三本', note: 'B' },
  { id: 'note_4', jp: '四本', note: 'C' },
  { id: 'note_5', jp: '五本', note: 'C#' },
];

export default function App() {
  const [basePitch, setBasePitch] = useState(440);
  const [activeModeId, setActiveModeId] = useState(TUNING_MODES[0].id);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // --- ハンドラ（早期リターンを適用） ---
  const handlePitchChange = (amount: number) => {
    if (amount === 0) return;
    setBasePitch(prev => prev + amount);
  };

  const handleModeSelect = (mode: typeof TUNING_MODES[0]) => {
    if (!mode) return;
    if (activeModeId === mode.id) return;
    setActiveModeId(mode.id);
  };

  const handleStringPlay = (stringData: typeof SHAMISEN_STRINGS[0]) => {
    if (!stringData) return;
    // TODO: ここで作成した音声モジュール(playTone)を呼び出す
    console.log(`Play: ${stringData.label}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 構図としての美しさを演出する、中央に配置された3本の絃（背景装飾） */}
      <View style={styles.backgroundStringsContainer}>
        {SHAMISEN_STRINGS.map(stringData => (
          <View key={`line_${stringData.id}`} style={styles.backgroundStringLine} />
        ))}
      </View>

      <View style={styles.content}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Text style={styles.title}>三味線 調弦</Text>
        </View>

        {/* 基準ピッチ設定 */}
        <View style={styles.pitchControl}>
          <Text style={styles.pitchText}>基準 A={basePitch}Hz</Text>
          <TouchableOpacity onPress={() => handlePitchChange(-1)} style={styles.pitchBtn}>
            <Text style={styles.pitchBtnText}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handlePitchChange(1)} style={styles.pitchBtn}>
            <Text style={styles.pitchBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* 基音ピッカー（ドラムロール風） */}
        <View style={styles.pickerContainer}>
          <ScrollView showsVerticalScrollIndicator={false} snapToInterval={60}>
            {BASE_NOTES.map(note => (
              <View key={note.id} style={styles.pickerItem}>
                <Text style={styles.pickerJp}>{note.jp}</Text>
                <Text style={styles.pickerNote}>{note.note}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 微調整 */}
        <View style={styles.fineTuneContainer}>
          <Text style={styles.fineTuneLabel}>微調整</Text>
          <View style={styles.fineTuneMarks}>
            <Text style={styles.fineTuneText}>-1/4</Text>
            <Text style={styles.fineTuneText}>0</Text>
            <Text style={styles.fineTuneText}>+1/4</Text>
          </View>
        </View>

        {/* 調弦モード選択 */}
        <View style={styles.modeContainer}>
          {TUNING_MODES.map(mode => (
            <TouchableOpacity 
              key={mode.id} 
              style={[styles.modeBtn, activeModeId === mode.id && styles.activeModeBtn]}
              onPress={() => handleModeSelect(mode)}
            >
              <Text style={[styles.modeText, activeModeId === mode.id && styles.activeModeText]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* 自動再生 */}
        <View style={styles.autoPlayContainer}>
          <Text style={styles.autoPlayText}>自動再生 (アルペジオ)</Text>
          <Switch value={isAutoPlay} onValueChange={setIsAutoPlay} trackColor={{ true: '#66bb6a' }} />
        </View>

        {/* 糸再生ボタン */}
        <View style={styles.stringsContainer}>
          {SHAMISEN_STRINGS.map(stringData => (
            <TouchableOpacity 
              key={stringData.id} 
              style={styles.stringBtn}
              onPress={() => handleStringPlay(stringData)}
            >
              <Text style={styles.stringBtnLabel}>{stringData.label}</Text>
              <Text style={styles.stringBtnNote}>{stringData.note}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.footerText}>純正律調弦</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2d1810', // 深みのある木目調カラー
  },
  backgroundStringsContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingHorizontal: 40,
    opacity: 0.15,
  },
  backgroundStringLine: {
    width: 2,
    backgroundColor: '#d4af37', // 金糸をイメージ
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
  },
  title: {
    fontSize: 28,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  pitchControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pitchText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
  },
  pitchBtn: {
    backgroundColor: '#4a3022',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  pitchBtnText: {
    color: '#d4af37',
    fontSize: 18,
  },
  pickerContainer: {
    height: 120,
    backgroundColor: '#d2b48c',
    borderRadius: 15,
    marginVertical: 20,
    borderWidth: 2,
    borderColor: '#8b4513',
    overflow: 'hidden',
  },
  pickerItem: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  pickerJp: {
    fontSize: 20,
    color: '#3e2723',
  },
  pickerNote: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3e2723',
  },
  fineTuneContainer: {
    alignItems: 'center',
  },
  fineTuneLabel: {
    color: '#fff',
    marginBottom: 5,
  },
  fineTuneMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
  fineTuneText: {
    color: '#aaa',
    fontSize: 12,
  },
  modeContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#d4af37',
    borderRadius: 8,
    overflow: 'hidden',
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: '#3e2723',
  },
  activeModeBtn: {
    backgroundColor: '#d4af37',
  },
  modeText: {
    color: '#d4af37',
    fontSize: 16,
  },
  activeModeText: {
    color: '#3e2723',
    fontWeight: 'bold',
  },
  autoPlayContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
  },
  autoPlayText: {
    color: '#fff',
    fontSize: 14,
  },
  stringsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  stringBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#d4af37',
    backgroundColor: '#1a0f0a',
    alignItems: 'center',
    justifyContent: 'center',
    // 背景の絃と重なる美しい配置のためのシャドウ
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  stringBtnLabel: {
    color: '#ccc',
    fontSize: 12,
  },
  stringBtnNote: {
    color: '#d4af37',
    fontSize: 24,
    fontWeight: 'bold',
  },
  footerText: {
    color: '#888',
    textAlign: 'center',
    fontSize: 12,
  },
});