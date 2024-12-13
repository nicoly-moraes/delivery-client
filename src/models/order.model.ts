import type { PaymentType } from "./cart.model";

export interface Order {
  restaurantId: number;
  postalCode: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  paymentType: PaymentType;
  items: OrderItem[]
}

export interface OrderItem {
  productId: number;
  quantity: number;
  notes?: string;
}