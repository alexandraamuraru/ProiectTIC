import { defineStore } from 'pinia';
import { db } from '../config/firebase-config';
import api from '../services/api';
import { 
    collection, 
    getDocs, 
    getDoc, 
    doc, 
    query, 
    where 
} from 'firebase/firestore';

export const useBookStore = defineStore('books', {
    state: () => ({
        books: [],
        currentBook: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchBooks() {
            this.loading = true;
            try {
                const response = await api.get("/books");
                console.log(response);
        
                this.books = response.data.map(book => ({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    ISBN: book.ISBN,
                    publisher: book.publisher,
                    publishedYear: book.publishedYear,
                    totalCopies: book.totalCopies,
                    currentLoans: book.currentLoans || []
                }));
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },
        
        async fetchBookById(id) {
            this.loading = true;
            try {
                const docRef = doc(db, 'books', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    this.currentBook = { id: docSnap.id, ...docSnap.data() };
                }
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async searchBooks(searchTerm) {
            this.loading = true;
            try {
                const q = query(
                    collection(db, 'books'),
                    where('title', '>=', searchTerm),
                    where('title', '<=', searchTerm + '\uf8ff')
                );
                const querySnapshot = await getDocs(q);
                this.books = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
            } catch (error) {
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async addBook(newBook) {
            this.loading = true;
            try {
                const response = await api.post('/books', newBook);
                console.log(response)
              if (response.status !== 201) {
                throw new Error('Error creating book');
              }

              const data = await response.data;
              this.books.push(data);
              return data;
            } catch (error) {
              this.error = error.message;
              throw error;
            } finally {
              this.loading = false;
            }
        },

        async updateBook(book) {
            this.loading = true;
            try {
              // Use the book's id in the URL path
              const response = await api.put(`/books/${book.id}`, book);
              console.log(response);
              if (response.status !== 200) {
                throw new Error('Error updating book');
              }
              const data = response.data;
              // Optionally update your local state (e.g., update the book in this.books)
              return data;
            } catch (error) {
              this.error = error.message;
              throw error;
            } finally {
              this.loading = false;
            }
        }
      
    }
});