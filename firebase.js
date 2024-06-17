// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

import fb from "firebase/app";
const firebaseConfig = {
  apiKey: "AIzaSyAapciJJ2F5C7dhTrJ1_Yg1tAmgsCS0obs",
  authDomain: "uma-update.firebaseapp.com",
  projectId: "uma-update",
  storageBucket: "uma-update.appspot.com",
  messagingSenderId: "1024334442806",
  appId: "1:1024334442806:web:5326640f223f31a797c397",
  measurementId: "G-EGFQV87YQS",
};
// const firebaseApp = initializeApp(firebaseConfig);
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApps()[0];
// const db = getFirestore(app)
// export {db}
export default firebaseApp;

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyC52ZFhNEaBluWYbTEikL3R0S8daPlbEa0",
//   authDomain: "adin-hr.firebaseapp.com",
//   // projectId: "adin-hr",
//   storageBucket: "adin-hr.appspot.com",
//   messagingSenderId: "781509385453",
//   appId: "1:781509385453:web:ab2784f5b8ecf0255740e4",
//   measurementId: "G-QRVW5D8F2W",
// };

// let firebaseApp
// if (!getApps().length) {
//   firebaseApp = initializeApp(firebaseConfig);

// } else {
//   firebaseApp = getApps()[0];
// }
// // export { db }
// export default firebaseApp;
