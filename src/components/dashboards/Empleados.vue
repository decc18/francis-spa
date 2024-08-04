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
                <span class="text-h5 font-weight-semibold">Empleados</span>
                <div>
                <v-btn  @click="openAddClientDialog" color="primary" icon size="small"  flat>
                  <UserPlusIcon stroke-width="1.5"  />
                </v-btn>
              </div>
              </div>
            </v-card-title>
        </v-card-item>
      <EmpleadosTabla 
      :empleados="empleados"
      @desactivar-empleado="desactivarEmpleado"
      @actualizar-empleado="actualizarEmpleado"
      >
      </EmpleadosTabla>
       
  </v-card>
  
  <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-semibold">Agregar Empleado</span>
      </v-card-title>
      <v-card-text>
        <v-sheet class="mx-auto" width="300">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="nuevoEmpleado.nombre"
            :rules="reglasNombre"
            label="Nombre Completo"
          ></v-text-field>
          <v-text-field
            label="Teléfono"
            v-model="nuevoEmpleado.telefono"
            :rules="reglasTelefono"
            type="tel"
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
import { collection, getDocs, addDoc, query, where, doc, updateDoc  } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { useAuthStore } from '@/stores/auth';
import EmpleadosTabla from '@/components/dashboards/EmpleadosTabla.vue';
const dialog = ref(false);
const loading = ref(false);
const authStore = useAuthStore();
const nuevoEmpleado = ref<any>({
  nombre: '',
  telefono: '',
  activo: null
});
interface Empleado {
  id: string;
  activo: boolean;
  nombre: string;
  telefono: string;
}
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
const checkPhoneNumberExists = async (phoneNumber: string): Promise<boolean> => {
    return empleados.value.some(empleados => empleados.telefono === phoneNumber);
};

 const empleados = ref<Array<Empleado>>([]);

 const fetchEmpleados = async () => {
  loading.value = true;
  try {
    const q = query(
      collection(db, "empleados"),
      where("activo", "==", true),
      where("idUsuarioCreacion", "==", authStore?.user.uid), 
    );

    const querySnapshot = await getDocs(q);
    empleados.value = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching empleados: ", error);
  }finally {
    loading.value = false;
  }
};


const handleSubmit = async () => {
  
  loading.value = true;
  try {
    if (!nuevoEmpleado.value.nombre || !nuevoEmpleado.value.telefono) {
      return;
    }
    if(!/^\d{10}$/.test(nuevoEmpleado.value.telefono)) {
      return;
    }
    
    if(await checkPhoneNumberExists(nuevoEmpleado.value.telefono))
    {
      return;
    }
   
    const currentDate = new Date();
    const nuevo = await addDoc(collection(db, "empleados"), {
      ...nuevoEmpleado.value,
      idUsuarioCreacion: authStore?.user.uid,
      activo:true,
      fechaCreacion: currentDate
    });
    closeDialog();
    loading.value = false;
    //router.push({ name: 'DetalleCliente', params: { id: nuevoCliente.id } });
    await fetchEmpleados();
  } catch (error) {
    console.error("Error fetching clients: ", error);
  }finally {
    loading.value = false;
  }
 
};

const openAddClientDialog = () => {
  limpiarFormularioEmpleado();
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const limpiarFormularioEmpleado = () => {
  nuevoEmpleado.value.nombre = '';
  nuevoEmpleado.value.telefono = null;
};

const actualizarEmpleado = async (emp: Empleado) => {
  loading.value = true;
  try {
    
    const docRef = doc(db, 'empleados', emp.value.id);
    await updateDoc(docRef, {
      nombre: emp.value.nombre,
      telefono: emp.value.telefono
    });
    fetchEmpleados();
  } catch (error) {
    console.error('Error updating client: ', error);
  } finally {
    loading.value = false;
  }
};

const desactivarEmpleado = async (emp: Empleado) => {
  loading.value = true;
  try {
    const docRef = doc(db, 'empleados', emp.value.id);
    await updateDoc(docRef, {
      activo: false
    });
    await fetchEmpleados();
    
  } catch (error) {
    console.error('Error deleting transaction: ', error);
  }finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchEmpleados();
});
</script>
