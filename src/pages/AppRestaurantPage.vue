<template>
  <v-container>
    <div class="restaurant-head" v-if="restaurant">
      <img :src="restaurant.image" />
      <div class="restaurant-text">
        <h1 class="restaurant-name">{{ restaurant.name }}</h1>
        <p class="restaurant-info">
          <span>Entrega</span>
          <span>•</span>
          <span v-if="restaurant.deliveryPrice.value > 0">{{ restaurant.deliveryPrice.text }}</span>
          <span v-else class="text-success font-weight-medium">Grátis</span>
        </p>
      </div>
    </div>

    <v-row v-for="category of restaurant?.categories" :key="category.id">
      <v-col class="mt-2" cols="12">
        <h2 class="section-title">{{ category.name }}</h2>
      </v-col>

      <v-col cols="12" sm="6" v-for="product of category?.products" :key="product.id">
        <AppProductCard
          :name="product.name"
          :description="product.description"
          :price="product.price"
          :image="product.image"
          @click="openProductModal(product)"
        />
      </v-col>
    </v-row>

    <AppProductDialog ref="productModal" @productAdded="onProductAdded" />

    <v-snackbar v-model="snackbar.show" :timeout="1500">{{ snackbar.text }}</v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppProductCard from '@/components/AppProductCard.vue';
import AppProductDialog from '@/components/AppProductDialog.vue';
import type { Product } from '@/models/product';
import type { Restaurant } from '@/models/restaurant';
import RestaurantService from '@/services/restaurant.service';

const route = useRoute()

const restaurant = ref<Restaurant | null>(null);
const productModal = ref<InstanceType<typeof AppProductDialog> | null>(null);
const snackbar = reactive({ show: false, text: '' });

onMounted(() => {
  loadRestaurant()
})

function openProductModal(product: Product) {
  productModal.value?.open({ product, restaurant: restaurant.value! })
}

function loadRestaurant() {
  RestaurantService.getRestaurantById(+route.params.id).then((data) => {
    restaurant.value = data
  })
}

function onProductAdded() {
  snackbar.show = true
  snackbar.text = "Item Adicionado!"
}
</script>

<style lang="scss">
.restaurant-head {
  display: flex;
  align-items: center;
  gap: 20px;
  margin: 30px 0;

  img {
    width: 75px;
    height: 75px;
    object-fit: cover;
    border-radius: 100%;
  }

  .restaurant-text {
    display: flex;
    flex-direction: column;
    gap: 5px;
    
    .restaurant-name {
      font-size: 2.25rem;
      line-height: 2.375rem;
      letter-spacing: -1px;
      font-weight: 400;
      color: #3e3e3e;
    }

    .restaurant-info {
      display: flex;
      gap: 5px;
      font-weight: 300;
      color: #717171;
      font-size: .75rem;
      line-height: 1rem;

      @media (min-width: 600px) {
        font-size: .875rem;
        line-height: 1.125rem;
      }
    }
  }
}
</style>
