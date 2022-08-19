import { IList } from '../interfaces/list.interface';
const ENV = process.env.TOKEN ? process.env.TOKEN : '@shoppinglist';

export default function treatOldList(): Array<IList> | [] {
  const lists = localStorage.getItem(ENV);

  if (lists) {
    const parsedLists: Array<IList> = JSON.parse(lists);
    const checkIfItemHasShowField = parsedLists.map((list) => {
      if (list.show === undefined) {
        list = {
          ...list,
          show: true,
        };
      }
      list = {
        ...list,
        items: list.items.map((item) => {
          if (item.show === undefined) {
            item = {
              ...item,
              show: true,
            };
          }
          if (item.qtd === undefined) {
            item = {
              ...item,
              qtd: 1,
            };
          }
          return item;
        }),
      };
      return list;
    });
    return checkIfItemHasShowField;
  }
  return [];
}
