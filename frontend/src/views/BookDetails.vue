<template>
    <div class="book-details">
      <div v-if="loading" class="loading">
        <LoadingSpinner />
      </div>
  
      <div v-else-if="error" class="error">
        <ErrorAlert :message="error" />
      </div>
  
      <div v-else-if="currentBook" class="book-content">
        <div class="book-header">
          <h1>{{ currentBook.title }}</h1>
          <div class="book-status" :class="{ 'available': currentBook.inventory.available > 0 }">
            {{ currentBook.inventory.available > 0 ? 'Available' : 'Not Available' }}
          </div>
        </div>
  
        <div class="book-info">
          <div class="info-section">
            <h3>Book Details</h3>
            <p><strong>Author:</strong> {{ currentBook.author }}</p>
            <p><strong>ISBN:</strong> {{ currentBook.ISBN }}</p>
            <p><strong>Published Year:</strong> {{ currentBook.publishedYear }}</p>
            <p><strong>Category:</strong> {{ currentBook.category.name }}</p>
            <p><strong>Available Copies:</strong> {{ currentBook.inventory.available }}/{{ currentBook.inventory.total }}</p>
          </div>
  
          <div class="info-section">
            <h3>Description</h3>
            <p>{{ currentBook.description }}</p>
          </div>
  
          <div class="info-section" v-if="isStaff">
            <h3>Location</h3>
            <p><strong>Floor:</strong> {{ currentBook.location.floor }}</p>
            <p><strong>Section:</strong> {{ currentBook.location.section }}</p>
            <p><strong>Shelf:</strong> {{ currentBook.location.shelf }}</p>
          </div>
        </div>
  
        <div class="book-actions">
          <button 
            v-if="isStaff && currentBook.inventory.available > 0"
            @click="handleLoanBook" 
            class="btn-loan"
            :disabled="loading"
          >
            Loan Book
          </button>
          
          <button 
            v-if="isStaff"
            @click="handleEditBook" 
            class="btn-edit"
          >
            Edit Book
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useBookStore } from '../stores/books';
  import { useAuthStore } from '../stores/auth';
  import { storeToRefs } from 'pinia';
  import LoadingSpinner from '../components/LoadingSpinner.vue';
  import ErrorAlert from '../components/ErrorAlert.vue';
  
  const route = useRoute();
  const router = useRouter();
  const bookStore = useBookStore();
  const authStore = useAuthStore();
  
  const { currentBook, loading, error } = storeToRefs(bookStore);
  const { isStaff } = storeToRefs(authStore);
  
  const handleLoanBook = async () => {
    // This will be implemented when we add loan functionality
    console.log('Loan book:', currentBook.value.id);
  };
  
  const handleEditBook = () => {
    router.push(`/books/${currentBook.value.id}/edit`);
  };
  
  onMounted(async () => {
    await bookStore.fetchBookById(route.params.id);
  });
  </script>
  
  <style scoped>
  .book-details {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
  }
  
  .book-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .book-status {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: 500;
    background-color: #e74c3c;
    color: white;
  }
  
  .book-status.available {
    background-color: #2ecc71;
  }
  
  .book-info {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .info-section {
    margin-bottom: 2rem;
  }
  
  .info-section h3 {
    color: #2c3e50;
    margin-bottom: 1rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
  }
  
  .info-section p {
    margin-bottom: 0.5rem;
  }
  
  .book-actions {
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
  }
  
  .btn-loan, .btn-edit {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-loan {
    background-color: #2ecc71;
    color: white;
  }
  
  .btn-loan:hover {
    background-color: #27ae60;
  }
  
  .btn-edit {
    background-color: #3498db;
    color: white;
  }
  
  .btn-edit:hover {
    background-color: #2980b9;
  }
  
  .btn-loan:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
  </style>