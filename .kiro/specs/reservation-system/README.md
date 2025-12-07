# 予約システム - プロジェクト仕様書

## プロジェクト概要

Firebase Authentication と Firestore を使用したシンプルな予約管理Webアプリケーションです。ユーザーはメールアドレスとパスワードでログインし、サービスの予約を作成・管理できます。

## ドキュメント構成

- **[requirements.md](./requirements.md)** - 要件定義書（ユーザーストーリーと受入基準）
- **[design.md](./design.md)** - 技術設計書（アーキテクチャとコンポーネント設計）
- **README.md** - 本ファイル（プロジェクト概要とセットアップ手順）

## 主要機能

### 認証機能
- ✅ メール/パスワードでの新規登録
- ✅ ログイン/ログアウト
- ✅ パスワードリセット（メール送信）
- ✅ ログイン状態の永続化（チェックボックス）
- ✅ 日本語エラーメッセージ

### 予約管理機能
- ✅ 予約作成（サービス、日付、時間）
- ✅ 予約一覧表示（リアルタイム更新）
- ✅ 予約削除（確認ダイアログ付き）
- ✅ ユーザーごとのデータ分離

### UI/UX
- ✅ レスポンシブデザイン（スマホ対応）
- ✅ Tailwind CSSによるモダンなデザイン
- ✅ シアン/ブルーのカラースキーム
- ✅ アイコン付きフォーム（lucide-react）
- ✅ ホバーエフェクトとアニメーション

## 技術スタック

| カテゴリ | 技術 | バージョン |
|---------|------|-----------|
| フロントエンド | React | 19.2.0 |
| 言語 | TypeScript | 5.9.3 |
| ビルドツール | Vite | 7.2.4 |
| スタイリング | Tailwind CSS | 4.1.17 |
| アイコン | lucide-react | 0.556.0 |
| バックエンド | Firebase | 12.6.0 |
| 認証 | Firebase Authentication | - |
| データベース | Firestore | - |

## プロジェクト構成

```
myreservation-app/
├── src/
│   ├── components/
│   │   ├── Login.tsx              # ログイン/新規登録画面
│   │   ├── ReservationForm.tsx    # 予約作成フォーム
│   │   └── ReservationList.tsx    # 予約一覧表示
│   ├── App.tsx                     # メインコンポーネント
│   ├── firebase.ts                 # Firebase設定
│   ├── main.tsx                    # エントリーポイント
│   └── index.css                   # グローバルスタイル
├── public/                         # 静的ファイル
├── .kiro/specs/reservation-system/ # 仕様書
├── package.json                    # 依存関係
├── tsconfig.json                   # TypeScript設定
├── tailwind.config.js              # Tailwind設定
├── vite.config.ts                  # Vite設定
└── .gitignore                      # Git除外設定
```

## セットアップ手順

### 1. 前提条件

- Node.js 18以上
- npm または yarn
- Firebaseアカウント

### 2. リポジトリのクローン

```bash
git clone <repository-url>
cd myreservation-app
```

### 3. 依存関係のインストール

```bash
npm install
```

### 4. Firebase プロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 「プロジェクトを追加」をクリック
3. プロジェクト名を入力（例：myreservation-app）
4. Google Analyticsは任意

### 5. Firebase Authentication の有効化

1. 左メニュー「Authentication」→「始める」
2. 「Sign-in method」タブ
3. 「メール/パスワード」を有効化

### 6. Firestore の有効化

1. 左メニュー「Firestore Database」→「データベースの作成」
2. 「テストモードで開始」を選択
3. ロケーション：`asia-northeast1`（東京）

### 7. Firebase 設定の取得

1. プロジェクト設定（歯車アイコン）
2. 「アプリを追加」→ Web（</>）
3. アプリのニックネームを入力
4. 表示される `firebaseConfig` をコピー

### 8. Firebase 設定の更新

`src/firebase.ts` を開き、`firebaseConfig` を更新：

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 9. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで `http://localhost:5173` を開く

### 10. ビルド（本番環境）

```bash
npm run build
```

`dist/` ディレクトリに静的ファイルが生成されます。

## Firestore セキュリティルール（推奨）

Firebase Console → Firestore Database → ルール：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /reservations/{reservation} {
      // 認証済みユーザーのみアクセス可能
      allow read, write: if request.auth != null 
        && request.auth.uid == resource.data.userId;
      
      // 新規作成時は自分のuserIdのみ設定可能
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.userId;
    }
  }
}
```

## 使用方法

### 新規登録

1. ログイン画面で「Don't have an account? Sign up」をクリック
2. メールアドレスとパスワード（6文字以上）を入力
3. 「SIGN UP」ボタンをクリック

### ログイン

1. メールアドレスとパスワードを入力
2. 「ログイン状態を保持」にチェック（任意）
3. 「LOGIN」ボタンをクリック

### パスワードリセット

1. メールアドレスを入力
2. 「パスワードを忘れた？」をクリック
3. 受信したメールのリンクから新しいパスワードを設定

### 予約作成

1. サービスを選択（カット、カラー、パーマ、トリートメント）
2. 日付と時間を選択
3. 「予約する」ボタンをクリック

### 予約削除

1. 予約一覧から削除したい予約の「削除」ボタンをクリック
2. 確認ダイアログで「OK」をクリック

## トラブルシューティング

### ビルドエラー

```bash
# キャッシュをクリア
rm -rf node_modules/.vite
npm run dev
```

### Firebase エラー

- Firebase設定が正しいか確認
- Authentication、Firestoreが有効化されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### スタイルが反映されない

```bash
# Tailwind CSSの再ビルド
npm run build
```

## デプロイ

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## ライセンス

MIT License

## 作成者

Kiro AI Assistant

## 更新履歴

- 2025-12-07: 初版作成
  - 認証機能実装
  - 予約管理機能実装
  - レスポンシブデザイン対応
  - Firebase統合完了
