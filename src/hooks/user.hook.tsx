import { onAuthStateChanged, User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import handleAuth from '../services/auth.service';
import { appAuth } from '../services/firebase.service';
import { listRecoilContext } from './list.hook';

function useAuth() {
  const { signIn, signOut } = handleAuth;
  const [user, setUser] = useState<User | null>();
  const router = useRouter();

  async function twitter() {
    router.push('/');

    signIn.twitter();
  }
  async function google() {
    router.push('/');

    signIn.google();
  }

  async function logOut() {
    signOut();
    router.push('/');
  }

  const login = {
    twitter,
    google,
  };

  useEffect(() => {
    onAuthStateChanged(appAuth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  return [user, login, logOut] as const;
}

export default useAuth;
