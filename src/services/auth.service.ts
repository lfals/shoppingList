import { appAuth } from '../services/firebase.service';
import {
  browserLocalPersistence,
  getRedirectResult,
  GoogleAuthProvider,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  TwitterAuthProvider,
  User,
} from 'firebase/auth';

async function signInWithGoogle() {
  return setPersistence(appAuth, browserLocalPersistence)
    .then(async () => {
      const provider = new GoogleAuthProvider();
      return signInWithPopup(appAuth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          if (!credential) {
            console.log(`credentials vazio`);
            return null;
          }

          const user = result.user;
          return user;
        })
        .catch((error) => {
          console.log(error);
          return null;
        });
    })
    .catch((error) => {
      console.log(error);

      return null;
    });
}

async function signInWithTwitter(): Promise<User | null> {
  return setPersistence(appAuth, browserLocalPersistence)
    .then(async () => {
      const provider = new TwitterAuthProvider();
      return signInWithPopup(appAuth, provider)
        .then((result) => {
          const credential = TwitterAuthProvider.credentialFromResult(result);
          if (!credential) {
            console.log('erro no credential');
            return null;
          }
          const user = result.user;
          return user;
        })
        .catch((error) => {
          console.log(error);
          return null;
        });
    })
    .catch((error) => {
      return null;
    });
}

function signOutApp() {
  signOut(appAuth)
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
