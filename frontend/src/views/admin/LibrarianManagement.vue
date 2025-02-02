<template>
    <div class="librarian-management">
      <header class="page-header">
        <h1>Librarian Management</h1>
        <button class="create-button" @click="toggleCreateForm">
          {{ showCreateForm ? 'Cancel' : 'Create Librarian' }}
        </button>
      </header>
  
      <div v-if="showCreateForm" class="modal-overlay">
        <div class="modal">
          <div class="modal-header">
            <h2>Create Librarian</h2>
            <button class="close-button" @click="toggleCreateForm">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createLibrarian">
              <div class="form-group">
                <label for="email">Email:</label>
                <input id="email" type="email" v-model="newLibrarian.email" required />
              </div>
              <div class="form-group">
                <label for="password">Password:</label>
                <input id="password" type="password" v-model="newLibrarian.password" required />
              </div>
              <div class="form-group">
                <label for="fullName">Full Name:</label>
                <input id="fullName" type="text" v-model="newLibrarian.fullName" required />
              </div>
              <button type="submit" class="submit-button">Submit</button>
            </form>
          </div>
        </div>
      </div>
  
      <div v-if="loading" class="loading">Loading...</div>
  
      <ul class="librarian-list">
        <li v-for="librarian in librarians" :key="librarian.id">
          <span class="librarian-info">
            {{ librarian.fullName }} - {{ librarian.email }}
          </span>
          <button class="delete-button" @click="deleteLibrarian(librarian.id)">Delete</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
import { ref, computed } from 'vue';
import { useUsersStore } from '@/stores/users';

const store = useUsersStore();

const showCreateForm = ref(false);
const newLibrarian = ref({
  email: '',
  password: '',
  fullName: '',
});

const loading = computed(() => store.loading);
const error = computed(() => store.error);
const librarians = computed(() =>
  store.users.filter((user) => user.role === 'librarian')
);

store.getAllUsers().catch((err) => {
  console.error('Error fetching users:', err);
});

const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
};

const createLibrarian = async () => {
  try {
    await store.createLibrarian(newLibrarian.value);
    await store.getAllUsers();
    newLibrarian.value = {
      email: '',
      password: '',
      fullName: '',
    };
    showCreateForm.value = false;
  } catch (err) {
    console.error('Error creating librarian:', err);
  }
};

const deleteLibrarian = async (userId) => {
  try {
    await store.deleteUser(userId);
    await store.getAllUsers();
  } catch (err) {
    console.error('Error deleting librarian:', err);
  }
};
</script>

<style scoped>
.librarian-management {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.15);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
}

/* Header styles */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #f39c12;
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
}

.page-header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
}

/* Create button styling */
.create-button {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.create-button:hover {
  background: #1a252f;
}

/* Librarian list styling */
.librarian-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.librarian-list li {
  background: #2c3e50;
  color: white;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
}

.librarian-info {
  font-size: 1rem;
  font-weight: bold;
}

/* Delete button style */
.delete-button {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s ease;
}

.delete-button:hover {
  background: #c0392b;
}

/* Loading and error messages */
.loading {
  color: #2c3e50;
  margin-top: 1rem;
  text-align: center;
}

.error {
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
}

/* Modal Overlay and Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #d1d1d1;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.4rem;
  color: #2c3e50;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.4rem;
  cursor: pointer;
  color: #2c3e50;
}

.modal-body {
  text-align: left;
}

/* Form styling */
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: bold;
  color: #2c3e50;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  font-size: 1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.submit-button {
  background: #f39c12;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s ease;
}

.submit-button:hover {
  background: #e67e22;
}
</style>


  