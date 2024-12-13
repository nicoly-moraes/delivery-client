<template>
  <div class="d-flex pa-6 pb-4 ga-2 align-center restaurant-info">
    <img class="rounded-circle" :src="CartStore.cart?.restaurant.image" />
    <h2>{{ CartStore.cart?.restaurant.name }}</h2>
  </div>

  <v-list :items="items" lines="three" item-props>
    <template v-slot:subtitle="{ subtitle, item }">
      <p class="text-truncate" v-html="subtitle"></p>
      <p class="text-success mt-1">{{ item.price }}</p>
    </template>

    <template v-slot:append="{ item }">
      <AppQuantity 
        small 
        trash 
        :quantity="item.quantity"
        @update:quantity="updateQty(item.index, $event)" 
        @delete="deleteItem(item.index)"
      />
    </template>
  </v-list>

  <div class="d-flex flex-column position-sticky bottom-0 bg-white border-t-sm py-4 px-6">
    <ul class="mb-3">
      <li class="d-flex justify-space-between">
        <span class="mb-2 resume-title">Resumo</span>
      </li>
      <li class="d-flex justify-space-between">
        <span class="item-price">Subtotal</span>
        <span class="item-price">{{ formattedSubtotalPrice }}</span>
      </li>
      <li class="d-flex justify-space-between mt-1">
        <span class="item-price">Taxa de entrega</span>
        <span 
          class="item-price"
          :class="{ 'text-success': CartStore.cart?.restaurant.deliveryPrice.value === 0 }"
        >
          {{ CartStore.cart?.restaurant.deliveryPrice.text }}
        </span>
      </li>
      <li class="d-flex justify-space-between mt-2">
        <span class="total-price">Total</span>
        <span class="total-price">{{ formattedTotalPrice }}</span>
      </li>
    </ul>

    <v-btn class="bg-primary" size="large" @click="buy">{{ isCartValid ? 'Finalizar Comprar' : 'Continuar' }}</v-btn>
  </div>

  <v-snackbar v-model="snackbar.show" color="red" :timeout="2000">{{ snackbar.text }}</v-snackbar>

  <AppAddressDialog ref="addressDialog" />
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import AppQuantity from './AppQuantity.vue';
import { CartStore } from '@/store/cart.store';
import AppAddressDialog from './AppAddressDialog.vue';
import Swal from 'sweetalert2';
import OrderService from '@/services/order.service';

const emit = defineEmits(['done'])

const addressDialog = ref<InstanceType<typeof AppAddressDialog> | null>(null);

const snackbar = reactive({ show: false, text: '' });

const items = computed(() => {
  return CartStore.cart?.items?.map((item, index) => {
    return {
      index: index,
      prependAvatar: item.product.image,
      title: item.product.name,
      subtitle: item.product.description,
      quantity: item.quantity,
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(item.product.price * item.quantity),
    }
  })
})

const isCartValid = computed(() => {
  const { cart } = CartStore;
  return cart && cart.paymentType && cart.customerAddress
})

const formattedSubtotalPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(CartStore.totalPrice);
});

const formattedTotalPrice = computed(() => {
  const deliveryPrice = CartStore.cart?.restaurant.deliveryPrice.value ?? 0
  const cartPrice = CartStore.totalPrice
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(deliveryPrice + cartPrice);
});

function deleteItem(index: number) {
  CartStore.removeItem(index)
  snackbar.show = true
  snackbar.text = "Item Removido!"
}

function updateQty(index: number, qty: number) {
  const item = CartStore.cart!.items[index]
  item.quantity = qty
  CartStore.updateItem(index, item)
}

function buy() {
  const { cart } = CartStore;
  if (!cart?.paymentType || !cart?.customerAddress) {
    addressDialog.value?.open()
  } else {
    Swal.fire({
      title: "Enviando Pedido...",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    const address = cart.customerAddress;
    const addressLine1 = `${address.street}, ${address.number}`;
    let addressLine2 = `${address.neighborhood}`;
    if (address.complement) {
      addressLine2 += `, ${address.complement}`;
    }

    const items = cart.items.map((item) => {
      return {
        productId: item.product.id,
        quantity: item.quantity,
        notes: item.notes,
      }
    })

    OrderService.create({
      restaurantId: cart.restaurant.id,
      paymentType: cart.paymentType,
      addressLine1: addressLine1,
      addressLine2: addressLine2,
      city: address.city,
      state: address.state,
      country: 'Brasil',
      postalCode: address.zip,
      items: items
    }).then(() => {
      Swal.close();

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Pedido Realizado!",
        showConfirmButton: false,
        timer: 1500
      });

      CartStore.clear()

      emit('done')
    }).catch(() => {
      Swal.close();
    })
  }  
}
</script>

<style scoped lang="scss">
.restaurant-info {
  img {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }

  h2 {
    font-size: 1.125rem;
  }
}

.resume-title {
  font-size: 0.875rem;
}

.item-price {
  font-size: 0.75rem;
  color: #717171;
}

.total-price {
  font-size: 1rem;
}
</style>