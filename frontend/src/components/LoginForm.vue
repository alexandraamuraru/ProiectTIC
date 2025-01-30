<template>
    <div class="auth-form">
      <h2>Login</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Enter your email"
          >
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="Enter your password"
          >
        </div>
  
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
  
        <button type="submit" :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
  
        <p class="auth-link">
          Don't have an account? 
          <router-link to="/register">Register</router-link>
        </p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import { storeToRefs } from 'pinia';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const { loading, error } = storeToRefs(authStore);
  
  const email = ref('');
  const password = ref('');
  
  const handleSubmit = async () => {
    try {
      await authStore.login(email.value, password.value);
      router.push('/'); // Redirect to home page after successful login
    } catch (err) {
      console.error('Login error:', err);
    }
  };
  </script>
  
  <style scoped>
  .auth-form {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:disabled {
    background-color: #cccccc;
  }
  
  .error-message {
    color: red;
    margin-bottom: 1rem;
  }
  
  .auth-link {
    text-align: center;
    margin-top: 1rem;
  }
  </style>