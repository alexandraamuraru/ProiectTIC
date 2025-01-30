<template>
    <div class="home">
      <h1>Welcome {{ user?.email }}</h1>
      <button @click="handleLogout">Logout</button>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '../stores/auth';
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const authStore = useAuthStore();
  const { user } = storeToRefs(authStore);
  
  const handleLogout = async () => {
    try {
      await authStore.logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
</script>