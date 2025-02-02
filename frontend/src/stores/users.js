import { defineStore } from 'pinia';
import api from '../services/api';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  actions: {
    async getAllUsers() {
      this.loading = true;
      try {
        const response = await api.get('/users');
        this.users = response.data;
        return this.users;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createMember(memberData) {
      this.loading = true;
      try {
        const response = await api.post('/users/member', memberData);
        return response.data;
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
        const response = await api.put(`/users/${userId}/role`, { role });
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(userId) {
      this.loading = true;
      try {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },
  },
});
