import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCnuaPubwn27W_gn9KnRFxRIEYk2cEjjVw",
  authDomain: "myreservation-app-f9508.firebaseapp.com",
  projectId: "myreservation-app-f9508",
  storageBucket: "myreservation-app-f9508.firebasestorage.app",
  messagingSenderId: "421807817718",
  appId: "1:421807817718:web:e7edcdac337384faaabdd7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
