// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "chatapp-67e9f.firebaseapp.com",
  projectId: "chatapp-67e9f",
  storageBucket: "chatapp-67e9f.appspot.com",
  messagingSenderId: "249412868125",
  appId: "1:249412868125:web:5c61b0f58cc47cac018ef4",
  measurementId: "G-BC5RGB21NK"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
