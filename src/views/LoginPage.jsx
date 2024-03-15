import {useState} from 'react';
import { useDispatch } from 'react-redux';
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword
} from 'firebase/auth';

import { auth } from '../firebase/config.js';
import { setUser } from '../store/usersSlice.js';
import FullPageLoader from '../components/FullPageLoader.jsx';

function LoginPage() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [loginType, setLoginType] = useState('login');
  const [userCredentials, setUserCredentials] = useState({});
  const [errorCode, setErrorCode] = useState("");


  function handleCredentials(e) {
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value })
  }
  

  function handleSignup(e) {
    e.preventDefault();
    setErrorCode('');
    // signOut(auth);

    createUserWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch(setUser({ id: user.uid, email: user.email }));
      })
      .catch((error) => {
        setErrorCode(error.code);
        console.log(error.message);
      })
  }


  function handlePasswordReset() {
    const email = prompt('Digite o seu e-mail');

    sendPasswordResetEmail(auth, email);

    alert('E-mail enviado! Verifique sua caixa de entrada');
  }


  function handleLogin(e) {
    e.preventDefault();
    setErrorCode('');

    signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
    // .then((userCredential) => {
    //   const user = userCredential.user;
    //   dispatch(setUser({ id: user.uid, email: user.email }));
    // })
    .catch((error) => {
      setErrorCode(error.code);
      console.log(error.message);
    })
  }


  onAuthStateChanged(auth, (user) => {
    if (user) {
      dispatch(setUser({ id: user.uid, email: user.email }));
    } else {
      dispatch(setUser(null));
    }
    
    if (isLoading) {
      setIsLoading(false);
    }
  })

  return (
    <>
      { isLoading && <FullPageLoader></FullPageLoader> }
      
      <div className="container login-page">
        <section>
          <h1>Welcome to the Book App</h1>
          <p>Login or create an account to continue</p>
          <div className="login-type">
            <button 
              className={`btn ${loginType == 'login' ? 'selected' : ''}`}
              onClick={()=>setLoginType('login')}>
                Login
            </button>
            <button 
              className={`btn ${loginType == 'signup' ? 'selected' : ''}`}
              onClick={()=>setLoginType('signup')}>
                Signup
            </button>
          </div>

          <form className="add-form login">
            <div className="form-control">
                <label>Email *</label>
                <input 
                  type="text" 
                  name="email" 
                  placeholder="Enter your email"
                  onChange={(e) => handleCredentials(e)} 
                />
            </div>
            <div className="form-control">
                <label>Password *</label>
                <input 
                  type="password" 
                  name="password" 
                  placeholder="Enter your password"
                  onChange={(e) => handleCredentials(e)} 
                />
            </div>

            {
              loginType == 'login' ?
              <button className="active btn btn-block" onClick={(e) => handleLogin(e)}>
                Login
              </button>
              : 
              <button className="active btn btn-block" onClick={(e) => handleSignup(e)}>
                Sign Up
              </button>
            }

            {errorCode && 
              <div className="error">{`Erro (${errorCode})`}</div>
            }

            <p onClick={handlePasswordReset} className="forgot-password">Forgot Password?</p>              
          </form>
        </section>
      </div>
    </>
  )
}
  
export default LoginPage
  