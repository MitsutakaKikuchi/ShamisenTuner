/**
 * 和風テーマの共通スタイル定数
 * アプリ全体の配色・フォントサイズ・間隔を一元管理
 */

// 和風カラーパレット
export const COLORS = {
  // 背景系
  backgroundDark: '#1a0e08',     // 最も暗い背景（メイン背景）
  backgroundMedium: '#2c1810',   // 中間背景
  backgroundLight: '#3a2818',    // 明るめの背景
  
  // 和風アクセント
  gold: '#d4a574',               // 金色（メインテキスト・装飾）
  goldBright: '#f4d4a4',         // 明るい金色（強調テキスト）
  goldDark: '#8a6040',           // 暗い金色（アクティブ状態）
  
  // ボタン・カード
  surface: '#4a3728',            // ボタン・カード背景
  surfaceActive: '#6a5040',      // アクティブなボタン背景
  surfaceHighlight: '#8a6040',   // ハイライト状態   
  
  // ボーダー・装飾
  borderGold: '#8a7040',         // 金色のボーダー
  borderLight: '#6a5040',        // 標準ボーダー
  borderBright: '#d4a574',       // 明るいボーダー（アクティブ時）
  
  // テキスト
  textPrimary: '#d4a574',        // 主要テキスト
  textBright: '#f4d4a4',         // 明るいテキスト
  textWhite: '#ffffff',          // 白テキスト
  textMuted: '#8a7060',          // 控えめなテキスト
  
  // ステータス
  activeGlow: '#ffcc66',         // 発音中のグロー
  switchOn: '#4a8a40',           // スイッチON
  switchOff: '#3a2818',          // スイッチOFF
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
