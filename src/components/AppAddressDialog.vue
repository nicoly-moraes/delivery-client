<template>
  <v-dialog v-model="dialog" max-width="800">
    <v-card class="pa-6">
      <h3 class="mb-6">Informe o endereço de entrega</h3>

      <v-form v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field 
              v-model="address.street" 
              label="Endereço" 
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="address.number"
              label="Número"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="address.neighborhood"
              label="Bairro"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="address.complement"
              label="Complemento"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="address.city"
              label="Cidade"
              :rules="[rules.required]"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-select
              v-model="address.state"
              :items="states"
              label="Estado"
              :rules="[rules.required]"
              required
            ></v-select>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              v-model="address.zip"
              label="CEP"
              :rules="[rules.required, rules.zip]"
              required
              v-mask="'#####-###'"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>

      <v-divider class="my-6"></v-divider>

      <h3 class="mb-6">Escolha o método de pagamento</h3>

      <v-select v-model="paymentType" :items="paymentTypes" item-title="label" item-value="value"
        label="Método de pagamento" :rules="[rules.required]" required></v-select>

      <v-card-actions class="d-flex justify-space-between w-100 pa-0 flex-wrap mt-6">
        <v-btn class="bg-primary w-100" size="x-large" :disabled="!valid || !paymentType" @click="done">Continuar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { Address } from "@/models/address.model";
import type { PaymentType } from "@/models/cart.model";
import { CartStore } from "@/store/cart.store";
import { reactive, ref } from "vue";

defineExpose({ open, close });

defineEmits(['productAdded'])

const dialog = ref<boolean>(false);

const valid = ref(false)

const states = ref([
  'São Paulo', 'Rio de Janeiro', 'Minas Gerais', 'Espírito Santo',
  'Paraná', 'Bahia', 'Pernambuco', 'Santa Catarina', 'Rio Grande do Sul',
  'Mato Grosso', 'Goiás', 'Amazonas', 'Ceará', 'Maranhão', 'Pará'
]);

const paymentTypes = ref([
  { label: 'Cartão de crédito', value: 'CREDIT_CARD' },
  { label: 'Cartão de débito', value: 'DEBIT_CARD' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Pix', value: 'PIX' },
]);

const rules = reactive({
  required: (value: string) => !!value || 'Este campo é obrigatório',
  zip: (value: string) => /^\d{5}-\d{3}$/.test(value) || 'Formato de CEP inválido',
});

const address = reactive<Address>({
  street: '',
  number: '',
  neighborhood: '',
  complement: '',
  city: '',
  state: '',
  zip: '',
});

const paymentType = ref<PaymentType>()

function open() {
  dialog.value = true;
}

function close() {
  dialog.value = false;
}

function done() {
  if (valid) {
    CartStore.saveAddress(address);
    CartStore.savePaymentType(paymentType.value!);
    close()
  }
}
</script>
