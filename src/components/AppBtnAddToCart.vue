<template>
  <v-btn class="bg-primary" size="x-large" @click="$emit('click')">
    <div class="d-flex align-center justify-space-between ga-2">
      <span>Adicionar</span>
      <span>{{ formattedTotalPrice }}</span>
    </div>
  </v-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineEmits(['click'])

const props = defineProps<{
  total: number
}>();

const formattedTotalPrice = computed(() => {
  if (!props.total) {
    return '';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(props.total);
});
</script>

<style scoped>
.v-btn {
  font-size: 0.875rem;
  letter-spacing: 0;
}
</style>