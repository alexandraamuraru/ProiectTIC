<template>
  <div class="auth-form">
    <div class="form-header">
      <h2>Login</h2>
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
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" :disabled="loading" class="submit-btn">
        {{ loading ? 'Loading...' : 'Login' }}
      </button>

      <div class="auth-link">
        Don't have an account? 
        <router-link to="/register" class="register-link">Register</router-link>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { loading, error } = storeToRefs(authStore);

const email = ref('');
const password = ref('');

const handleSubmit = async () => {
  try {
    await authStore.login(email.value, password.value);
  } catch (err) {
    console.error('Login error:', err);
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
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
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

.submit-btn:hover {
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

.register-link {
  color: #3498db;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.register-link:hover {
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