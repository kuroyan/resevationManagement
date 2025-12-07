import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Calendar, Clock, Trash2 } from 'lucide-react';

interface Reservation {
  id: string;
  date: string;
  time: string;
  service: string;
  status: string;
}

export default function ReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'reservations'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      // クライアント側でソート
      data.sort((a, b) => b.date.localeCompare(a.date));
      setReservations(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('この予約を削除しますか？')) {
      await deleteDoc(doc(db, 'reservations', id));
    }
  };

  if (loading) {
    return <div className="text-center py-8">読み込み中...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">予約一覧</h2>

      {reservations.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-sm sm:text-base">予約がありません</p>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {reservations.map((reservation) => (
            <div
              key={reservation.id}
              className="border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">
                  {reservation.service}
                </h3>
                <button
                  onClick={() => handleDelete(reservation.id)}
                  className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm sm:text-base"
                  aria-label="削除"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">削除</span>
                </button>
              </div>
              
              <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                  <span>{reservation.date}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
                  <span>{reservation.time}</span>
                </div>
              </div>
              
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium ${
                reservation.status === 'confirmed' 
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {reservation.status === 'confirmed' ? '確定' : '保留中'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
