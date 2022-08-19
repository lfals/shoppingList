import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import {
  transformNumberToPrice,
  transformPriceToNumber,
} from '../functions/currency.treatment.function';
import { listRecoilContext } from './list.hook';

function useSumListsTotalAmountHook() {
  const [listRecoil] = useRecoilState(listRecoilContext);
  const [amount, setAmount] = useState('');

  function sumTotalValues(): any {
    const newList = listRecoil
      .map((list) => {
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

    const initialValue = 0;
    const totalValue = newList.reduce(
      (previousValue: any, currentValue: any) => {
        return previousValue + currentValue;
      },
      initialValue
    );

    return transformNumberToPrice(totalValue);
  }

  useEffect(() => {
    setAmount(sumTotalValues());
  }, [listRecoil]);

  return [amount];
}

export default useSumListsTotalAmountHook;
