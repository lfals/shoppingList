// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB5FV37qeu5aQ6pZHDKyiOwF26U4Puq5yw',
  authDomain: 'shoppinglist-359121.firebaseapp.com',
  projectId: 'shoppinglist-359121',
  storageBucket: 'shoppinglist-359121.appspot.com',
  messagingSenderId: '593451657918',
  appId: '1:593451657918:web:3c2eabb39883d43e224cef',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
