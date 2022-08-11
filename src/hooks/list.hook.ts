import { atom } from 'recoil';

interface IList {
  id?: string;
  name: string;
  items: Array<IProduct>;
}

interface IProduct {
  id: string;
  name: string;
  store: string;
  link: string;
  image: string;
  price: string;
}

export const listRecoilContext = atom({
  key: 'contexList',
  default: [] as IList[],
});
