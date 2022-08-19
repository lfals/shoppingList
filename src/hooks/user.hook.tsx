import { User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import handleAuth from '../services/auth.service';
import { appAuth } from '../services/firebase.service';

function useAuth() {
  const { signIn, signOut } = handleAuth;
  const [user, setUser] = useState<User | null>();

  async function twitter() {
    const newUser = await signIn.twitter();
    setUser(newUser);
  }
  async function google() {
    const newUser = await signIn.google();
    setUser(newUser);
  }

  async function logOut() {
    signOut();
    setUser(null);
  }

  const login = {
    twitter,
    google,
  };

  useEffect(() => {
    setUser(appAuth.currentUser);
  }, []);

  return [user, login, logOut] as const;
}

export default useAuth;
