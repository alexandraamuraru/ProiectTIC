import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBZTJdqVG6HvIklr3mMU7gcJ_ffXMptT3Q",
    authDomain: "proiecttic-de660.firebaseapp.com",
    projectId: "proiecttic-de660",
    storageBucket: "proiecttic-de660.firebasestorage.app",
    messagingSenderId: "488643633283",
    appId: "1:488643633283:web:21275caf271f09608a3bb6"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log('User is signed in:', user.email);
    } else {
        console.log('User is signed out');
    }
});