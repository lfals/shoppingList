import { atom } from 'recoil';
import { IList } from '../interfaces/list.interface';

export const listRecoilContext = atom({
  key: 'contexList',
  default: [] as IList[],
});
