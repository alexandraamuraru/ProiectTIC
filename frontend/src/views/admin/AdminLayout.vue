<template>
    <div>
      <main class="admin-content">
        <router-view></router-view>
      </main>
    </div>
  </template>
  
  <script setup>
  </script>
  
  <style scoped>
  .admin-layout {
    display: flex;
    min-height: 100vh;
  }
  
  .admin-sidebar {
    width: 250px;
    background-color: #2c3e50;
    color: white;
    padding: 1rem;
  }
  
  .sidebar-header {
    padding: 1rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .nav-links {
    list-style: none;
    padding: 0;
    margin: 2rem 0;
  }
  
  .nav-links li {
    margin: 1rem 0;
  }
  
  .nav-links li a {
    color: white;
    text-decoration: none;
  }
  
  .admin-content {
    flex: 1;
    padding: 2rem;
    background-color: #f5f6fa;
  }
  </style>
  