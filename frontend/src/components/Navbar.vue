<template>
    <nav v-if="isAuthenticated" class="navbar">
      <div class="nav-content">
        <router-link to="/" class="nav-brand">Library System</router-link>
        <div class="nav-links">
          <router-link to="/books" class="nav-link">Books</router-link>
          <router-link to="/loans" class="nav-link">Loans</router-link>
          
          <router-link v-if="isAdmin" to="/librarians" class="nav-link">Librarians</router-link>
  
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useAuthStore } from '@/stores/auth';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const { isAuthenticated, isAdmin, isLibrarian } = storeToRefs(authStore);
  
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
.navbar {
  top: 0;
  left: 0;
  width: 100%;
  background-color: #2c3e50;
  padding: 1rem 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-radius: 0 0 12px 12px;
  display: flex;
  justify-content: center;
  z-index: 1000;
}

.nav-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  color: white;
  text-decoration: none;
  font-weight: bold;
  margin-right: auto; 
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.8;
}

.logout-btn {
  padding: 0.5rem 1rem;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.logout-btn:hover {
  background-color: #c0392b;
}

body {
  padding-top: 60px; 
}
</style>