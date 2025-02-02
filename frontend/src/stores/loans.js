import { defineStore } from 'pinia';
import api from '../services/api';

export const useLoanStore = defineStore('loans', {
  state: () => ({
    loans: [],
    currentLoan: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchLoans() {
      this.loading = true;
      try {
        const response = await api.get('/loans');
        this.loans = response.data.loans;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async searchLoans(searchTerm) {
      this.loading = true;
      try {
        const response = await api.get('/loans', { params: { search: searchTerm } });
        this.loans = response.data.loans;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createLoan(payload) {
      this.loading = true;
      try {
        const response = await api.post('/loans', payload);
        if (response.status !== 201) {
          throw new Error('Error creating loan');
        }
        await this.fetchLoans();
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async returnLoan(loanId) {
      this.loading = true;
      try {
        const response = await api.put(`/loans/${loanId}/return`);
        if (response.status !== 200) {
          throw new Error('Error returning loan');
        }
        await this.fetchLoans();
        return response.data;
      } catch (error) {
        this.error = error.message;
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});
