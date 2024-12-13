<template>
  <div class="d-flex align-center justify-space-between pa-2 border-thin rounded" :class="{ 'small': small }">
    <v-btn 
      v-if="!trash || qty > 1"
      class="text-primary" 
      variant="text" 
      icon="mdi-minus" 
      size="x-small" 
      :disabled="qty < 2" @click="remove()"
    ></v-btn>

    <v-btn 
      v-if="trash && qty === 1"
      class="text-error" 
      variant="text" 
      icon="mdi-trash-can-outline" 
      size="x-small"
      @click="emit('delete')"
    ></v-btn>

    <span class="px-2">{{ qty }}</span>

    <v-btn class="text-primary" variant="text" icon="mdi-plus" size="x-small" @click="add()"></v-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps<{
  quantity: number;
  small?: boolean;
  trash?: boolean;
}>();

const qty = ref<number>(props.quantity);

const emit = defineEmits(['update:quantity', 'delete']);

function add() {
  qty.value++
  emit('update:quantity', qty.value)
}

function remove() {
  if (qty.value > 1) {
    qty.value--
    emit('update:quantity', qty.value)
  }
}
</script>

<style scoped>
.small {
  transform: scale(0.7);
}

.v-btn {
  font-size: 0.875rem;
}
</style>