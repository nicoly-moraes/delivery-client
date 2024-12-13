<template>
  <v-card :variant="smAndUp ? 'outlined' : 'text'" :hover="smAndUp">
    <div class="product-card">
      <div v-if="image">
        <img :src="image" />
      </div>

      <div class="product-card-text">
        <p class="product-card-title">{{ name }}</p>
        <p class="product-card-description">{{ description }}</p>
        <p class="product-card-price text-success">{{ formattedPrice }}</p>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

const { smAndUp } = useDisplay();

const props = defineProps<{
  name: string,
  description: string,
  image: string,
  price: number,
}>();

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(props.price);
});
</script>

<style lang="scss">
.v-card {
  height: 100%;
}

.v-card--variant-outlined {
  border-color: #f2f2f2 !important;

  &::before {
    box-shadow: none !important;
  }
}

.product-card {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 20px;
  
  @media (min-width: 600px) {
    padding: 10px;
  }

  @media (min-width: 960px) {
    padding: 20px;
  }

  img {
    width: 98px;
    height: 98px;
    object-fit: cover;
    border-radius: 4px;
  }

  .product-card-text {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .product-card-title {
      color: #3e3e3e;
      font-size: .875rem;
      line-height: 1.125rem;
      font-weight: 500;

      @media (min-width: 600px) {
        font-size: 1rem;
        line-height: 1.25rem;
      }
    }

    .product-card-info {
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
