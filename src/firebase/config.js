import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyChcFruOZ42erJ-JUyC1a9ss8uTYGFnOpY",
  authDomain: "buzz-blogs.firebaseapp.com",
  projectId: "buzz-blogs",
  storageBucket: "buzz-blogs.appspot.com",
  messagingSenderId: "677245325552",
  appId: "1:677245325552:web:c323cc0024306d700c3235"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);