import { list } from '@chakra-ui/styled-system';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { writeUserData } from '../functions/database.function';
import { IList } from '../interfaces/list.interface';
import { listRecoilContext } from './list.hook';
import useAuth from './user.hook';
const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

function useLists() {
  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);
  const [user] = useAuth();

  function setLists(lists: IList[]) {
    setListRecoil(lists);
    if (user) {
      writeUserData(user.uid, lists);
      return;
    }

    localStorage.setItem(ENV, JSON.stringify(lists));
  }

  return [listRecoil, setLists] as const;
}

export default useLists;
