<template>
  <v-container>
    <v-row class="mt-16" justify="center">
      <v-col cols="12" md="4">
        <!-- Card de Login -->
        <v-card class="elevation-12 pa-6">
          <v-card-title class="headline text-center mb-8">
            Login
          </v-card-title>
          <v-card-text class="pa-0">
            <v-form ref="form" v-model="valid">
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
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-0">
            <v-btn
              class="bg-primary"
              @click="login"
              :disabled="!valid"
              size="large"
              block
            >
              Entrar
            </v-btn>
          </v-card-actions>
          <v-card-actions class="d-flex justify-center">
            <v-btn @click="redirectToRegister">Ainda não tem uma conta? Cadastre-se</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import AuthService from '@/services/auth.service';
import Swal from 'sweetalert2';
import { reactive, ref } from 'vue';

import { useRouter } from 'vue-router';

// Acessa o objeto do router
const router = useRouter();

const email = ref('')
const password = ref('')
const valid = ref(false)

const emailRule = [
  (v: string) => !!v || 'Email é obrigatório',
  (v: string) => /.+@.+\..+/.test(v) || 'Digite um email válido',
];

const passwordRule = [
  (v: string) => !!v || 'Senha é obrigatória',
  (v: string) => v.length >= 6 || 'A senha deve ter pelo menos 6 caracteres',
];

function login() {
  if (valid.value) {
    Swal.fire({
      title: "Autenticando...",
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    AuthService.login(email.value, password.value)
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
      .catch(() => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "E-mail ou senha incorreto!",
          showConfirmButton: false,
          timer: 2500
        });
      })
  }
}

const redirectToRegister = () => {
  router.push({ name: 'register' })
};
</script>
