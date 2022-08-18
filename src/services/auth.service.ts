import { auth } from '../services/firebase.service';
import {
  browserLocalPersistence,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  TwitterAuthProvider,
} from 'firebase/auth';

function signInWithGoogle() {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (!credential) {
            console.log(`credentials vazio`);
            return;
          }
          const token = credential.accessToken;
          console.log(token);

          const user = result.user;
          console.log(user);

          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = GoogleAuthProvider.credentialFromError(error);
          // ...
        });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function signInWithTwitter() {
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      const provider = new TwitterAuthProvider();
      signInWithPopup(auth, provider)
        .then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          const credential = TwitterAuthProvider.credentialFromResult(result);
          if (!credential) {
            console.log('erro no credential');
            return;
          }
          const token = credential.accessToken;
          const secret = credential.secret;
          const user = result.user;
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          console.log(error);

          const errorCode = error.code;
          const errorMessage = error.message;
          // The email of the user's account used.
          const email = error.customData.email;
          // The AuthCredential type that was used.
          const credential = TwitterAuthProvider.credentialFromError(error);
          // ...
        });
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function signOutApp() {
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}

const handleAuth = {
  signIn: {
    google: signInWithGoogle,
    twitter: signInWithTwitter,
  },
  signOut: signOutApp,
};

export default handleAuth;
