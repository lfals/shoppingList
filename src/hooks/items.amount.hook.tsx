import React, { useState } from 'react';
import {
  transformPriceToNumber,
  transformNumberToPrice,
} from '../functions/currency.treatment.function';
import { IProduct } from '../interfaces/list.interface';

function useSumItemsTotalAmountHook() {
  const [sumAmount, setItemsToSum] = useState<IProduct[]>([]);

  function handlePriceSum(data: IProduct[]) {
    const initialValue = 0;
    const totalPrice = data.reduce(
      (previousValue: any, currentValue: IProduct) => {
        const { show, price, qtd } = currentValue;
        const currentPrice = show ? transformPriceToNumber(price) * qtd : 0;
        return previousValue + currentPrice;
      },
      initialValue
    );

    return totalPrice;
  }

  const sum = handlePriceSum(sumAmount);
  const sumPrice = transformNumberToPrice(sum);

  const itemsTotal = sumPrice;

  return [itemsTotal, setItemsToSum] as const;
}

export default useSumItemsTotalAmountHook;
