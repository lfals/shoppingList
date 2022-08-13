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
  image?: string;
  price: string;
  show?: boolean;
}

export type { IList, IProduct };
