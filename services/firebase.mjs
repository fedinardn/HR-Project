// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC52ZFhNEaBluWYbTEikL3R0S8daPlbEa0",
  authDomain: "adin-hr.firebaseapp.com",
  projectId: "adin-hr",
  storageBucket: "adin-hr.appspot.com",
  messagingSenderId: "781509385453",
  appId: "1:781509385453:web:ab2784f5b8ecf0255740e4",
  measurementId: "G-QRVW5D8F2W",
  // databaseURL: "https://adin-hr-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const db = getFirestore(app)

export { db }