/**
 * 音名ヘルパーのユニットテスト
 */

import { getStringNoteName } from '../utils/noteNameHelper';

describe('getStringNoteName', () => {
  // D4（六本）+ 本調子
  test('D4+本調子: 一の糸はD', () => {
    expect(getStringNoteName('string_1', 'note_d4', 'honchoshi')).toBe('D');
  });

  test('D4+本調子: 二の糸はG（完全4度）', () => {
    expect(getStringNoteName('string_2', 'note_d4', 'honchoshi')).toBe('G');
  });

  test("D4+本調子: 三の糸はD'（オクターブ上）", () => {
    const result = getStringNoteName('string_3', 'note_d4', 'honchoshi');
    expect(result).toBe("D'");
  });

  // D4（六本）+ 二上り
  test('D4+二上り: 二の糸はA（完全5度）', () => {
    expect(getStringNoteName('string_2', 'note_d4', 'niagari')).toBe('A');
  });

  // D4（六本）+ 三下り
  test("D4+三下り: 三の糸はC'（短7度）", () => {
    const result = getStringNoteName('string_3', 'note_d4', 'sansagari');
    expect(result).toBe("C'");
  });

  // C4（四本）+ 本調子
  test('C4+本調子: 一の糸はC', () => {
    expect(getStringNoteName('string_1', 'note_c4', 'honchoshi')).toBe('C');
  });

  test('C4+本調子: 二の糸はF', () => {
    expect(getStringNoteName('string_2', 'note_c4', 'honchoshi')).toBe('F');
  });

  // 異常系
  test('無効な基音IDで?を返す', () => {
    expect(getStringNoteName('string_1', 'invalid', 'honchoshi')).toBe('?');
  });

  test('無効な糸IDで?を返す', () => {
    expect(getStringNoteName('invalid', 'note_d4', 'honchoshi')).toBe('?');
  });

  test('無効なモードIDで?を返す', () => {
    expect(getStringNoteName('string_1', 'note_d4', 'invalid')).toBe('?');
  });
});
