// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCNqZC_TopvpOH4mK3PZ90nDeCgZ3XLL8s",
  authDomain: "transactionbook-4bb66.firebaseapp.com",
  projectId: "transactionbook-4bb66",
  storageBucket: "transactionbook-4bb66.firebasestorage.app",
  messagingSenderId: "794670299635",
  appId: "1:794670299635:web:bb673f087e432e0e9fba86",
  measurementId: "G-G1LQ3C7K21",
};

const app = initializeApp(firebaseConfig);

export default app;
