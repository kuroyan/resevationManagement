# 予約システム - 技術設計書

## 概要

本システムは、React + TypeScript + Firebase + Tailwind CSSを使用したモダンなWebアプリケーションです。サーバーレスアーキテクチャを採用し、Firebase Authentication（認証）とFirestore（データベース）を活用して、スケーラブルで保守性の高いシステムを実現しています。

## アーキテクチャ

### システム構成図

```
┌─────────────────────────────────────────┐
│         クライアント（ブラウザ）          │
│  ┌─────────────────────────────────┐   │
│  │   React Application (SPA)       │   │
│  │   - Login Component             │   │
│  │   - ReservationForm Component   │   │
│  │   - ReservationList Component   │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                    │
                    │ HTTPS
                    ▼
┌─────────────────────────────────────────┐
│         Firebase Services               │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ Authentication│  │   Firestore     │ │
│  │  - Email/Pass │  │  - reservations │ │
│  │  - Session    │  │    collection   │ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────┘
```

### 技術スタック

**フロントエンド:**
- React 19.2.0 - UIライブラリ
- TypeScript 5.9.3 - 型安全性
- Vite 7.2.4 - ビルドツール
- Tailwind CSS 4.1.17 - スタイリング
- lucide-react 0.556.0 - アイコンライブラリ

**バックエンド:**
- Firebase 12.6.0
  - Authentication - ユーザー認証
  - Firestore - NoSQLデータベース

**開発ツール:**
- ESLint - コード品質
- TypeScript ESLint - TypeScript用リンター

## コンポーネント設計

### 1. App.tsx（メインコンポーネント）

**責務:**
- 認証状態の管理
- ログイン/メイン画面の切り替え
- グローバルレイアウト

**状態管理:**
```typescript
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
```

**主要機能:**
- `onAuthStateChanged`: 認証状態の監視
- 条件付きレンダリング: ログイン状態に応じた画面表示

### 2. Login.tsx（認証コンポーネント）

**責務:**
- ユーザー登録
- ログイン
- パスワードリセット
- ログイン状態の永続化

**状態管理:**
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [isLogin, setIsLogin] = useState(true);
const [error, setError] = useState('');
const [showPassword, setShowPassword] = useState(false);
const [rememberMe, setRememberMe] = useState(false);
const [resetMessage, setResetMessage] = useState('');
```

**主要機能:**
- `signInWithEmailAndPassword`: ログイン処理
- `createUserWithEmailAndPassword`: 新規登録処理
- `sendPasswordResetEmail`: パスワードリセット
- `setPersistence`: ログイン状態の永続化設定

### 3. ReservationForm.tsx（予約作成コンポーネント）

**責務:**
- 予約データの入力
- Firestoreへのデータ保存
- バリデーション

**状態管理:**
```typescript
const [date, setDate] = useState('');
const [time, setTime] = useState('');
const [service, setService] = useState('');
const [loading, setLoading] = useState(false);
const [message, setMessage] = useState('');
```

**主要機能:**
- `addDoc`: Firestoreへのドキュメント追加
- `serverTimestamp`: サーバータイムスタンプの取得

### 4. ReservationList.tsx（予約一覧コンポーネント）

**責務:**
- 予約データの表示
- リアルタイム更新
- 予約の削除

**状態管理:**
```typescript
const [reservations, setReservations] = useState<Reservation[]>([]);
const [loading, setLoading] = useState(true);
```

**主要機能:**
- `onSnapshot`: リアルタイムデータ監視
- `query` + `where`: ユーザーごとのデータフィルタリング
- `deleteDoc`: ドキュメントの削除

## データモデル

### Reservation（予約データ）

```typescript
interface Reservation {
  id: string;              // ドキュメントID（自動生成）
  userId: string;          // ユーザーID
  userEmail: string;       // ユーザーメールアドレス
  date: string;            // 予約日（YYYY-MM-DD形式）
  time: string;            // 予約時間（HH:MM形式）
  service: string;         // サービス名
  status: string;          // ステータス（'pending' | 'confirmed'）
  createdAt: Timestamp;    // 作成日時（サーバータイムスタンプ）
}
```

### Firestoreコレクション構造

```
reservations (collection)
  └─ {documentId} (document)
      ├─ userId: string
      ├─ userEmail: string
      ├─ date: string
      ├─ time: string
      ├─ service: string
      ├─ status: string
      └─ createdAt: timestamp
```

## Firebase設定

### firebase.ts

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## エラーハンドリング

### 認証エラー

Firebase Authenticationのエラーコードを日本語メッセージに変換：

```typescript
const errorMessages = {
  'auth/invalid-credential': 'メールアドレスまたはパスワードが正しくありません',
  'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
  'auth/weak-password': 'パスワードは6文字以上で設定してください',
  'auth/invalid-email': 'メールアドレスの形式が正しくありません',
  'auth/user-not-found': 'ユーザーが見つかりません'
};
```

### データベースエラー

Firestoreのエラーは、try-catchブロックでキャッチし、ユーザーフレンドリーなメッセージを表示します。

## スタイリング設計

### Tailwind CSS設定

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### カラースキーム

- **プライマリ:** シアン/ブルー（`cyan-400` to `blue-500`）
- **エラー:** レッド（`red-50`, `red-600`）
- **成功:** グリーン（`green-50`, `green-600`）
- **背景:** グレー（`gray-50`, `gray-100`）

### レスポンシブデザイン

- **モバイルファースト:** デフォルトでモバイル向けスタイル
- **ブレークポイント:** `sm:`, `md:`, `lg:` を使用
- **最大幅:** `max-w-2xl` でコンテンツ幅を制限

## セキュリティ

### Firestore セキュリティルール（推奨）

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

### 認証の永続化

- **browserLocalPersistence:** ブラウザを閉じてもログイン状態を保持
- **browserSessionPersistence:** ブラウザを閉じるとログアウト

## パフォーマンス最適化

### リアルタイム更新

- `onSnapshot`を使用してFirestoreの変更をリアルタイムで反映
- 不要なリスナーは`unsubscribe`で解除

### クエリ最適化

- `where`句でユーザーごとのデータのみ取得
- クライアント側でソート（インデックス不要）

### ビルド最適化

- Viteによる高速ビルド
- Tree-shakingによる不要コードの削除
- コード分割（動的インポート）

## デプロイ

### ビルドコマンド

```bash
npm run build
```

### 出力

- `dist/` ディレクトリに静的ファイルが生成される
- Firebase Hosting、Vercel、Netlifyなどにデプロイ可能

### 環境変数（オプション）

本番環境では、Firebase設定を環境変数に移行することを推奨：

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
```

## テスト戦略

### 単体テスト

- コンポーネントのロジックテスト
- バリデーション関数のテスト

### 統合テスト

- Firebase Emulatorを使用したテスト
- 認証フローのテスト
- データベース操作のテスト

### E2Eテスト

- Playwrightを使用したブラウザテスト
- ユーザーフローの検証

## 今後の拡張性

### 機能追加の候補

1. **予約編集機能**
   - 既存予約の日時変更
   - サービス変更

2. **通知機能**
   - 予約確認メール
   - リマインダー通知

3. **管理者機能**
   - 全予約の閲覧
   - 予約の承認/拒否

4. **カレンダー表示**
   - 月間カレンダービュー
   - 空き時間の可視化

5. **多言語対応**
   - i18nライブラリの導入
   - 英語/日本語切り替え

### スケーラビリティ

- Firebaseの無料枠: 月間50,000読み取り、20,000書き込み
- 有料プランへの移行で無制限にスケール可能
- Cloud Functionsを追加してサーバーサイド処理を実装可能

## まとめ

本システムは、モダンなWeb技術とFirebaseのサーバーレスアーキテクチャを組み合わせることで、高速で保守性の高い予約管理システムを実現しています。React Hooksによる状態管理、Tailwind CSSによる効率的なスタイリング、Firestoreのリアルタイム更新により、優れたユーザー体験を提供します。
