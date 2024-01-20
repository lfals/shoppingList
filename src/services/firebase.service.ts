// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  databaseURL: 'https://robuylist-old-default-rtdb.firebaseio.com',
  
   apiKey: "AIzaSyB_cB2a4CvB-dPmcg-88d59aVv7WwRH2UA",
  authDomain: "robuylist-old.firebaseapp.com",
  projectId: "robuylist-old",
  storageBucket: "robuylist-old.appspot.com",
  messagingSenderId: "115806901043",
  appId: "1:115806901043:web:d85073225a860425faa446"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const appAuth = getAuth(app);
