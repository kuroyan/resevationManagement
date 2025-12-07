import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';
import Login from './components/Login';
import ReservationForm from './components/ReservationForm';
import ReservationList from './components/ReservationList';
import { LogOut } from 'lucide-react';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-10 shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">予約システム</h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{user.email}</p>
            </div>
            <button
              onClick={() => auth.signOut()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-lg font-medium text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>ログアウト</span>
            </button>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-4 space-y-4">
          <ReservationForm />
          <ReservationList />
        </div>
      </div>
    </div>
  );
}

export default App;
