<template>
    <div class="d-flex align-center text-center mb-6">
      <!-- <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
              <span class="bg-surface px-5 py-3 position-relative text-subtitle-1 text-grey100">Your Social Campaigns</span>
          </div> -->
    </div>
    <div>
      <v-form @submit.prevent="login" ref="myForm" v-model="valid" lazy-validation>
        <v-row class="mb-3">
          <v-col cols="12">
            <v-label class="font-weight-medium mb-1">Email</v-label>
            <v-text-field
              variant="outlined"
              v-model="email"
              :rules="emailRules"
              required
              for="email"
              class="pwdInput"
              hide-details
              color="primary"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-label class="font-weight-medium mb-1">Password</v-label>
            <v-text-field
              variant="outlined"
              v-model="password"
              type="password"
              :rules="passwordRules"
              required
              class="border-borderColor"
              hide-details
              color="primary"
            ></v-text-field>
          </v-col>
          <!-- <v-col cols="12 " class="py-0">
                  <div class="d-flex flex-wrap align-center w-100 ">
                      <v-checkbox hide-details color="primary">
                          <template v-slot:label class="">Remeber this Device</template>
                      </v-checkbox>
                      <div class="ml-sm-auto">
                          <RouterLink to=""
                              class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">
                              Forgot Password ?</RouterLink>
                      </div>
                  </div>
              </v-col> -->
  
          <v-col cols="12">
            <!-- <v-btn size="large" rounded="pill" color="primary" class="rounded-pill" block type="submit" flat>Sign
                      In</v-btn> -->
            <v-btn type="submit" :disabled="!valid" color="primary" block>Iniciar sesión</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </div>
    <v-dialog v-model="errorDialog" max-width="400">
      <v-card>
        <v-card-title class="headline">Error</v-card-title>
        <v-card-text>{{ errorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="errorDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '@/stores/auth';
  const email = ref<string>('');
  const password = ref<string>('');
  const router = useRouter();
  const myForm = ref();
  const valid = ref<boolean>(false);
  const errorDialog = ref<boolean>(false);
  const errorMessage = ref<string>('');
  
  const emailRules = [
    (v: string) => !!v || 'El email es requerido',
    (v: string) => /.+@.+/.test(v) || 'Email inválido',
  ];
  
  const passwordRules = [
    (v: string) => !!v || 'La contraseña es requerida',
  ];
  
  const authStore = useAuthStore();
  const login = async () => {
    if (myForm.value?.validate()) {
      try {
        await authStore.login(email.value.trim(), password.value.trim());
        router.push('/');
      } catch (error) {
        errorMessage.value = 'Error al iniciar sesión. Por favor, verifica tus credenciales.';
        errorDialog.value = true;
      }
    }
  };
  </script>
  
  <style scoped>
  /* Estilos adicionales si es necesario */
  </style>
  