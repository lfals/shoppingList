import { list } from '@chakra-ui/styled-system';
import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { writeUserData } from '../functions/database.function';
import { IList, IProduct } from '../interfaces/list.interface';
import { listRecoilContext } from './list.hook';
import useAuth from './user.hook';
const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

function useLists() {
  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);
  const [user] = useAuth();
  async function setLists(lists: IList[]) {
    let toSortItems: Array<IProduct> = [];
    const sortedLists = lists.map(list => {
      toSortItems = list.items.slice().sort((a, b) => a.name.localeCompare(b.name));
      return { ...list, items: toSortItems }
    })

    setListRecoil(sortedLists);
    if (user) {
      await writeUserData(user.uid, sortedLists);
      return;
    }

    localStorage.setItem(ENV, JSON.stringify(sortedLists));
  }

  return [listRecoil, setLists] as const;
}

export default useLists;
