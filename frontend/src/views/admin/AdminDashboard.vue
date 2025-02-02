<template>
    <div class="admin-dashboard">
      <header class="admin-header">
        <h1>Hello, Admin!</h1>
        <p>What would you like to do today?</p>
      </header>
  
      <div class="admin-actions">
        <button class="action-btn" @click="redirectTo('/admin/users')">
          Manage Users
        </button>
        <button class="action-btn" @click="redirectTo('/admin/librarians')">
          Manage Librarians
        </button>
        <button class="action-btn" @click="redirectTo('/admin/loans')">
          Manage Loans
        </button>
        <button class="action-btn" @click="redirectTo('/books')">
          Manage Books
        </button>
      </div>

    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();

  const redirectTo = (path) => {
    router.push(path);
  };
  </script>
  
  <style scoped>
  .admin-dashboard {
    padding: 2rem;
    background-color: #f5f6fa;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .admin-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .admin-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 300px;
  }
  
  .action-btn {
    width: 100%;
    padding: 1rem;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .action-btn:hover {
    background-color: #34495e;
  }

  </style>
  