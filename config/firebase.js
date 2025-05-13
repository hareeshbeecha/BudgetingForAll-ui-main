// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrHhfZ30ymhqQqnzgE4MadH9jCWDP6A_A",
  authDomain: "budgeting-for-all-53d5d.firebaseapp.com",
  projectId: "budgeting-for-all-53d5d",
  storageBucket: "budgeting-for-all-53d5d.firebasestorage.app",
  messagingSenderId: "436010534471",
  appId: "1:436010534471:web:33573c8b318dffba549362"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup };