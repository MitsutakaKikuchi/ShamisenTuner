/**
 * 周波数計算ロジックのユニットテスト
 * 
 * テスト対象:
 * - calculateBaseFrequency: 基音周波数の計算
 * - calculateStringFrequency: 各糸の周波数計算
 * - calculateAllStringFrequencies: 全糸の一括計算
 */

import {
  calculateBaseFrequency,
  calculateStringFrequency,
  calculateAllStringFrequencies,
} from '../utils/frequencyCalculator';

describe('calculateBaseFrequency', () => {
  // A4 = 440Hz で A4 を選択した場合 → 440Hz
  test('A4を選択した場合、基準ピッチそのままの値を返す', () => {
    const result = calculateBaseFrequency('note_a4', 440, 0);
    expect(result).toBeCloseTo(440, 1);
  });

  // A4 = 440Hz で D4（五本）を選択した場合 → 約293.66Hz
  test('D4（五本）を選択した場合、正しい周波数を返す', () => {
    const result = calculateBaseFrequency('note_d4', 440, 0);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(293.66, 0);
  });

  // A4 = 440Hz で C4（三本）を選択した場合 → 約261.63Hz
  test('C4（三本）を選択した場合、正しい周波数を返す', () => {
    const result = calculateBaseFrequency('note_c4', 440, 0);
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(261.63, 0);
  });

  // 微調整 +50セント（+1/4音）
  test('微調整+50セントで周波数が上がる', () => {
    const base = calculateBaseFrequency('note_d4', 440, 0);
    const tuned = calculateBaseFrequency('note_d4', 440, 50);
    expect(base).not.toBeNull();
    expect(tuned).not.toBeNull();
    expect(tuned!).toBeGreaterThan(base!);
  });

  // 微調整 -50セント（-1/4音）
  test('微調整-50セントで周波数が下がる', () => {
    const base = calculateBaseFrequency('note_d4', 440, 0);
    const tuned = calculateBaseFrequency('note_d4', 440, -50);
    expect(base).not.toBeNull();
    expect(tuned).not.toBeNull();
    expect(tuned!).toBeLessThan(base!);
  });

  // 基準ピッチ442Hz
  test('基準ピッチ442Hzで全体が上がる', () => {
    const hz440 = calculateBaseFrequency('note_a4', 440, 0);
    const hz442 = calculateBaseFrequency('note_a4', 442, 0);
    expect(hz440).toBeCloseTo(440, 1);
    expect(hz442).toBeCloseTo(442, 1);
  });

  // 異常系: 無効な基音ID
  test('無効な基音IDでnullを返す', () => {
    const result = calculateBaseFrequency('invalid_id', 440, 0);
    expect(result).toBeNull();
  });

  // 異常系: 無効な基準ピッチ
  test('基準ピッチ0以下でnullを返す', () => {
    expect(calculateBaseFrequency('note_d4', 0, 0)).toBeNull();
    expect(calculateBaseFrequency('note_d4', -1, 0)).toBeNull();
  });
});

describe('calculateStringFrequency', () => {
  const baseFreqD4 = 293.66; // D4 ≈ 293.66Hz

  // 本調子: 一の糸はそのまま
  test('本調子: 一の糸は基音そのまま', () => {
    const result = calculateStringFrequency('string_1', baseFreqD4, 'honchoshi');
    expect(result).toBeCloseTo(baseFreqD4, 1);
  });

  // 本調子: 二の糸は完全4度（×4/3）
  test('本調子: 二の糸は完全4度（×4/3）', () => {
    const result = calculateStringFrequency('string_2', baseFreqD4, 'honchoshi');
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(baseFreqD4 * 4 / 3, 1);
  });

  // 本調子: 三の糸はオクターブ（×2）
  test('本調子: 三の糸はオクターブ（×2）', () => {
    const result = calculateStringFrequency('string_3', baseFreqD4, 'honchoshi');
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(baseFreqD4 * 2, 1);
  });

  // 二上り: 二の糸は完全5度（×3/2）
  test('二上り: 二の糸は完全5度（×3/2）', () => {
    const result = calculateStringFrequency('string_2', baseFreqD4, 'niagari');
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(baseFreqD4 * 3 / 2, 1);
  });

  // 三下り: 三の糸は短7度（×16/9）
  test('三下り: 三の糸は短7度（×16/9）', () => {
    const result = calculateStringFrequency('string_3', baseFreqD4, 'sansagari');
    expect(result).not.toBeNull();
    expect(result!).toBeCloseTo(baseFreqD4 * 16 / 9, 1);
  });

  // 異常系
  test('無効な糸IDでnullを返す', () => {
    expect(calculateStringFrequency('string_99', baseFreqD4, 'honchoshi')).toBeNull();
  });

  test('無効な調弦モードIDでnullを返す', () => {
    expect(calculateStringFrequency('string_1', baseFreqD4, 'invalid')).toBeNull();
  });

  test('基音周波数0以下でnullを返す', () => {
    expect(calculateStringFrequency('string_1', 0, 'honchoshi')).toBeNull();
    expect(calculateStringFrequency('string_1', -100, 'honchoshi')).toBeNull();
  });
});

describe('calculateAllStringFrequencies', () => {
  // 正常系: D4 (五本) + 本調子
  test('D4+本調子で3つの周波数を返す', () => {
    const results = calculateAllStringFrequencies('note_d4', 'honchoshi', 440, 0);
    expect(results).toHaveLength(3);
    
    // 一の糸はD4
    const string1 = results.find((r) => r.stringId === 'string_1');
    expect(string1).toBeDefined();
    expect(string1!.frequency).toBeCloseTo(293.66, 0);
    
    // 二の糸はG4（完全4度）
    const string2 = results.find((r) => r.stringId === 'string_2');
    expect(string2).toBeDefined();
    expect(string2!.frequency).toBeCloseTo(293.66 * 4 / 3, 0);
    
    // 三の糸はD5（オクターブ）
    const string3 = results.find((r) => r.stringId === 'string_3');
    expect(string3).toBeDefined();
    expect(string3!.frequency).toBeCloseTo(293.66 * 2, 0);
  });

  // 異常系: 無効な基音ID
  test('無効な基音IDで空配列を返す', () => {
    const results = calculateAllStringFrequencies('invalid', 'honchoshi', 440, 0);
    expect(results).toHaveLength(0);
  });
});
