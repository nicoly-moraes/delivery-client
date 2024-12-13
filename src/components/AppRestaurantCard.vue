<template>
  <v-card :variant="variant" :hover="hover">
    <div class="restaurant-card">
      <div>
        <img :src="image" />
      </div>

      <div class="restaurant-card-text">
        <p class="restaurant-card-title text-truncate">{{ name }}</p>
        <p class="restaurant-card-info">
          <span>Entrega</span>
          <span>•</span>
          <span v-if="deliveryPrice != 'Grátis'">{{ deliveryPrice }}</span>
          <span v-else class="text-success font-weight-medium">Grátis</span>
        </p>
      </div>
    </div>
  </v-card>
</template>

<script lang="ts">
export default {
  props: {
    name: String,
    image: String,
    deliveryPrice: String
  },

  computed: {
    variant() {
      if (this.$vuetify.display.smAndUp) {
        return 'outlined';
      }
      return 'text';
    },
    hover() {
      if (this.$vuetify.display.smAndUp) {
        return true;
      }
      return false;
    },
  },
}
</script>

<style lang="scss">
.v-card--variant-outlined {
  border-color: #f2f2f2 !important;

  &::before {
    box-shadow: none !important;
  }
}

.restaurant-card {
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
    width: 56px;
    height: 56px;
    object-fit: cover;
    border-radius: 100%;
  }

  .restaurant-card-text {
    display: flex;
    flex-direction: column;
    gap: 5px;

    .restaurant-card-title {
      color: #3e3e3e;
      font-size: .875rem;
      line-height: 1.125rem;
      font-weight: 500;

      @media (min-width: 600px) {
        font-size: 1rem;
        line-height: 1.25rem;
      }
    }

    .restaurant-card-info {
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
