import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import { auth } from '../config/firebase-config';

export const firebaseService = {
    async register(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    },

    async logout() {
        try {
            await signOut(auth);
        } catch (error) {
            throw error;
        }
    },

    getCurrentUser() {
        return new Promise((resolve, reject) => {
            const unsubscribe = auth.onAuthStateChanged(user => {
                unsubscribe();
                resolve(user);
            }, reject);
        });
    }
};