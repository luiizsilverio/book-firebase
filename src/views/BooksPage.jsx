import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import {useSelector} from 'react-redux';

import { db } from '../firebase/config.js';
import Book from '../components/Book.jsx';
import Header from '../components/Header.jsx';
import { selectUsers } from '../store/usersSlice.js';
// import {selectBooks} from '../store/booksSlice.js';

function BooksPage() {

  // const books = useSelector(selectBooks);
  const [books, setBooks] = useState([]);
  const {currentUser} = useSelector(selectUsers);    
  
  useEffect(() => {    
    const fetchBooks = async () => {
      let bookList = [];
      const q = query(collection(db, "books"), where("user_id", "==", currentUser?.id));
      const qrySnapshot = await getDocs(q);
      qrySnapshot.forEach((doc) => {
        bookList.push({ id: doc.id, ...doc.data() });
      })
      setBooks(bookList);
    }

    fetchBooks();
  }, []);
  

  return (
    <>
      <div className="container">
          <Header pageTitle="📖 Book List with Router, Redux & Firebase" />
          <div className="books-container">
              <div className="books-list">
                  
                  {books.map(book => 
                  
                  <Book key={book.id} book={book}  />
                  
                  )}

              </div>
          </div>
      </div>
    </>
  )
}

export default BooksPage
