<template>
  <div class="member-dashboard">
    <header class="member-header">
      <h1>Hello!</h1>
      <p>What would you like to do today?</p>
    </header>

    <div class="member-actions">
      <button class="action-btn" @click="redirectTo('/loans')">
        See your loans
      </button>
      <button class="action-btn" @click="redirectTo('/books')">
        Select new books
      </button>
    </div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const redirectTo = (path) => {
  router.push(path);
};
</script>

<style scoped>
.member-dashboard {
  padding: 2rem;
  background-color: #f5f6fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.member-header {
  text-align: center;
  margin-bottom: 2rem;
}

.member-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
}

.action-btn {
  width: 100%;
  padding: 1rem;
  background-color: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #34495e;
}

</style>
