import type { Category } from "./category";

export interface Restaurant {
  id: number;
  name: string;
  image: string;
  deliveryPrice: {
    value: number;
    text: string;
  };
  categories?: Category[];
}
