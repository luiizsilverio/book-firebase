import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

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
          {
            bookStatus == 'loading' 
              ? 
                <strong>Aguarde...</strong>

              : books.length ? 
                <div className="books-list">
                  {
                    books.map(book =>
                      <Book key={book.id} book={book}  />
                    )
                  }
                </div>

              : 
                <div>
                  Sua lista de livros está fazia. <Link to="/add-book">Clique aqui</Link> para criar um livro.
                </div>
          }
        </div>
      </div>
    </>
  )
}

export default BooksPage
