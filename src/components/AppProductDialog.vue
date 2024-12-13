<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card :title="product?.name">
      <div class="d-flex flex-column pa-4">

        <img class="product-image" :src="product?.image" />

        <p class="mt-4">{{ product?.description }}</p>

        <p class="mt-4 text-success">{{ formattedPrice }}</p>

        <v-textarea
          v-model="notes"
          clearable
          class="mt-6"
          rows="3"
          label="Algum comentário?"
          variant="outlined"
        ></v-textarea>

      </div>

      <v-divider></v-divider>

      <v-card-actions class="d-flex justify-space-between w-100 pa-4 flex-wrap">
        <AppQuantity :quantity="quantity" @update:quantity="quantity = $event" />

        <AppBtnAddToCart :total="quantity * (product?.price || 1)" @click="addToCart" />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Product } from "@/models/product";
import { computed, ref } from "vue";
import AppQuantity from "./AppQuantity.vue";
import AppBtnAddToCart from "./AppBtnAddToCart.vue";
import { CartStore } from "@/store/cart.store";
import type { Restaurant } from "@/models/restaurant";

defineExpose({ open, close });

defineEmits(['productAdded'])

const dialog = ref<boolean>(false);
const product = ref<Product | null>(null);
const restaurant = ref<Restaurant | null>(null);
const quantity = ref<number>(1);
const notes = ref<string>('');

const formattedPrice = computed(() => {
  if (!product.value?.price) {
    return '';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.value?.price);
});

function open(data: { product: Product, restaurant: Restaurant }) {
  dialog.value = true;
  product.value = data.product;
  restaurant.value = data.restaurant;
  quantity.value = 1;
}

function close() {
  dialog.value = false;
}

function addToCart() {
  const cart = CartStore.cart
  const item = {
    product: product.value!,
    quantity: quantity.value,
    notes: notes.value,
  }
  if (cart) {
    CartStore.addItem(item, restaurant)
  } else {
    CartStore.save({
      restaurant: restaurant.value!,
      items: [item]
    })
  }
  close()
}
</script>

<style scoped>
.product-image {
  height: 300px;
  object-fit: cover;
  border-radius: 4px;
}
</style>