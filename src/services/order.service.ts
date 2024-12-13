import type { Order } from "@/models/order.model";
import type { Restaurant } from "@/models/restaurant";
import api from "@/services/api.service";

const OrderService = {
  async create(data: Order): Promise<Restaurant[]> {
    return await api.post('/orders', data);
  },
};

export default OrderService;