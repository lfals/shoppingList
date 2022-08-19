import React, { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { IList } from '../interfaces/list.interface';
import { listRecoilContext } from './list.hook';
const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

function useLists() {
  const [listRecoil, setListRecoil] = useRecoilState(listRecoilContext);

  useEffect(() => {
    const currentStorage = localStorage.getItem(ENV);
    if (!currentStorage) {
      return;
    }
    const parsedStorage = JSON.parse(currentStorage);
    setListRecoil(parsedStorage);
  }, []);

  function setLists(lists: IList[]) {
    setListRecoil(lists);
    localStorage.setItem(ENV, JSON.stringify(lists));
  }

  useEffect(() => {}, []);

  return [listRecoil, setLists] as const;
}

export default useLists;
