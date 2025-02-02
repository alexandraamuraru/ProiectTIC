<template>
  <div class="books-dashboard">
    <div class="search-bar">
      <input
        type="text"
        v-model="searchTerm"
        placeholder="Search books..."
        @keyup.enter="handleSearch"
      />
      <button @click="handleSearch">Search</button>
      <button v-if="isAdminOrLibrarian" @click="handleAddBook">
        Add Book
      </button>
    </div>

    <div class="books-list">
      <div
        class="book-item"
        v-for="book in bookStore.books"
        :key="book.id"
        @click="selectBook(book.id)"
      >
        <span class="book-title">{{ book.title }}</span>
        <span class="book-author">{{ book.author }}</span>
        <span class="book-stock">Total Copies: {{ book.totalCopies }}</span>
      </div>
    </div>

    <div class="book-details-modal" v-if="showDetails">
      <div class="modal-content">
        <h3>{{ isNew ? 'Add New Book' : 'Book Details' }}</h3>
        <div class="field">
          <label>Title:</label>
          <input
            v-model="editableBook.title"
            :readonly="!isAdminOrLibrarian"
          />
        </div>
        <div class="field">
          <label>Author:</label>
          <input
            v-model="editableBook.author"
            :readonly="!isAdminOrLibrarian"
          />
        </div>
        <div class="field">
          <label>Total Copies No.:</label>
          <input
            type="number"
            v-model.number="editableBook.totalCopies"
            :readonly="!isAdminOrLibrarian"
          />
        </div>
        <div class="field">
          <label>ISBN:</label>
          <input
            v-model="editableBook.ISBN"
            :readonly="!isAdminOrLibrarian"
          />
        </div>
        <div class="field">
          <label>Publisher:</label>
          <input
            v-model="editableBook.publisher"
            :readonly="!isAdminOrLibrarian"
          />
        </div>
        <div class="field">
          <label>Year of publishing:</label>
          <input
            type="number"
            v-model.number="editableBook.publishedYear"
            :readonly="!isAdminOrLibrarian"
          />
        </div>

        <div class="modal-buttons">
          <button @click="closeDetails">Close</button>
          <button v-if="isAdminOrLibrarian" @click="saveBook">
            Save
          </button>
          <button v-else @click="addToLoan">
            Add to Loan
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useBookStore } from '../../stores/books';
import { useAuthStore } from '../../stores/auth';

const bookStore = useBookStore();
const authStore = useAuthStore();

const searchTerm = ref('');
const showDetails = ref(false);
const isNew = ref(false); 
const editableBook = ref({});

const isAdminOrLibrarian = computed(() => {
  return (
    authStore.userDetails &&
    (authStore.userDetails.role === 'admin' ||
      authStore.userDetails.role === 'librarian')
  );
});

bookStore.fetchBooks();

const handleSearch = async () => {
  if (searchTerm.value.trim()) {
    await bookStore.searchBooks(searchTerm.value.trim());
  } else {
    await bookStore.fetchBooks();
  }
};

const selectBook = async (bookId) => {
  await bookStore.fetchBookById(bookId);
  editableBook.value = { ...bookStore.currentBook };
  isNew.value = false;
  showDetails.value = true;
};

const handleAddBook = () => {
  editableBook.value = { title: '', author: '', totalCopies: 0, ISBN: '', publisher: '', publishedYear: 0  };
  isNew.value = true;
  showDetails.value = true;
};

const closeDetails = () => {
  showDetails.value = false;
  editableBook.value = {};
};

const saveBook = async () => {
  try {
    const payload = {
      title: editableBook.value.title,
      author: editableBook.value.author,
      totalCopies: editableBook.value.totalCopies,
      ISBN: editableBook.value.ISBN,
      publisher: editableBook.value.publisher,
      publishedYear: editableBook.value.publishedYear
    };
    if (isNew.value) {
      await bookStore.addBook(payload);
    } else {
      await bookStore.updateBook({
        id: editableBook.value.id,
        ...payload
      });
    }
    await bookStore.fetchBooks();
    closeDetails();
  } catch (error) {
    console.error('Error saving book:', error);
  }
};

const addToLoan = () => {
  console.log('Adding book to loan:', editableBook.value);
  closeDetails();
};
</script>

<style scoped>
.books-dashboard {
  padding: 1rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search-bar input {
  flex: 1;
  padding: 0.5rem;
  font-size: 1rem;
}

.search-bar button {
  padding: 0.5rem 1rem;
  font-size: 1rem;
  cursor: pointer;
}

.books-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.book-item {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.book-item:hover {
  background-color: #f0f0f0;
}

.book-details-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 4px;
  width: 300px;
}

.field {
  margin-bottom: 1rem;
}

.field label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.field input {
  width: 100%;
  padding: 0.5rem;
  box-sizing: border-box;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.modal-buttons button {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>
