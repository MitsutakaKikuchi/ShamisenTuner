/**
 * 三味線の周波数計算ロジック
 * 純粋関数として実装し、テスト・保守を容易にする
 */

import { BASE_NOTES, TUNING_MODES } from '../constants/tuningData';

/**
 * 一の糸（基音）の周波数を計算
 * 
 * @param baseNoteId - 基音ID（例: 'note_d4'）
 * @param calibrationHz - 基準ピッチ（A4の周波数、例: 440）
 * @param fineTuneCents - 微調整のセント値（100セント = 1半音）
 * @returns 周波数（Hz）、計算失敗時はnull
 */
export const calculateBaseFrequency = (
  baseNoteId: string,
  calibrationHz: number,
  fineTuneCents: number
): number | null => {
  // 早期リターン: 無効な基準ピッチ
  if (calibrationHz <= 0) {
    return null;
  }

  // 早期リターン: 基音データが見つからない
  const baseNote = BASE_NOTES.find((note) => note.id === baseNoteId);
  if (!baseNote) {
    return null;
  }

  // 周波数計算
  // f = f0 × 2^(n/12)
  // f0: A4の周波数, n: A4からの半音数 + セント値/100
  const semitones = baseNote.semitonesFromA4 + fineTuneCents / 100;
  const frequency = calibrationHz * Math.pow(2, semitones / 12);

  return frequency;
};

/**
 * 指定した糸の周波数を計算
 * 
 * @param stringId - 糸ID（'string_1', 'string_2', 'string_3'）
 * @param baseFrequency - 一の糸の周波数（Hz）
 * @param tuningModeId - 調弦モードID（例: 'honchoshi'）
 * @returns 周波数（Hz）、計算失敗時はnull
 */
export const calculateStringFrequency = (
  stringId: string,
  baseFrequency: number,
  tuningModeId: string
): number | null => {
  // 早期リターン: 無効な基音周波数
  if (baseFrequency <= 0) {
    return null;
  }

  // 早期リターン: 調弦モードが見つからない
  const tuningMode = TUNING_MODES.find((mode) => mode.id === tuningModeId);
  if (!tuningMode) {
    return null;
  }

  // 糸IDから比率を取得
  let ratio: number;
  switch (stringId) {
    case 'string_1':
      ratio = tuningMode.ratios.string1;
      break;
    case 'string_2':
      ratio = tuningMode.ratios.string2;
      break;
    case 'string_3':
      ratio = tuningMode.ratios.string3;
      break;
    default:
      // 早期リターン: 不正な糸ID
      return null;
  }

  return baseFrequency * ratio;
};

/**
 * 全ての糸の周波数を一度に計算
 * 
 * @param baseNoteId - 基音ID
 * @param tuningModeId - 調弦モードID
 * @param calibrationHz - 基準ピッチ
 * @param fineTuneCents - 微調整のセント値
 * @returns 各糸とその周波数の配列、計算失敗時は空配列
 */
export const calculateAllStringFrequencies = (
  baseNoteId: string,
  tuningModeId: string,
  calibrationHz: number,
  fineTuneCents: number
): Array<{ stringId: string; frequency: number }> => {
  // 一の糸の周波数を計算
  const baseFrequency = calculateBaseFrequency(
    baseNoteId,
    calibrationHz,
    fineTuneCents
  );

  // 早期リターン: 基音周波数の計算に失敗
  if (!baseFrequency) {
    return [];
  }

  // 各糸の周波数を計算
  const stringIds = ['string_1', 'string_2', 'string_3'];
  const results = stringIds
    .map((stringId) => {
      const frequency = calculateStringFrequency(
        stringId,
        baseFrequency,
        tuningModeId
      );
      
      // 計算失敗した糸は除外
      if (!frequency) {
        return null;
      }

      return { stringId, frequency };
    })
    .filter((result): result is { stringId: string; frequency: number } => 
      result !== null
    );

  return results;
};
