/**
 * アプリ全体の状態管理用型定義
 */

export type AppState = {
  calibrationHz: number;      // 基準ピッチ（例: 440）
  baseNoteId: string;         // 選択中の基音ID（例: 'note_d4'）
  fineTuneCents: number;      // 微調整のセント値（例: 50 = +1/4音）
  tuningModeId: string;       // 選択中の調弦モード（例: 'honchoshi'）
  isAutoPlaying: boolean;     // 自動再生の状態
  activeStringId: string | null; // 現在発音中の糸のID（視覚フィードバック用）
};

export type StringFrequency = {
  stringId: string;
  frequency: number; // Hz
};
