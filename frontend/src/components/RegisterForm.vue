<template>
    <div class="auth-form">
      <div class="form-header">
        <h2>Create Account</h2>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required 
            placeholder="Enter your email"
            class="form-input"
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
            class="form-input"
          >
          <small class="password-hint">Password must be at least 6 characters long</small>
        </div>
  
        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="confirmPassword" 
            required 
            placeholder="Confirm your password"
            class="form-input"
            :class="{ 'input-error': !passwordsMatch && confirmPassword }"
          >
          <small v-if="!passwordsMatch && confirmPassword" class="error-hint">
            Passwords do not match
          </small>
        </div>
  
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
  
        <button 
          type="submit" 
          :disabled="loading || !isValidForm" 
          class="submit-btn"
        >
          {{ loading ? 'Creating Account...' : 'Register' }}
        </button>
  
        <div class="auth-link">
          Already have an account? 
          <router-link to="/login" class="login-link">Login</router-link>
        </div>
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
  
  const passwordsMatch = computed(() => 
    password.value === confirmPassword.value
  );
  
  const isValidForm = computed(() => 
    password.value === confirmPassword.value && 
    password.value.length >= 6 &&
    email.value
  );
  
  const handleSubmit = async () => {
    if (!isValidForm.value) {
      return;
    }
    
    try {
      await authStore.register(email.value, password.value);
      router.push('/');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };
  </script>
  
  <style scoped>
  .auth-form {
    background: white;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .form-header {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .form-header h2 {
    color: #2c3e50;
    font-size: 1.8rem;
    font-weight: 600;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
    position: relative;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2c3e50;
    font-weight: 500;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: all 0.2s;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
  }
  
  .form-input.input-error {
    border-color: #e74c3c;
  }
  
  .form-input.input-error:focus {
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.1);
  }
  
  .password-hint {
    display: block;
    margin-top: 0.5rem;
    color: #666;
    font-size: 0.8rem;
  }
  
  .error-hint {
    display: block;
    margin-top: 0.5rem;
    color: #e74c3c;
    font-size: 0.8rem;
  }
  
  .submit-btn {
    width: 100%;
    padding: 0.75rem;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-bottom: 1rem;
  }
  
  .submit-btn:hover:not(:disabled) {
    background-color: #45a049;
  }
  
  .submit-btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .error-message {
    color: #e74c3c;
    background-color: #fde8e8;
    padding: 0.75rem;
    border-radius: 6px;
    margin-bottom: 1rem;
    text-align: center;
    font-size: 0.9rem;
  }
  
  .auth-link {
    text-align: center;
    color: #666;
    font-size: 0.9rem;
  }
  
  .login-link {
    color: #3498db;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }
  
  .login-link:hover {
    color: #2980b9;
    text-decoration: underline;
  }
  
  @media (max-width: 480px) {
    .auth-form {
      margin: 1rem;
      padding: 1.5rem;
    }
  
    .form-header h2 {
      font-size: 1.5rem;
    }
  }
  </style>