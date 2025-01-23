// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-1f093.firebaseapp.com",
  projectId: "mern-blog-1f093",
  storageBucket: "mern-blog-1f093.firebasestorage.app",
  messagingSenderId: "299195560487",
  appId: "1:299195560487:web:0d2efdcf3941d1e3a35402",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
