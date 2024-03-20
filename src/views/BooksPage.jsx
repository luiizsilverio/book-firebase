import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Book from '../components/Book.jsx';
import Header from '../components/Header.jsx';
import { selectUsers } from '../store/usersSlice.js';
import { fetchBooks, selectBooks } from '../store/booksSlice.js';

function BooksPage() {
  const dispatch = useDispatch();
  const { books, status: bookStatus } = useSelector(selectBooks);
  const {currentUser} = useSelector(selectUsers);  
  
  useEffect(() => {    
    if (bookStatus === 'idle') {
      dispatch(fetchBooks());
    }

  }, [bookStatus, currentUser, dispatch]);
  

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
