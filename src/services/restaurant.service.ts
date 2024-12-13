import type { Restaurant } from "@/models/restaurant";
import api from "@/services/api.service";

const RestaurantService = {
  async getRestaurants(): Promise<Restaurant[]> {
    const res = await api.get('/restaurants');

    return res.data.map((item: any) => {
      let deliveryPriceText = "Grátis";
      if (item.deliveryPrice > 0) {
        deliveryPriceText = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(item.deliveryPrice);
      }
  
      const restaurant: Restaurant = {
        id: Number(item.id),
        name: item.name,
        image: item.image,
        deliveryPrice: {
          value: item.deliveryPrice,
          text: deliveryPriceText,
        }
      }
  
      return restaurant;
    })
  },

  async getRestaurantById(id: number): Promise<Restaurant> {
    const res = await api.get(`/restaurants/${id}`);

    let deliveryPriceText = "Grátis";
    if (res.data.deliveryPrice > 0) {
      deliveryPriceText = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(res.data.deliveryPrice);
    }

    const restaurant: Restaurant = {
      id: Number(res.data.id),
      name: res.data.name,
      image: res.data.image,
      deliveryPrice: {
        value: res.data.deliveryPrice,
        text: deliveryPriceText,
      },
      categories: res.data.categories
    }

    return restaurant;
  }
};

export default RestaurantService;