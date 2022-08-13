import { atom } from 'recoil';
import { IList } from '../interfaces/list.interface';

export const listAmountRecoilContext = atom({
  key: 'listSum',
  default: 'R$0,00',
});

function transformPriceToNumber(data: string): number {
  return parseFloat(
    data.replaceAll('.', '').replaceAll(',', '').replaceAll('R$', '')
  );
}

function transformNumberToPrice(value: number): string {
  const options = { minimumFractionDigits: 2 };
  const result = new Intl.NumberFormat('pt-BR', options).format(value / 100);

  return `R$ ${result}`;
}

export function sumTotalValues(lists: IList[]): any {
  const newList = lists
    .map((list) => {
      return list.items.map((item) => {
        if (item.show) {
          return transformPriceToNumber(item.price) * item.qtd;
        }
      });
    })
    .flat(Infinity)
    .filter((value) => value !== undefined);

  const initialValue = 0;
  const totalValue = newList.reduce((previousValue: any, currentValue: any) => {
    return previousValue + currentValue;
  }, initialValue);

  return transformNumberToPrice(totalValue);
}
