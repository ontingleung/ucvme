import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; 


const firebaseConfig = {
  apiKey: "AIzaSyBqZK7lRUWl6IykFqmj6UlITHc4HeVACAM",
  authDomain: "ucvme-global.firebaseapp.com",
  projectId: "ucvme-global",
  storageBucket: "ucvme-global.appspot.com",
  messagingSenderId: "418189691386",
  appId: "1:418189691386:web:d858edea36cccd6e093c43"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {
  auth,
  db,
  storage
};