import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetMessage, setResetMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      // ログイン状態の永続化設定
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      // エラーメッセージを日本語に変換
      let errorMessage = 'エラーが発生しました';
      if (err.code === 'auth/invalid-credential') {
        errorMessage = 'メールアドレスまたはパスワードが正しくありません';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'このメールアドレスは既に使用されています';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'パスワードは6文字以上で設定してください';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'メールアドレスの形式が正しくありません';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'ユーザーが見つかりません';
      }
      setError(errorMessage);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('メールアドレスを入力してください');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage('パスワードリセットメールを送信しました。メールをご確認ください。');
      setError('');
    } catch (err: unknown) {
      if (err.code === 'auth/user-not-found') {
        setError('このメールアドレスは登録されていません');
      } else if (err.code === 'auth/invalid-email') {
        setError('メールアドレスの形式が正しくありません');
      } else {
        setError('メール送信に失敗しました');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        {/* タイトル */}
        <h1 className="text-4xl font-bold text-center text-cyan-500 mb-12">
          LOGIN
        </h1>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {resetMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Username/Email */}
          <div>
            <label className="block text-sm text-cyan-500 mb-2 font-medium">
              Username
            </label>
            <div className="relative">
              <Mail className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-7 pr-0 py-3 bg-transparent border-b-2 border-cyan-400 focus:border-cyan-500 outline-none text-gray-700 placeholder-gray-400 transition"
                placeholder="example@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-cyan-500 mb-2 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-0 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-7 pr-10 py-3 bg-transparent border-b-2 border-cyan-400 focus:border-cyan-500 outline-none text-gray-700 placeholder-gray-400 transition"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                />
                <span className="ml-2 text-sm text-gray-600">ログイン状態を保持</span>
              </label>
              <button
                type="button"
                onClick={handlePasswordReset}
                className="text-sm text-cyan-500 hover:text-cyan-600 transition"
              >
                パスワードを忘れた？
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-200 mt-8"
          >
            {isLogin ? 'LOGIN' : 'SIGN UP'}
          </button>
        </form>

        {/* Sign up link */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-cyan-500 hover:text-cyan-600 font-medium transition"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
