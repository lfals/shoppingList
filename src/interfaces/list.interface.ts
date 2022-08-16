interface IList {
  id: string;
  name: string;
  show: boolean;
  items: Array<IProduct>;
}

interface IProduct {
  id: string;
  name: string;
  store: string;
  link: string;
  image?: string;
  price: string;
  show?: boolean;
  qtd: number;
}

export type { IList, IProduct };
