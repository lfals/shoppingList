import { useEffect } from 'react';
import handleAuth from '../services/auth.service';
import { auth } from '../services/firebase.service';

export default function Component() {
  const { signIn, signOut } = handleAuth;

  useEffect(() => {
    console.log(auth.currentUser);
  }, []);

  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn.google()}>Sign in G</button>
      ----------------
      <button onClick={() => signIn.twitter()}>Sign in T</button>
      ----------------
      <button onClick={() => signOut()}>signOut</button>
    </>
  );
}
