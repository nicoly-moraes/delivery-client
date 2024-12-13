import type { Address } from "@/models/address.model";
import type { Cart, CartItem, PaymentType } from "@/models/cart.model";

export const CART_KEY = "cart";

import { reactive } from 'vue'

interface CartState {
  cart: Cart | null;
  totalPrice: number;
  totalQuantity: number;
  save(cart: Cart | null): void;
  saveAddress(address: Address): void;
  savePaymentType(paymentType: PaymentType): void;
  addItem(item: CartItem): void;
  updateItem(index: number, item: CartItem): void;
  removeItem(index: number): void;
  clear(): void;
}

export const CartStore = reactive<CartState>({
  cart: JSON.parse(localStorage.getItem(CART_KEY) || "null"),

  get totalPrice(): number {
    return this.cart?.items.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0
  },

  get totalQuantity(): number {
    return this.cart?.items.reduce((total, item) => total + item.quantity, 0) || 0
  },

  save(cart: Cart | null): void {
    this.cart = cart
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  },

  saveAddress(address: Address): void {
    const cart = this.cart;
    if (cart) {
      cart.customerAddress = address
      this.save(cart)
    }
  },

  savePaymentType(paymentType: PaymentType): void {
    const cart = this.cart;
    if (cart) {
      cart.paymentType = paymentType
      this.save(cart)
    }
  },

  addItem(item: CartItem): void {
    const cart = this.cart;
    if (cart) {
      cart.items.push(item);
      this.save(cart)
    }
  },

  updateItem(index: number, item: CartItem): void {
    const cart = this.cart;
    if (cart) {
      cart.items[index] = item;
      this.save(cart);
    }
  },

  removeItem(index: number): void {
    const cart = this.cart;
    if (cart) {
      cart.items.splice(index, 1);
      this.save(cart);
    }
  },

  clear(): void {
    this.save(null)
  }
});