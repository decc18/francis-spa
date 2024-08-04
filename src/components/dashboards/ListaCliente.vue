<template>
  <v-overlay
      v-model="loading"
      class="align-center justify-center"
      contained
    >
     <v-progress-circular v-if="loading" indeterminate size="40" color="white"></v-progress-circular>
   </v-overlay>
  <v-card elevation="10" >
        <v-card-item class="py-4 px-6">
            <v-card-title> 
              <div class="d-flex justify-space-between w-100">
                <span class="text-h5 font-weight-semibold">Clientes</span>
                <div>
                <v-btn @click="openAddClientDialog" color="primary" icon size="small"  flat>
                  <UserPlusIcon stroke-width="1.5"  />
                </v-btn>
              </div>
              </div>
            </v-card-title>
        </v-card-item>
       <clienteTabla 
      :tablaClientes="clientes"></clienteTabla>
       
  </v-card>
 
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-semibold">Agregar Cliente</span>
      </v-card-title>
      <v-card-text>
        <v-sheet class="mx-auto" width="300">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="newClient.nombre"
            :rules="reglasNombre"
            label="Nombre Completo"
          ></v-text-field>
          <v-text-field
            label="Teléfono"
            v-model="newClient.telefono"
            :rules="reglasTelefono"
            type="tel"
          ></v-text-field>
          <v-text-field
            label="Email(opcional)"
            v-model="newClient.email"
            :rules="reglasEmail"
          ></v-text-field> 
          <div class="d-flex justify-end mt-2">
            <v-btn color="secondary"  @click="closeDialog" variant="flat">
              Cancelar
            </v-btn>
            <v-btn color="primary" class="ml-2" type="submit" variant="flat">Guardar</v-btn>
          </div>
        </v-form>
      </v-sheet>
     </v-card-text>
    </v-card>
  </v-dialog> 
  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { collection, getDocs, addDoc, query, where  } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuthStore } from '@/stores/auth';
import clienteTabla from '@/components/dashboards/ClienteTable.vue';
import { UserPlusIcon } from 'vue-tabler-icons';
const dialog = ref(false);
const loading = ref(false);
const newClient = ref<any>({
  idUsuario: '',
  nombre: '',
  telefono: '',
  email: ''
});
const router = useRouter();
const authStore = useAuthStore();
const limpiarFormularioCliente = () => {
  newClient.value.nombre = '';
  newClient.value.telefono = null;
  newClient.value.email = '';
};

// Reglas de validación
const reglasNombre = [
  (value: string) => {
    if (value) return true;
    return 'Debe ingresar el nombre completo';
  },
];
const reglasTelefono = [
  (value: string) => !!value || 'Debe ingresar un número de teléfono.',
  (value: string) => /^\d{10}$/.test(value) || 'Teléfono debe tener 10 dígitos.',
  async (value: string) => {
    const exists = await checkPhoneNumberExists(value);
    return !exists || 'Este número de teléfono ya está registrado.';
  },
];

const reglasEmail = [
  (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Ingrese un email valido.',
];

const checkPhoneNumberExists = async (phoneNumber: string): Promise<boolean> => {
    return clientes.value.some(cliente => cliente.telefono === phoneNumber);
};

const handleSubmit = async () => {
  
   loading.value = true;
   try {
     if (!newClient.value.nombre || !newClient.value.telefono) {
       return;
     }
     if(!/^\d{10}$/.test(newClient.value.telefono)) {
       return;
     }
     if(newClient.value.email &&  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClient.value.email)) {
       return;
     }
     if(await checkPhoneNumberExists(newClient.value.telefono))
     {
       return;
     }
    
     const currentDate = new Date();
     const nuevoCliente = await addDoc(collection(db, "clientes"), {
       ...newClient.value,
       idUsuario: authStore?.user.uid,
       telefono: newClient.value.telefono,
       balance:0,
       activo:true,
       fecha: currentDate
     });
     closeDialog();
     loading.value = false;
     router.push({ name: 'DetalleCliente', params: { id: nuevoCliente.id } });
     //fetchClients();
   } catch (error) {
     console.error("Error fetching clients: ", error);
   }finally {
     loading.value = false;
   }
  
};

interface datosCliente {
  //activo: boolean;
  balance: number;
  //email: string;
  idUsuario: string;
  nombre: string;
  telefono: string;
}

const clientes = ref<Array<datosCliente>>([]);
   
const fetchClients = async () => {
  loading.value = true;
  try {
    const q = query(
      collection(db, "clientes"),
      where("idUsuario", "==", authStore?.user.uid),
      where("activo", "==", true) // Condición adicional para obtener solo clientes activos
    );

    const querySnapshot = await getDocs(q);
    clientes.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching clients: ", error);
  }finally {
    loading.value = false;
  }
};

const openAddClientDialog = () => {
  limpiarFormularioCliente();
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

onMounted(() => {
  fetchClients();
});
</script>
