社内ツールのGAS開発におけるコーディング規約
初心者の方へ: この規約は「なぜそうするのか」と「何をすべきか」を中心にまとめています。 具体的なコード例は 実装サンプル集 を参照してください。
📚 目次
基本的なコーディング規約
命名規則
変数の宣言と文字列操作
比較演算子とマジックナンバー
制御構造
GAS固有の規約
コメントとドキュメ中抜け
ント
エラーハンドリング
ログ出力
パフォーマンス対策
オブジェクト指向設計
DDD設計アーキテクチャ
データ操作とエンティティ
テストとデバッグ
セキュリティ


1. 基本的なコーディング規約
1-1. インデント
ルール: インデントは半角スペース2を使用する

理由: チーム全体でコードの見た目を統一し、可読性を高めるため


2. 命名規則
2-1. 変数名・定数名
基本ルール
種類
命名規則
例
ローカル変数
ローワーキャメルケース
userName, errorMessage
グローバル定数
アッパースネークケース
TAX_RATE, USER_ID
配列・集合
複数形
values, sheets, userNames


理由:

変数のスコープと役割を名前から判別できる
JavaScriptの一般的な慣習に従う
2-2. 関数名・メソッド名
ルール:

ローワーキャメルケースで記述
真偽値を返す場合は疑問形（is, has, can）

例: calculateTaxAmount, isValid, hasPermission
2-3. クラス名
ルール: アッパーキャメルケースで記述

例: UserValidator, InvoiceWriter, MemberRepository
2-4. 予約語の禁止
JavaScriptの予約語（if, for, class, constなど）は変数名・関数名に使用不可


3. 変数の宣言と文字列操作
3-1. 変数の宣言
キーワード
使用場面
const
再代入が不要な変数（推奨）
let
再代入が必要な変数
var
使用禁止


理由:

constは意図しない再代入を防ぐ
varはスコープの問題を引き起こす
3-2. 文字列操作
ルール: テンプレートリテラル（バッククォート）を使用

// ✕ NG

'ユーザー情報: ' + userId + ', ' + userName

// ○ OK

`ユーザー情報: ${userId}, ${userName}`

理由: 可読性が高く、変数の埋め込みが簡潔


4. 比較演算子とマジックナンバー
4-1. 厳密等価演算子の使用
ルール: ==ではなく===を使用

// ✕ NG: if (value == 10)

// ○ OK: if (value === 10)

理由: 型変換による予期しないバグを防ぐ
4-2. 明示的な条件式
ルール:

if (userId)ではなくif (userId !== null)
boolean型の場合は省略可（if (isValid)）

// ✕ NG: if (userId)

// ○ OK: if (userId !== null && userId !== undefined)

// ○ OK: if (isValid)  // boolean型は省略可

理由: 意図が明確になり、バグを防ぐ
4-3. マジックナンバーの禁止
ルール: 数値や文字列を直接記述せず、定数として定義

// ✕ NG: const userName = sheetValues[2][4];

// ○ OK: const userName = sheetValues[USER_NAME_ROW_INDEX][USER_NAME_COLUMN_INDEX];

理由:

値の意味が分かりやすくなる
修正時に一箇所変更すればよい


5. 制御構造
5-1. ガード節
ルール: 深いネストを避け、早期リターンを使用

// ✕ NG: if (a) {
 　if (b) {
　　 if (c) { ... 
　　} 
　}
 }

// ○ OK: if (!a) return;
 	　if (!b) return; 
　if (!c) return; ...

理由:

コードの見通しが良くなる
バグの発見が容易

詳細な例は 実装サンプル集 を参照


6. GAS固有の規約
6-1. 行列の指定
ルール:

スプレッドシート上の行番号: rowNumber
GAS上のインデックス: rowIndex

const rowNumber = 3;  // スプレッドシート上の行番号（1始まり）

const rowIndex = 2;   // GAS上のインデックス（0始まり）

理由: スプレッドシート（1始まり）とGAS（0始まり）の混同を防ぐ
6-2. スプレッドシート変数名
ルール:

ssの使用は小規模スコープのみ（~15行）
それ以外は明示的な名前（memberSpreadsheet）

理由: 複数のスプレッドシートを扱う場合の混乱を防ぐ
6-3. スプレッドシートとシートの区別
スプレッドシート全体: memberSpreadsheet
個別シート: settingSheet, activeSheet


7. コメントとドキュメント
7-1. コメントの基本ルール
単行コメント: //の後に半角スペース
複数行コメント: JSDoc形式

// 単行コメントの例

/**

 * 複数行コメントの例

 * @param {string} userId - ユーザーID

 * @return {boolean} 処理成功時はtrue

 */
7-2. コメントすべき箇所
関数・メソッドの目的と引数・戻り値
複雑な処理のロジック
マジックナンバーや定数の意図
外部APIとの連携部分

理由: 他の開発者（未来の自分を含む）が理解しやすくなる

詳細な例は 実装サンプル集 を参照


8. エラーハンドリング
8-1. try-catch文の使用
ルール: 外部APIやスプレッドシート操作には必ずtry-catch

try {

  const sheet = SpreadsheetApp.getActiveSheet();

  sheet.getRange('A1').setValue('test');

} catch (error) {

  console.error('エラー:', error.message);

  throw new Error(`処理に失敗: ${error.message}`);

}

理由: エラーを適切に処理し、ユーザーに分かりやすいメッセージを表示
8-2. エラーメッセージの日本語化
ルール: エラーメッセージは日本語で分かりやすく

throw new Error('ユーザーIDが見つかりません');

詳細な例は 実装サンプル集 を参照


9. ログ出力
9-1. ログレベルの使い分け
レベル
用途
メソッド
デバッグ
開発時の詳細情報
console.log()
情報
重要な処理の記録
console.info()
警告
処理は継続できるが注意が必要
console.warn()
エラー
処理が中断された
console.error()


console.log('デバッグ情報');

console.info('処理開始');

console.warn('古いデータ形式です');

console.error('エラー発生');

詳細な例は 実装サンプル集 を参照


10. パフォーマンス対策
10-1. バッチ処理の推奨
ルール: セル単位ではなく、範囲単位でまとめて処理

// ✕ NG: sheet.getRange(i, 1).setValue(data[i]); をループ

// ○ OK: sheet.getRange(1, 1, data.length, 1).setValues(values);

理由: GASのAPI呼び出し回数を減らし、大幅に高速化
10-2. 不要なAPI呼び出しの削減
ルール: スプレッドシートオブジェクトは一度取得して使い回す

// ✕ NG: 各関数内で SpreadsheetApp.getActiveSpreadsheet() を呼び出し

// ○ OK: 一度取得したスプレッドシートを引数で渡す

理由: API呼び出しは遅いため、最小限に抑える

詳細な例は 実装サンプル集 を参照


11. オブジェクト指向設計
11-1. オブジェクト指向の基本方針
ルール: 責務を分離し、クラスとして整理

理由:

コードの再利用性が高まる
テストしやすくなる
変更の影響範囲が限定される
11-2. 引数の数
ルール: 引数が4つ以上ならオブジェクトにまとめる

// ✕ NG: function create(name, email, age, dept, pos, date, salary)

// ○ OK: function create(userInfo) { const { name, email, ... } = userInfo; }

理由:

関数呼び出しが分かりやすくなる
引数の順番を間違えにくい

詳細な例は 実装サンプル集 を参照


12. DDD設計アーキテクチャ
12-1. ディレクトリ構造の基本
src/

├── 1.shared/          # 共有機能（定数、設定）

├── 2.domain/          # ビジネスロジックの核心

├── 3.infrastructure/  # 外部システム連携

├── 4.application/     # ユースケース実装

└── 5.presentation/    # ユーザーインターフェース

理由:

各層の責務が明確
依存関係が一方向（下から上へ）
コードの配置場所が迷わない
12-2. 各層の役割
層
役割
具体例
Shared
全体で使う共通機能
定数、ユーティリティ
Domain
ビジネスルール
エンティティ、値オブジェクト
Infrastructure
データアクセス
Repository、外部API連携
Application
ユースケース
サービスクラス、DTO
Presentation
UI制御
コントローラー、ハンドラー



13. データ操作とエンティティ
13-1. Config層による定数管理
ルール: 設定値はConfigオブジェクトで一元管理

理由:

設定変更時に一箇所修正すればよい
マジックナンバーを排除
13-2. Repository層の役割
ルール: データアクセスはRepositoryクラスに集約

理由:

ビジネスロジックとデータアクセスを分離
データソースの変更に強い
13-3. エンティティクラスの役割
ルール: データとそれに関連するビジネスロジックをまとめる

理由:

配列インデックスアクセスを排除
ビジネスルールをカプセル化
13-4. 配列操作
ルール: forループではなく、filter、map、forEachを使用

// ✕ NG: for (let i = 0; i < data.length; i++) { ... }

// ○ OK: data.filter(item => ...).forEach(item => ...);

理由:

コードの意図が明確
インデックスミスを防ぐ

詳細な例は 実装サンプル集 を参照


14. テストとデバッグ
14-1. テスト可能な設計
ルール: ビジネスロジックとデータアクセスを分離

理由:

ユニットテストが書きやすい
モックを使った独立したテストが可能
14-2. デバッグの基本
重要なポイント:

段階的にテスト（単体→結合→全体）
境界値テスト（空配列、null等）
ログレベルの使い分け
モックデータの活用

詳細な例は 実装サンプル集 を参照


15. セキュリティ
15-1. 機密情報の管理
ルール: APIキーや認証情報はPropertiesServiceで管理

// ✕ NG: const API_KEY = 'abcd1234';

// ○ OK: PropertiesService.getScriptProperties().getProperty('API_KEY');

理由:

コードに直接書くと流出リスク
環境ごとに設定を変更可能
15-2. 入力値の検証
ルール: ユーザー入力は必ず検証

if (typeof input !== 'string' || input.length > 100) {

  throw new Error('不正な入力値です');

}

理由: 不正なデータによるバグやセキュリティリスクを防ぐ
15-3. アクセス制御
ルール: 重要な操作には権限チェックを実装

const userEmail = Session.getActiveUser().getEmail();

if (!allowedUsers.includes(userEmail)) {

  throw new Error('アクセス権限がありません');

}

理由: 不正アクセスを防ぎ、操作履歴を記録
15-4. セキュリティのチェックポイント
最小権限の原則
データマスキング（ログ出力時）
監査ログの記録
エラー情報の適切な制御

詳細な例は 実装サンプル集 を参照


📖 参考資料
詳細な実装例は以下を参照してください:

実装サンプル集 - コード例とベストプラクティス
❓ 困ったときは
まずはこの規約を読み返す
実装サンプル集で類似例を探す
チームメンバーに相談
既存のコードで良い例を探す



最終更新: 2025年10月28日


