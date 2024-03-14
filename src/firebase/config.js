// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCLNxv01NTFAxqgYSLPv-MtlknEJowYfU",
  authDomain: "projeto-cb42c.firebaseapp.com",
  projectId: "projeto-cb42c",
  storageBucket: "projeto-cb42c.appspot.com",
  messagingSenderId: "972192518900",
  appId: "1:972192518900:web:cfc57e443c1753815004a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
