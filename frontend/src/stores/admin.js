import { defineStore } from 'pinia';
import api from '../services/api';

export const useAdminStore = defineStore('admin', {
  state: () => ({
    users: [],
    librarians: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await api.get('/users');
        this.users = response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createLibrarian(librarianData) {
      this.loading = true;
      try {
        const response = await api.post('/users/librarian', librarianData);
        await this.fetchUsers();
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUserRole(userId, role) {
      this.loading = true;
      try {
        await api.put(`/users/${userId}/role`, { role });
        await this.fetchUsers();
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUserStatus(userId, status) {
      this.loading = true;
      try {
        await api.put(`/users/${userId}`, { status });
        await this.fetchUsers();
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    getLibrarians: (state) => 
      state.users.filter(user => user.role === 'librarian'),
    
    getMembers: (state) => 
      state.users.filter(user => user.role === 'member')
  }
});