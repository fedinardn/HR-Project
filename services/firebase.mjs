// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAapciJJ2F5C7dhTrJ1_Yg1tAmgsCS0obs",
  authDomain: "uma-update.firebaseapp.com",
  projectId: "uma-update",
  storageBucket: "uma-update.appspot.com",
  messagingSenderId: "1024334442806",
  appId: "1:1024334442806:web:5326640f223f31a797c397",
  measurementId: "G-EGFQV87YQS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app)

export { db }