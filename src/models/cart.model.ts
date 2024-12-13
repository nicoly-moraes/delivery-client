import type { Address } from "./address.model";
import type { Product } from "./product";
import type { Restaurant } from "./restaurant";

export interface Cart {
  restaurant: Restaurant;
  customerAddress?: Address;
  paymentType?: PaymentType;
  items: CartItem[];
}

export interface CartItem {
  product: Product
  quantity: number;
  notes?: string;
}

export type PaymentType = 'CREDIT_CARD' | 'DEBIT_CARD' | 'CASH' | 'PIX';