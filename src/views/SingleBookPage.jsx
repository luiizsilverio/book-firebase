import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { doc, getDoc } from 'firebase/firestore';

import Notes from '../components/Notes.jsx';
import {eraseBook, toggleRead} from '../store/booksSlice.js';
import { db } from '../firebase/config.js';

function SingleBookPage() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {id} = useParams();
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState("loading");

  function handleEraseBook(id) {
    if(confirm('Are you sure you want to erase this book and all notes associated with it?')){
      dispatch(eraseBook(id));
      // dispatch(eraseBookNotes(id));
      navigate("/");
    }
  }

  function handleToggleRead(id, isRead) {
    dispatch(toggleRead({ id, isRead }));
    setBook({ ...book, isRead: !isRead });
  }

  async function fetchBook(book_id) {
    try {
      const docRef = doc(db, "books", book_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setBook({ ...docSnap.data(), id: docSnap.id })
      }

      setStatus("success");
    } 
    catch(err) {
      console.log(err);
      setStatus("error");
    }
  }

  useEffect(() => {    
    if (status == "loading") {
      fetchBook(id);
    }

  }, [id, status]);
  
  
    return (
      <>
        <div className="container">
            <Link to="/">
              <button className="btn">
                  ← Back to Books
              </button>
            </Link>

            {book ?
            
            <div>
              <div className="single-book">
                <div className="book-cover">
                    <img src={book.cover} />
                </div>

                <div className="book-details">
                    <h3 className="book-title">{ book.title }</h3>
                    <h4 className="book-author">{ book.author }</h4>
                    <p>{book.synopsis}</p>
                    <div className="read-checkbox">
                        <input 
                          onClick={()=>handleToggleRead( book.id, book.isRead )}
                          type="checkbox" 
                          defaultChecked={book.isRead} />
                        <label>{ book.isRead ? "Já leu" : "Ainda não leu" }</label>
                    </div>
                    <div onClick={()=>handleEraseBook(book.id)} className="erase-book">
                        Erase book
                    </div>
                </div>
              </div>

              <Notes bookId={id} />
            </div> 
            
            : status == "success" ?
            
              <div>
                <p>Livro não encontrado. Clique no botão acima para voltar para a lista.</p>
              </div>

            : status == "error" ?

              <div>
                <p>Erro ao buscar o livro.</p>
              </div>

            :

              <div>
                <p>Aguarde...</p>
              </div>

            }

        </div>
      </>
    )
  }
  
  export default SingleBookPage
  