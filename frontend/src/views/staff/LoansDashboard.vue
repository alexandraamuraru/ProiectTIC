<template>
    <div class="loans-dashboard">
      <div class="search-bar" v-if="isAdminOrLibrarian">
        <input
          type="text"
          v-model="searchTerm"
          placeholder="Search loans by name..."
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch">Search</button>
      </div>
  
      <div class="loans-list">
        <div
          class="loan-item"
          v-for="loan in filteredLoans"
          :key="loan.id"
        >
          <span class="loan-loaner">{{ loan.userData.name }}</span>
          <span class="loan-book">{{ loan.bookData.title }}</span>
          <span class="loan-status">Status: {{ loan.status }}</span>
          <button
            v-if="isAdminOrLibrarian && loan.status === 'active'"
            @click="returnLoan(loan.id)"
          >
            Return
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useLoanStore } from '../../stores/loans';
  import { useAuthStore } from '../../stores/auth';
  import { useBookStore } from '../../stores/books';
  
  const loanStore = useLoanStore();
  const authStore = useAuthStore();
  const bookStore = useBookStore();
  
  const searchTerm = ref('');
  
  const isAdminOrLibrarian = computed(() => {
    return (
      authStore.userDetails &&
      (authStore.userDetails.role === 'admin' ||
        authStore.userDetails.role === 'librarian')
    );
  });
  
  onMounted(async () => {
    await loanStore.fetchLoans();
    await bookStore.fetchBooks();
  });
  
  const filteredLoans = computed(() => {
    if (isAdminOrLibrarian.value) {
      return loanStore.loans;
    } else {
      return loanStore.loans.filter(
        (loan) => loan.userData.userId === authStore.user.uid
      );
    }
  });
  
  const handleSearch = async () => {
    if (searchTerm.value.trim()) {
      try {
        await loanStore.searchLoans(searchTerm.value.trim());
      } catch (error) {
        console.error('Error searching loans:', error);
      }
    } else {
      await loanStore.fetchLoans();
    }
  };
  
  const returnLoan = async (loanId) => {
    try {
      await loanStore.returnLoan(loanId);
    } catch (error) {
      console.error('Error returning loan:', error);
    }
  };
  </script>
  
  <style scoped>
.loans-dashboard {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.search-bar {
  display: flex;
  width: 100%;
  max-width: 500px;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

.search-bar button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #2c3e50;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-bar button:hover {
  background-color: #1a252f;
}

.loans-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  gap: 1rem;
}

.loan-item {
  background: #2c3e50;
  color: white;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.loan-item:hover {
  transform: translateY(-3px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.loan-loaner,
.loan-book,
.loan-status {
  flex: 1;
  text-align: center;
  font-weight: bold;
}

.loan-status {
  font-size: 0.9rem;
  color: #f8c471;
}

button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f39c12;
  color: white;
  font-weight: bold;
  transition: background 0.3s ease;
}

button:hover {
  background-color: #e67e22;
}

.loan-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 350px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.field label {
  font-weight: bold;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.modal-buttons button {
  padding: 0.75rem 1.5rem;
}
</style>