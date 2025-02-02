<template>
  <Navbar />
  <div id="app">
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f5f6fa;
  color: #2c3e50;
}

#app {
  min-height: 100vh;
  min-width: 100%;
  display: flex;
  flex-direction: column;
}

.main-content {
  padding-top: 80px;
  flex: 1;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
}
</style>