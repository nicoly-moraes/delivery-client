import type { Customer } from "@/models/customer";
import api from "@/services/api.service";
import { UserStore } from "@/store/user.store";

const AuthService = {
  async login(
    email: string,
    password: string
  ): Promise<{ id: number; email: string; token: string; customer: Customer }> {
    const res = await api.post("/auth/login", { email, password });
    UserStore.setUser(res.data.id, res.data.email, res.data.token, res.data.customer);
    return res.data;
  },

  async register(
    name: string,
    cpf: string,
    phone: string,
    email: string,
    password: string,
  ): Promise<{ id: number; email: string; token: string; customer: Customer }> {
    const res = await api.post("/customers", { name, cpf, phone, email, password });
    UserStore.setUser(res.data.id, res.data.email, res.data.token, res.data.customer);
    return res.data;
  },
};

export default AuthService;
