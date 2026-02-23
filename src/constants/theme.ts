/**
 * 和風テーマの共通スタイル定数
 * アプリ全体の配色・フォントサイズ・間隔を一元管理
 */

// 和風カラーパレット（UI画像から精密に抽出した値）
export const COLORS = {
  // 背景系
  backgroundDark: '#210e04',     // 最も暗い背景（メイン背景）
  backgroundMedium: '#3a1f11',   // 中間背景
  backgroundLight: '#5c3a21',    // 明るめの背景

  // 和風アクセント
  gold: '#b08d55',               // 金色（メインテキスト・装飾）
  goldBright: '#e8c988',         // 明るい金色（強調テキスト）
  goldDark: '#70542c',           // 暗い金色（アクティブ状態）

  // ボタン・カード
  surface: '#3b2314',            // ボタン・カード背景
  surfaceActive: '#5c3a21',      // アクティブなボタン背景
  surfaceHighlight: '#c6a265',   // ハイライト状態（タブ選択時などのゴールド）

  // ボーダー・装飾
  borderGold: '#b08d55',         // 金色のボーダー
  borderLight: '#70542c',        // 標準ボーダー
  borderBright: '#e8c988',       // 明るいボーダー（アクティブ時）

  // テキスト
  textPrimary: '#d8bd8a',        // 主要テキスト
  textBright: '#fdf3d6',         // 明るいテキスト
  textWhite: '#ffffff',          // 白テキスト
  textMuted: '#9e8568',          // 控えめなテキスト
  textDark: '#2c190a',           // ゴールド背景上の暗いテキスト

  // ステータス
  activeGlow: '#ffdf91',         // 発音中のグロー
  switchOn: '#6eb872',           // スイッチON
  switchOff: '#4a3324',          // スイッチOFF
} as const;

// フォントサイズ
export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  title: 28,
  hero: 36,
  giant: 48,
} as const;

// 間隔
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ボーダー半径
export const BORDER_RADIUS = {
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
} as const;
