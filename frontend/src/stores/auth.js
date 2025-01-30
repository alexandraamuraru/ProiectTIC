import { defineStore } from 'pinia';
import { firebaseService } from '../services/firebase-service';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        loading: false,
        error: null
    }),
    
    actions: {
        async login(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const user = await firebaseService.login(email, password);
                this.user = user;
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async register(email, password) {
            this.loading = true;
            this.error = null;
            try {
                const user = await firebaseService.register(email, password);
                this.user = user;
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async logout() {
            try {
                await firebaseService.logout();
                this.user = null;
            } catch (error) {
                this.error = error.message;
                throw error;
            }
        },

        async initializeAuth() {
            try {
                const user = await firebaseService.getCurrentUser();
                this.user = user;
            } catch (error) {
                this.error = error.message;
            }
        }
    },

    getters: {
        isAuthenticated: (state) => !!state.user,
        currentUser: (state) => state.user
    }
});