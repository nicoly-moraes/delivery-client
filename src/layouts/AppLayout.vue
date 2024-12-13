<template>
  <v-app id="inspire">
    <v-app-bar class="px-6">
      <v-app-bar-title class="ma-0">
        <v-btn class="bg-white" size="x-large" @click="toHome">Delivery</v-btn>
      </v-app-bar-title>

      <v-btn
        v-if="isCartEmpty"
        class="btn-cart bg-primary" 
        size="large" 
        prepend-icon="mdi-cart-outline" 
        @click="drawer = !drawer"
      >
        <div class="d-flex flex-column">
          <p>{{ totalLbl }}</p>
          <p>{{ formattedPrice }} <small> / {{ qtyLbl }}</small></p>
        </div>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" width="600" location="right" temporary>
      <AppCartDetails @done="drawer = false" />
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import AppCartDetails from '@/components/AppCartDetails.vue';
import { CartStore } from '@/store/cart.store';
import { useRouter } from 'vue-router';

const router = useRouter();

const drawer = ref<boolean>(false)
const isCartEmpty = computed(() => !!CartStore.cart?.items?.length)

const totalLbl = computed(() => {
  const restaurant = CartStore.cart?.restaurant;
  if (restaurant && restaurant.deliveryPrice.value > 0) {
    return 'Total sem a entrega';
  }
  return 'Total com entrega grátis';
})

const qtyLbl = computed(() => {
  const qty = CartStore.totalQuantity;
  return `${qty} ite${qty > 1 ? 'ms' : 'm' }`;
})

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(CartStore.totalPrice);
});

watch(isCartEmpty, (value) => {
  drawer.value = value === false ? false : drawer.value
})

function toHome() {
  router.push({ name: 'home' })
}
</script>

<style scoped lang="scss">
.btn-cart {
  p {
    font-size: 0.75rem;
    letter-spacing: 0;
    text-transform: none;

    small {
      font-size: 0.625rem;
    }
  }
}
</style>