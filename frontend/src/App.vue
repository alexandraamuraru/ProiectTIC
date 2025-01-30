<template>
  <div id="app">
    <nav v-if="isAuthenticated">
      <!-- Add navigation here -->
    </nav>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
</script>