import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase/config.js';


export const fetchBooks = createAsyncThunk('books/fetchBooks', async() => {
  let bookList = [];
  const q = query(collection(db, "books"), where("user_id", "==", auth.currentUser.uid));
  const qrySnapshot = await getDocs(q);
  qrySnapshot.forEach((doc) => {
    bookList.push({ id: doc.id, ...doc.data() });
  })
  return bookList;
})

export const toggleRead = createAsyncThunk('books/toggleRead', async() => {
  
})


export const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    status: 'idle'
  }, 
  reducers: {
    addBook: (books, action) => {
      let newBook = action.payload;
      newBook.id = books.length ? Math.max(...books.map(book => book.id)) + 1 : 1;
      books.push(newBook);
    },
    eraseBook: (books, action) => {
        return books.filter(book => book.id != action.payload);
    },
    toggleRead_OLD: (books, action) => {
        books.map(book => {
          if (book.id == action.payload) {
            book.isRead = !book.isRead;
          }
        });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBooks.pending, (state) => {
      state.status = 'loading';
      console.log('loading books...');
    });
    builder.addCase(fetchBooks.fulfilled, (state, action) => {
      state.status = 'success';
      state.books = action.payload;
      // console.log('success!');
    });
    builder.addCase(fetchBooks.rejected, (state, action) => {
      state.status = 'failed';
      console.log(action.error.message);
    });
  }
})

export const { addBook, eraseBook } = booksSlice.actions;

export const selectBooks = state => state.books;

export default booksSlice.reducer;
