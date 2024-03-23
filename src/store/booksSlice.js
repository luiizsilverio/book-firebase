import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc, addDoc } from 'firebase/firestore';
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

export const toggleRead = createAsyncThunk('books/toggleRead', async(payload) => {
  const bookRef = doc(db, "books", payload.id);
  await updateDoc(bookRef, {
    isRead: !payload.isRead
  })
  return payload.id
})

export const eraseBook = createAsyncThunk('books/eraseBook', async(payload) => {
  await deleteDoc(doc(db, "books", payload));
  return payload;
})

export const addBook = createAsyncThunk('books/addBook', async(payload) => {
  const newBook = payload;
  newBook.user_id = auth.currentUser.uid;
  const docRef = await addDoc(collection(db, "books"), newBook);
  newBook.id = docRef.id;
  return newBook;
})

export const booksSlice = createSlice({
  name: 'books',
  initialState: {
    books: [],
    status: 'idle'
  }, 
  reducers: {
    addBook_OLD: (books, action) => {
      let newBook = action.payload;
      newBook.id = books.length ? Math.max(...books.map(book => book.id)) + 1 : 1;
      books.push(newBook);
    },
    eraseBook_OLD: (books, action) => {
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
    });
    builder.addCase(fetchBooks.rejected, (state, action) => {
      state.status = 'failed';
      console.log(action.error.message);
    });
    builder.addCase(toggleRead.fulfilled, (state, action) => {
      // state.status = 'success';
      state.books.map(book => {
        if (book.id == action.payload) {
          book.isRead = !book.isRead;
        } 
      })
    });
    builder.addCase(toggleRead.rejected, (state, action) => {
      state.status = 'failed';
      console.log(action.error.message);
    });
    builder.addCase(eraseBook.pending, (state) => {
      state.status = 'loading';
      console.log('erasing book...');
    });
    builder.addCase(eraseBook.fulfilled, (state, action) => {
      state.books = state.books.filter(book => book.id !== action.payload);
      state.status = 'success';
    });
    builder.addCase(eraseBook.rejected, (state, action) => {
      console.log(action.error.message);
      state.status = 'failed';
    });
    builder.addCase(addBook.pending, (state) => {
      state.status = 'loading';
      console.log('adding book...');
    });
    builder.addCase(addBook.fulfilled, (state, action) => {
      state.books.push(action.payload);
      state.status = 'success';
    });
    builder.addCase(addBook.rejected, (state, action) => {
      state.status = 'failed';
      console.log(action.error.message);
    });
  }
})

// export const { addBook } = booksSlice.actions;

export const selectBooks = state => state.books;

export default booksSlice.reducer;
