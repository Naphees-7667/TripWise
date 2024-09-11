// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDZgSpOm3tPxOE_h5k3cqvOVbruArH7EoY",
  authDomain: "tripwise-d26d4.firebaseapp.com",
  projectId: "tripwise-d26d4",
  storageBucket: "tripwise-d26d4.appspot.com",
  messagingSenderId: "814095296706",
  appId: "1:814095296706:web:24c174888ffcba8470f35b"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);