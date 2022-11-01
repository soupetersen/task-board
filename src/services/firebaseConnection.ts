import firebase from "firebase/app";
import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "", //put your api key here
  authDomain: "boardapp-next.firebaseapp.com",
  projectId: "boardapp-next",
  storageBucket: "boardapp-next.appspot.com",
  messagingSenderId: "391941796254",
  appId: "1:391941796254:web:ab7cfb52086bd4242da68f",
  measurementId: "G-2TZMC4W2TY",
};

if (getApps().length < 1) {
  initializeApp(firebaseConfig); // Initialize other firebase products here
}

const db = getFirestore();

export default db;
