// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCeKVpUsu9dJM8Yex0d_fMRCMqbo_4-Cw4",
  authDomain: "moneymap-71331.firebaseapp.com",
  projectId: "moneymap-71331",
  storageBucket: "moneymap-71331.appspot.com",
  messagingSenderId: "633924790849",
  appId: "1:633924790849:web:fc27ba1f1aaecbd2d5b4c0",
  measurementId: "G-8CJLJZMZ91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export { db, auth, provider, doc, setDoc };