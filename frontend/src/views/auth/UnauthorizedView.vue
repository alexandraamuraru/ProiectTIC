<template>
    <div class="unauthorized-container">
      <div class="unauthorized-content">
        <div class="icon-container">
          <i class="fas fa-lock"></i>
        </div>
        
        <h1>Access Denied</h1>
        
        <p class="message">
          Sorry, you don't have permission to access this page.
        </p>
        
        <div class="actions">
          <button @click="goBack" class="back-button">
            <i class="fas fa-arrow-left"></i> Go Back
          </button>
          
          <router-link to="/" class="home-button">
            <i class="fas fa-home"></i> Go to Home
          </router-link>
        </div>
  
        <div class="help-text">
          If you believe this is an error, please contact your administrator
          or <button @click="handleLogout" class="logout-link">logout</button> and try again.
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const goBack = () => {
    router.go(-1);
  };
  
  const handleLogout = async () => {
    try {
      await authStore.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  </script>
  
  <style scoped>
  .unauthorized-container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f8f9fa;
    padding: 1rem;
  }
  
  .unauthorized-content {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 500px;
    width: 100%;
  }
  
  .icon-container {
    margin-bottom: 1.5rem;
  }
  
  .icon-container i {
    font-size: 4rem;
    color: #dc3545;
  }
  
  h1 {
    color: #2c3e50;
    margin-bottom: 1rem;
    font-size: 2rem;
  }
  
  .message {
    color: #6c757d;
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.5;
  }
  
  .actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .back-button,
  .home-button {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
    text-decoration: none;
  }
  
  .back-button {
    background-color: #6c757d;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .back-button:hover {
    background-color: #5a6268;
  }
  
  .home-button {
    background-color: #007bff;
    color: white;
  }
  
  .home-button:hover {
    background-color: #0056b3;
  }
  
  .help-text {
    color: #6c757d;
    font-size: 0.9rem;
    line-height: 1.5;
  }
  
  .logout-link {
    background: none;
    border: none;
    color: #007bff;
    padding: 0;
    font-size: inherit;
    cursor: pointer;
    text-decoration: underline;
  }
  
  .logout-link:hover {
    color: #0056b3;
  }
  
  /* Responsive adjustments */
  @media (max-width: 480px) {
    .unauthorized-content {
      padding: 1.5rem;
    }
  
    .actions {
      flex-direction: column;
    }
  
    .back-button,
    .home-button {
      width: 100%;
      justify-content: center;
    }
  
    h1 {
      font-size: 1.75rem;
    }
  
    .icon-container i {
      font-size: 3rem;
    }
  }
  </style>