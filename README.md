# 三味線調弦アプリ (ShamisenTuner)

三味線の純正律調弦をサポートするモバイル / Web アプリケーションです。  
Expo (React Native) + TypeScript で構築されており、iOS・Android・Web で動作します。

---

## 機能一覧

| 機能 | 説明 |
|------|------|
| **基準ピッチ調整** | A=430–450 Hz（1 Hz 刻み） |
| **基音選択** | A3（壱本）〜 A4（十三本）のドラムロール式ピッカー |
| **微調整** | ±50 セント（1 セント刻み）のスライダー |
| **調弦モード** | 本調子 / 二上り / 三下り |
| **自動再生** | 一の糸 → 二の糸 → 三の糸を 1.5 秒間隔でループ |
| **手動再生** | 各糸ボタンの押下で即時発音、離すと停止 |
| **画面スリープ防止** | `expo-keep-awake` で画面常時点灯 |
| **純正律** | 音律比（4/3、3/2、16/9 など）に基づく正確な調弦 |

---

## 技術スタック

- **フレームワーク**: Expo SDK ~54 / React Native 0.81
- **言語**: TypeScript ~5.9
- **iOS 音声**: AVAudioEngine + AVAudioPlayerNode（Expo Native Module / Swift）
- **Android 音声**: カスタムネイティブモジュール（Kotlin）
- **Web 音声**: Web Audio API（OscillatorNode + GainNode）
- **テスト**: Jest + ts-jest

---

## プロジェクト構成

```
ShamisenTuner/
├── App.tsx                         # メインコンポーネント
├── src/
│   ├── components/                 # UI コンポーネント群
│   │   ├── Header.tsx
│   │   ├── CalibrationControl.tsx
│   │   ├── BasePitchPicker.tsx
│   │   ├── FineTuneSlider.tsx
│   │   ├── TuningModeSelector.tsx
│   │   ├── AutoPlayToggle.tsx
│   │   ├── StringPlayButtons.tsx
│   │   └── Footer.tsx
│   ├── constants/
│   │   ├── theme.ts                # カラー・フォント・スペーシング定数
│   │   └── tuningData.ts           # 基音・調弦モード・糸のデータ定義
│   ├── hooks/
│   │   └── useAutoPlay.ts          # 自動再生カスタムフック
│   ├── types/
│   │   └── appState.ts             # 状態型定義
│   ├── utils/
│   │   ├── frequencyCalculator.ts  # 周波数計算（純粋関数）
│   │   └── noteNameHelper.ts       # 音名動的取得
│   └── __tests__/                  # ユニットテスト
│       ├── frequencyCalculator.test.ts
│       └── noteNameHelper.test.ts
├── modules/
│   └── shamisen-audio/             # Expo Native Module
│       ├── ios/                    #   Swift (AVAudioEngine)
│       ├── android/                #   Kotlin
│       └── src/                    #   TypeScript + Web Audio API
└── doc/                            # 設計ドキュメント
```

---

## セットアップ

### 前提条件

- **Node.js** 18 以上（推奨 20 LTS）
- **npm** 9 以上
- iOS ビルド: macOS + Xcode 15 以上
- Android ビルド: Android Studio + SDK 34

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/<your-username>/ShamisenTuner.git
cd ShamisenTuner

# パッケージインストール
npm install
```

### 開発サーバー起動

```bash
# iOS シミュレータ
npm run ios

# Android エミュレータ
npm run android

# Web ブラウザ（Windows でも動作可能）
npm run web
```

### テスト実行

```bash
# 全テスト実行
npm test

# ウォッチモード（ファイル変更で自動再実行）
npm run test:watch
```

---

## Windows (VS Code) での開発

Windows 環境でも **Web モード** (`npm run web`) で音声確認を含む動作テストが可能です。

### 手順

1. **Git** と **Node.js 18+** をインストール
2. このリポジトリを `git clone` する
3. VS Code でフォルダを開く
4. ターミナルで `npm install` → `npm run web`
5. ブラウザ (http://localhost:8081) で動作確認

> **注意**: ネイティブ (iOS/Android) ビルドにはそれぞれ macOS / Android Studio が必要です。  
> Windows では Web モードのみ完全動作します。

---

## GitHub 共有手順

```bash
# ① GitHub で新規リポジトリを作成（READMEなし、Private 推奨）
# ② ローカルリポジトリにリモートを追加
git remote add origin https://github.com/<your-username>/ShamisenTuner.git

# ③ プッシュ
git push -u origin main
```

以降は通常の Git ワークフローで開発できます:

```bash
git add .
git commit -m "機能追加: ○○"
git push
```

---

## コーディング規約

- **早期リターン（ガード節）** を徹底
- **index フリー**（オブジェクト ID）のデータ管理
- 純粋関数は `src/utils/` に配置
- UI コンポーネントは `src/components/` に分割
- 定数は `src/constants/` に集約
- 詳細は [コーディング規約](doc/コーディング規約(GAS版).md) を参照

---

## ライセンス

Private プロジェクト（ライセンス未定）
