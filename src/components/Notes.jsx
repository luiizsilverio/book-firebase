/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config.js';


function Notes({bookId}) {
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("loading");

  async function handleEraseNote(id) {
    if(confirm('Are you sure you want to erase this note?')) {
      try {
        await deleteDoc(doc(db, "notes", id));
        setNotes(notes.filter(note => note.id !== id));
      }
      catch (err) {
        alert('Erro ao excluir nota');
      }
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();

    const newNote = {
      book_id: bookId,
      title: document.querySelector('input[name=title]').value,
      text: document.querySelector('textarea[name=note]').value
    }

    if (newNote.title && newNote.text) {
        try {
          const docRef = await addDoc(collection(db, "notes"), newNote);
          newNote.id = docRef.id;
          setNotes([...notes, newNote]);

          document.querySelector('input[name=title]').value = "";
          document.querySelector('textarea[name=note]').value = "";
        }
        catch (err) {
          alert("Erro ao adicionar nota");
        }
    } else {
        alert('Please fill the mandatory fields.');
    }
  }
 
  async function fetchNotes(book_id) {
    try {
      const q = query(collection(db, "notes"), where("book_id", "==", book_id));
      const querySnapshot = await getDocs(q);
      const lstNotes = [];

      querySnapshot.forEach((doc) => {
        lstNotes.push({...doc.data(), id: doc.id})
      })

      setNotes(lstNotes);
      setStatus("success");
    } 
    catch(err) {
      console.log(err);
      setStatus("error");
    }
  }

  useEffect(() => {    
    if (status == "loading") {
      fetchNotes(bookId);
    }
  }, [bookId, status]);
  

  return (
    <>
      <div className="notes-wrapper">

          <h2>Reader's Notes</h2>

          {notes.length ?

            <div className="notes">
              {notes.map(note => 
                <div key={note.id} className="note">
                    <div onClick={()=>handleEraseNote(note.id)} className="erase-note">Erase note</div>
                    <h3>{note.title}</h3>
                    <p>{note.text}</p>
                </div>
              )}
            </div>

          : status == "success" ?
          
            <div>
              <p>
                Este livro ainda não possui notas. <br />
                Use o formulário abaixo para adicionar uma nota.
              </p>
            </div>

          : status == "error" ?

            <div>
              <p>Erro ao buscar as notas.</p>
            </div>

          :

            <div>
              <p>Aguarde...</p>
            </div>
          }
          

          <details>
              <summary>Add a note</summary>
              <form className="add-note">
                  <div className="form-control">
                      <label>Title *</label>
                      <input type="text" name="title" placeholder="Add a note title" />
                  </div>
                  <div className="form-control">
                      <label>Note *</label>
                      <textarea type="text" name="note" placeholder="Add note" />
                  </div>
                  
                  <button onClick={(e)=>{handleAddNote(e)}}className="btn btn-block">Add Note</button>
              </form>
          </details>

      </div>

    </>
  )
}
  
export default Notes
  