/**
 * 三味線調弦アプリの定数定義
 * indexへの依存を排除し、オブジェクト単位でデータを管理
 */

export type BaseNote = {
  id: string;
  honSuu: string; // 「三本」「四本」など
  note: string;   // 'B', 'C', 'C#'など
  semitonesFromA4: number; // A4からの半音数（下がる場合はマイナス）
};

export type TuningMode = {
  id: string;
  label: string;
  ratios: {
    string1: number; // 一の糸（基準なので常に1）
    string2: number; // 二の糸の純正律比率
    string3: number; // 三の糸の純正律比率
  };
};

export type ShamisenString = {
  id: string;
  label: string;
  noteLabel: string; // 'D', 'G', "D'"など（表示用）
};

// 基音データ（一本〜八本の範囲: A3〜E4）
export const BASE_NOTES: BaseNote[] = [
  { id: 'note_a3',  honSuu: '一本', note: 'A',  semitonesFromA4: -12 },
  { id: 'note_bb3', honSuu: '二本', note: 'B♭', semitonesFromA4: -11 },
  { id: 'note_b3',  honSuu: '三本', note: 'B',  semitonesFromA4: -10 },
  { id: 'note_c4',  honSuu: '四本', note: 'C',  semitonesFromA4: -9 },
  { id: 'note_cs4', honSuu: '五本', note: 'C#', semitonesFromA4: -8 },
  { id: 'note_d4',  honSuu: '六本', note: 'D',  semitonesFromA4: -7 },
  { id: 'note_ds4', honSuu: '七本', note: 'D#', semitonesFromA4: -6 },
  { id: 'note_e4',  honSuu: '八本', note: 'E',  semitonesFromA4: -5 },
];

// 調弦モード（純正律の比率）
export const TUNING_MODES: TuningMode[] = [
  {
    id: 'honchoshi',
    label: '本調子',
    ratios: {
      string1: 1,
      string2: 4 / 3,  // 完全4度
      string3: 2,      // 完全8度（オクターブ）
    },
  },
  {
    id: 'niagari',
    label: '二上り',
    ratios: {
      string1: 1,
      string2: 3 / 2,  // 完全5度
      string3: 2,      // 完全8度
    },
  },
  {
    id: 'sansagari',
    label: '三下り',
    ratios: {
      string1: 1,
      string2: 4 / 3,  // 完全4度
      string3: 16 / 9, // 短7度
    },
  },
];

// 糸の定義
export const SHAMISEN_STRINGS: ShamisenString[] = [
  { id: 'string_1', label: '一の糸', noteLabel: 'D' },
  { id: 'string_2', label: '二の糸', noteLabel: 'G' },
  { id: 'string_3', label: '三の糸', noteLabel: "D'" },
];

// デフォルト値
export const DEFAULT_CALIBRATION_HZ = 440;
export const DEFAULT_BASE_NOTE_ID = 'note_c4'; // 四本（C）
export const DEFAULT_TUNING_MODE_ID = 'honchoshi';
export const DEFAULT_FINE_TUNE_CENTS = 0;

// 微調整の範囲（セント） ±半音の1/2
export const FINE_TUNE_MIN_CENTS = -50; // -半音の1/2 (-50セント)
export const FINE_TUNE_MAX_CENTS = 50;  // +半音の1/2 (+50セント)
export const FINE_TUNE_STEP_CENTS = 25; // 半音の1/4刻み（25セント）

// 微調整の離散ステップ値
export const FINE_TUNE_STEPS = [
  { value: -50,  label: '-1/2' }, // 半音の-1/2 (-50セント)
  { value: -25,  label: '-1/4' }, // 半音の-1/4 (-25セント)
  { value: 0,    label: '0' },
  { value: 25,   label: '+1/4' }, // 半音の+1/4 (+25セント)
  { value: 50,   label: '+1/2' }, // 半音の+1/2 (+50セント)
] as const;

// キャリブレーションの範囲
export const CALIBRATION_MIN_HZ = 430;
export const CALIBRATION_MAX_HZ = 450;
export const CALIBRATION_STEP_HZ = 1;
