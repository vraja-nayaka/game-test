// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "aAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
  authDomain: "name.firebaseapp.com",
  projectId: "name",
  storageBucket: "name.appspot.com",
  messagingSenderId: "1111111111",
  appId: "1:00000000000:web:0000000000000000",
  measurementId: "G-VVVVVVVVVV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);
