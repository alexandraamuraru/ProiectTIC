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
          <label>Year of Publishing:</label>
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
import { useLoanStore } from '../../stores/loans';

const bookStore = useBookStore();
const authStore = useAuthStore();
const loanStore = useLoanStore();

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

const addToLoan = async () => {
  const available = editableBook.value.totalCopies - (editableBook.value.currentLoans ? editableBook.value.currentLoans.length : 0);
  if (available <= 0) {
    alert('This book is not available for loan.');
    return;
  }
  try {
    await loanStore.createLoan({
      userId: authStore.user.uid,
      bookId: editableBook.value.id
    });
    alert('Loan created successfully!');
    await bookStore.fetchBooks();
  } catch (error) {
    console.error('Error creating loan:', error);
    alert('There was an error creating the loan.');
  } finally {
    closeDetails();
  }
};
</script>

<style scoped>
.books-dashboard {
  padding: 2rem;
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.search-bar {
  display: flex;
  width: 100%;
  max-width: 600px;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.search-bar input {
  flex: 1;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #d1d1d1;
  border-radius: 8px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

.search-bar button {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  background-color: #2c3e50;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.search-bar button:hover {
  background-color: #1a252f;
}

.books-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 700px;
  gap: 1rem;
}

.book-item {
  background: #2c3e50;
  color: white;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.book-item:hover {
  transform: translateY(-3px);
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
}

.book-title,
.book-author,
.book-stock {
  flex: 1;
  text-align: center;
  font-weight: bold;
}

.book-stock {
  font-size: 0.9rem;
  color: #f8c471;
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
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  box-shadow: 0px 6px 12px rgba(0, 0, 0, 0.3);
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
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.modal-buttons button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background-color: #f39c12;
  color: white;
  font-weight: bold;
  transition: background 0.3s ease;
}

.modal-buttons button:hover {
  background-color: #e67e22;
}
</style>

