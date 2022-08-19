import { User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import handleAuth from '../services/auth.service';
import { appAuth } from '../services/firebase.service';
import { listRecoilContext } from './list.hook';

function useAuth() {
  const { signIn, signOut } = handleAuth;
  const [user, setUser] = useState<User | null>();
  const [, setListRecoil] = useRecoilState(listRecoilContext);

  async function twitter() {
    const newUser = await signIn.twitter();
    setListRecoil([]);
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
