<template>
    <div class="auth-form">
      <h2>Register</h2>
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
  
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            placeholder="Confirm your password"
          >
        </div>
  
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
  
        <button type="submit" :disabled="loading || !isValidForm">
          {{ loading ? 'Loading...' : 'Register' }}
        </button>
  
        <p class="auth-link">
          Already have an account? 
          <router-link to="/login">Login</router-link>
        </p>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../stores/auth';
  import { storeToRefs } from 'pinia';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const { loading, error } = storeToRefs(authStore);
  
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  
  const isValidForm = computed(() => {
    return password.value === confirmPassword.value && password.value.length >= 6;
  });
  
  const handleSubmit = async () => {
    if (!isValidForm.value) {
      return;
    }
    
    try {
      await authStore.register(email.value, password.value);
      router.push('/'); // Redirect to home page after successful registration
    } catch (err) {
      console.error('Registration error:', err);
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