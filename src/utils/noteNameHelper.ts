/**
 * 糸の音名を動的に取得するユーティリティ
 * 選択中の基音と調弦モードから、各糸の表示用音名を計算
 */

import { BASE_NOTES, TUNING_MODES } from '../constants/tuningData';

// 全12音の音名一覧（半音刻み）
const NOTE_NAMES = [
  'C', 'C#', 'D', 'E♭', 'E', 'F', 'F#', 'G', 'G#', 'A', 'B♭', 'B',
] as const;

/**
 * 半音数からA4を0とした音名とオクターブを取得
 * @param semitonesFromA4 - A4からの半音数
 * @returns 音名文字列（例: "D", "G", "D'"）
 */
const getNoteNameFromSemitones = (semitonesFromA4: number): string => {
  // A4 = 0 を基準に、Cを0番目として変換
  // A4はNOTE_NAMESのindex 9 (A)
  const noteIndex = ((semitonesFromA4 + 9) % 12 + 12) % 12;
  const noteName = NOTE_NAMES[noteIndex];
  
  // オクターブ判定（A4=0基準で、C4=-9, C5=3）
  // 簡易的に '（オクターブ上）をつける
  const octaveOffset = Math.floor((semitonesFromA4 + 9) / 12);
  const baseOctave = 4;
  const octave = baseOctave + octaveOffset;
  
  if (octave >= 5) {
    return `${noteName}'`;
  }
  return noteName;
};

/**
 * 純正律の比率から半音数を近似計算
 * @param ratio - 純正律の比率（例: 4/3）
 * @returns 半音数（小数）
 */
const ratioToSemitones = (ratio: number): number => {
  return 12 * Math.log2(ratio);
};

/**
 * 糸IDごとの表示用音名を取得
 * @param stringId - 糸ID
 * @param baseNoteId - 基音ID
 * @param tuningModeId - 調弦モードID
 * @returns 音名（例: "D", "G", "D'"）
 */
export const getStringNoteName = (
  stringId: string,
  baseNoteId: string,
  tuningModeId: string
): string => {
  // 基音データを検索
  const baseNote = BASE_NOTES.find((note) => note.id === baseNoteId);
  if (!baseNote) {
    return '?';
  }

  // 調弦モードを検索
  const tuningMode = TUNING_MODES.find((mode) => mode.id === tuningModeId);
  if (!tuningMode) {
    return '?';
  }

  // 糸IDに対応する比率を取得
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
      return '?';
  }

  // 基音からの半音オフセットを計算
  const semitonesOffset = Math.round(ratioToSemitones(ratio));
  const totalSemitones = baseNote.semitonesFromA4 + semitonesOffset;
  
  return getNoteNameFromSemitones(totalSemitones);
};
