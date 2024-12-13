<template>
  <v-container>
    <v-row class="mt-8" justify="center">
      <v-col cols="12" md="6" lg="4">
        <!-- Card de Registro -->
        <v-card class="elevation-12 pa-6">
          <v-card-title class="headline text-center mb-8">
            Registro
          </v-card-title>
          <v-card-text class="pa-0">
            <v-form ref="form" v-model="valid">
              <!-- Nome -->
              <v-text-field
                v-model="name"
                label="Nome"
                :rules="nameRule"
                outlined
                dense
                placeholder="Digite seu nome completo"
                class="mb-4"
              />

              <v-text-field
                v-model="cpf"
                label="CPF"
                :rules="cpfRule"
                outlined
                dense
                placeholder="Digite seu CPF"
                class="mb-4"
                v-mask="'###.###.###-##'"
              />

              <v-text-field
                v-model="phone"
                label="Telefone"
                :rules="phoneRule"
                outlined
                dense
                placeholder="Digite seu telefone"
                class="mb-4"
                v-mask="['(##) ####-####', '(##) #####-####']"
              />              
              
              <!-- Email -->
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="emailRule"
                outlined
                dense
                placeholder="Digite seu e-mail"
                class="mb-4"
              />

              <!-- Senha -->
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                :rules="passwordRule"
                outlined
                dense
                placeholder="Digite sua senha"
                class="mb-4"
              />

              <!-- Confirmar Senha -->
              <v-text-field
                v-model="confirmPassword"
                label="Confirmar Senha"
                type="password"
                :rules="confirmPasswordRule"
                outlined
                dense
                placeholder="Confirme sua senha"
                class="mb-4"
              />
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-btn
              class="bg-primary"
              @click="register"
              :disabled="!valid"
              size="large"
              block
            >
              Criar Conta
            </v-btn>
          </v-card-actions>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="redirectToLogin">Já tem uma conta? Faça login</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2'

import { useRouter } from 'vue-router';
import AuthService from '@/services/auth.service';

// Acessa o objeto do router
const router = useRouter();

// Dados do formulário
const name = ref('');
const cpf = ref('');
const phone = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// Validação do formulário
const valid = ref(false);

// Regras de validação
const nameRule = [(v) => !!v || 'Nome é obrigatório'];
const cpfRule = [
  (v) => !!v || 'CPF é obrigatório', // Verifica se o CPF não está vazio
  (v) => {
    // Remove caracteres não numéricos (como pontos e traços)
    const cleanCpf = v.replace(/\D/g, '');
    
    // Verifica se o CPF tem 11 dígitos
    if (cleanCpf.length !== 11) {
      return 'CPF deve conter 11 dígitos';
    }

    // Validação de CPFs com números repetidos (ex: 111.111.111-11, 222.222.222-22, etc.)
    if (/^(\d)\1{10}$/.test(cleanCpf)) {
      return 'CPF inválido';
    }

    // Calculando os dois dígitos verificadores (DV)
    const calcDV = (cpf, weight) => {
      let sum = 0;
      for (let i = 0; i < cpf.length; i++) {
        sum += parseInt(cpf[i]) * weight[i];
      }
      const mod = sum % 11;
      return mod < 2 ? 0 : 11 - mod;
    };

    // Calcula o primeiro dígito verificador
    const firstDV = calcDV(cleanCpf.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
    // Calcula o segundo dígito verificador
    const secondDV = calcDV(cleanCpf.slice(0, 9) + firstDV, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);

    // Compara os dígitos verificadores calculados com os fornecidos
    if (firstDV === parseInt(cleanCpf[9]) && secondDV === parseInt(cleanCpf[10])) {
      return true; // CPF válido
    } else {
      return 'Digite um CPF válido';
    }
  }
];
const phoneRule = [
  (v) => !!v || 'Telefone é obrigatório',  // Verifica se o telefone não está vazio
  (v) => {
    // Remove todos os caracteres não numéricos (como espaços, parênteses, traços)
    const cleanPhone = v.replace(/\D/g, '');
    
    // Verifica se o número de telefone tem 10 ou 11 dígitos (incluindo o DDD)
    if (cleanPhone.length !== 10 && cleanPhone.length !== 11) {
      return 'Telefone deve ter 10 ou 11 dígitos';
    }

    // Verifica se o DDD é válido (deve ser um número de 2 dígitos entre 11 e 99)
    const ddd = cleanPhone.slice(0, 2);
    if (parseInt(ddd) < 11 || parseInt(ddd) > 99) {
      return 'DDD inválido';
    }

    // Verifica se o número de telefone é válido:
    // - Para números de celular, o primeiro dígito após o DDD deve ser 9
    if (cleanPhone.length === 11 && cleanPhone[2] !== '9') {
      return 'Número de celular deve começar com 9';
    }

    return true;  // Telefone válido
  }
];
const emailRule = [
  (v) => !!v || 'Email é obrigatório',
  (v) => /.+@.+\..+/.test(v) || 'Digite um email válido'
];
const passwordRule = [
  (v) => !!v || 'Senha é obrigatória',
  (v) => v.length >= 6 || 'A senha deve ter pelo menos 6 caracteres'
];
const confirmPasswordRule = [
  (v) => !!v || 'Confirme sua senha',
  (v) => v === password.value || 'As senhas não correspondem'
];

// Função de registro
const register = () => {
  if (valid.value) {
    Swal.fire({
      title: "Cadastrando...",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    AuthService.register(name.value, cpf.value, phone.value, email.value, password.value)
      .then(() => {
        Swal.close()
        const path = localStorage.getItem('redirectPath');
        if (path) {
          localStorage.removeItem('redirectPath')
          router.push({ path })
        } else {
          router.push({ name: 'home' })
        }
      })
      .catch((error) => {
        if (error?.response?.data?.detail) {
          Swal.fire({
            position: "center",
            icon: "error",
            title: error.response.data.detail,
            showConfirmButton: false,
            timer: 2500
          });
        } else {
          console.error('register error: ', error);
        }
      })
  }
};

// Função para redirecionar para o login
const redirectToLogin = () => {
  router.push({ name: 'login' })
};
</script>
