import { useState } from 'react';
import {
  transformNumberToPrice,
  transformPriceToNumber,
} from '../functions/currency.treatment.function';
import { IList } from '../interfaces/list.interface';

function useSumListsTotalAmountHook() {
  const [sumAmount, setSumAmount] = useState<IList[]>([]);

  function sumTotalValues(lists: IList[]): any {
    const newList = lists
      .map((list) => {
        console.log(list.show);
        if (list.show) {
          return list.items.map((item) => {
            if (item.show) {
              return transformPriceToNumber(item.price) * item.qtd;
            }
          });
        }
      })
      .flat(Infinity)
      .filter((value) => value !== undefined);

    console.log(newList);

    const initialValue = 0;
    const totalValue = newList.reduce(
      (previousValue: any, currentValue: any) => {
        return previousValue + currentValue;
      },
      initialValue
    );

    return transformNumberToPrice(totalValue);
  }

  const amount = sumTotalValues(sumAmount);

  return [amount, setSumAmount];
}

export default useSumListsTotalAmountHook;
