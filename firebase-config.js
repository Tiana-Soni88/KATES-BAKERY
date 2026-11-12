// js/firebase-config.js
// -------------------------------------------
// Initializes Firebase and exports the database
// connection for use by other modules.
// -------------------------------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAZZiutL6T7EfSb4ZFw50WPbIq3oX5MlmQ",
  authDomain: "bakery-e4e4d.firebaseapp.com",
  databaseURL: "https://bakery-e4e4d-default-rtdb.firebaseio.com",
  projectId: "bakery-e4e4d",
  storageBucket: "bakery-e4e4d.firebasestorage.app",
  messagingSenderId: "378903375442",
  appId: "1:378903375442:web:f183c93909112818a7398b",
  measurementId: "G-XGLTBEHXK9"
};
// Initialize the Firebase app once
const app = initializeApp(firebaseConfig);

// Export the Firestore database instance
export const db = getFirestore(app);