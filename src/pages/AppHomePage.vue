<template>
  <v-container>
    <v-row>
      <v-col class="mt-2" cols="12">
        <h2 class="section-title">Lojas</h2>
      </v-col>

      <v-col v-for="restaurant of restaurants" :key="restaurant.id" cols="12" sm="6" lg="4" xl="3">

        <AppRestaurantCard
          :name="restaurant.name"
          :image="restaurant.image"
          :delivery-price="restaurant.deliveryPrice.text"
          :to="{ name: 'restaurants', params: { id: restaurant.id } }"
        />

      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import AppRestaurantCard from '@/components/AppRestaurantCard.vue';
import type { Restaurant } from '@/models/restaurant';
import RestaurantService from '@/services/restaurant.service';

export default {
  components: {
    AppRestaurantCard,
  },

  data() {
    return {
      restaurants: [] as Restaurant[]
    }
  },

  created() {
    this.loadRestaurants()
  },

  methods: {
    loadRestaurants() {
      RestaurantService.getRestaurants().then((data) => {
        this.restaurants = data
      })
    }
  }
}
</script>

<style lang="scss">
.section-title {
  color: #3f3e3e;
  font-size: 1rem;
  line-height: 1.25rem;
}
</style>