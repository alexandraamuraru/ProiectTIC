import { defineStore } from 'pinia';
import { firebaseService } from '../services/firebase-service';
import api from '../services/api';
import router from '../router/index'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')) || null,
        userDetails: JSON.parse(localStorage.getItem('userDetails')) || null,
        loading: false,
        error: null
    }),
    
    actions: {
        async login(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const firebaseUser = await firebaseService.login(email, password);

                const response = await api.get('/auth/me');

                this.user = firebaseUser;
                this.userDetails = response.data.user;

                localStorage.setItem('user', JSON.stringify(firebaseUser));
                localStorage.setItem('userDetails', JSON.stringify(response.data.user));

                if (this.userDetails.role === 'admin') {
                    router.push('/admin');
                } else if (this.userDetails.role === 'librarian') {
                    router.push('/librarian');
                } else {
                    router.push('/member');
                }
            } catch (error) {
                switch (error.code) {
                    case 'auth/invalid-credential':
                        this.error = 'Invalid email or password';
                        break;
                    case 'auth/user-not-found':
                        this.error = 'No account found with this email';
                        break;
                    case 'auth/wrong-password':
                        this.error = 'Incorrect password';
                        break;
                    default:
                        this.error = 'An error occurred during login';
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(fullName, email, password) {
            this.loading = true;
            this.error = null;
            try {
                const firebaseUser = await firebaseService.register(email, password);
                
                const uid = firebaseUser.uid;
                
                const response = await api.post('/auth/register', { 
                    fullName, 
                    email, 
                    uid
                });
                
                if (response.status === 201) {
                    await this.login(email, password);
                } throw new Error("Register failed");
            } catch (error) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        this.error = 'This email is already registered';
                        break;
                    case 'auth/weak-password':
                        this.error = 'Password should be at least 6 characters';
                        break;
                    case 'auth/invalid-email':
                        this.error = 'Invalid email address';
                        break;
                    default:
                        this.error = 'An error occurred during registration';
                }
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await firebaseService.logout();
                this.user = null;
                this.userDetails = null;

                localStorage.removeItem('user');
                localStorage.removeItem('userDetails');

                router.push('/login');
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        }
    },

    getters: {
        isAuthenticated: (state) => !!state.user,
        isAdmin: (state) => state.userDetails?.role === 'admin',
        isLibrarian: (state) => state.userDetails?.role === 'librarian',
        isStaff: (state) => ['admin', 'librarian'].includes(state.userDetails?.role)
    }
});