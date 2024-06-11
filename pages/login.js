import firebaseApp from '../firebase';
import StyledFirebaseAuth from './../components/StyledFirebaseAuth'
import { getAuth } from 'firebase/auth'
import { createUser } from '../services/database.mjs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID
  ],

  callbacks: {
    signInSuccess: function (currentUser, credential, redirectUrl) {
      createUser(currentUser.uid);
      redirectUrl = '/submitrequest';
      // return true
    }
      
  },

};


export default function LoginPage() {
  return <div>
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth(firebaseApp)} />
  </div>
}