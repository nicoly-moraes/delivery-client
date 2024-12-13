import type { Customer } from "@/models/customer";

export const USER_KEY = "user";

import { reactive } from 'vue'

interface UserState {
  user: {
    id: number;
    email: string;
    token: string;
    customer: Customer;
  } | null,
  setUser(id: number, email: string, token: string, customer: Customer): void;
}

export const UserStore = reactive<UserState>({
  user: JSON.parse(localStorage.getItem(USER_KEY) || "null"),

  setUser(id: number, email: string, token: string, customer: Customer): void {
    this.user = {
      id,
      email,
      token,
      customer,
    }
    localStorage.setItem(USER_KEY, JSON.stringify(this.user));
  }
});