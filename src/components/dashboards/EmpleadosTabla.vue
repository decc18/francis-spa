<template>
  <v-text-field
    v-model="search"
    label="Buscar"
    clearable
    class="mx-4"
  ></v-text-field>
  <v-data-table
    :headers="headers"
    :items="empleados"
    :search="search"
    :items-per-page=5
  ><template v-slot:[`item.nombrePer`]="{ item }">
        <div class="d-flex align-center gap-x-4" @click="openEditEmpleadoDialog(item)">
          <div class="text-center">
             <v-btn color="warning" icon size="small"  flat>
              <PencilIcon stroke-width="1.5"  />
            </v-btn>
          </div>
        <div class="ml-2 d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.nombre }}
            </h6>
            <span>
              <v-chip
              :class="{'text-end text-body-2 bg-success': item.activo === true, 'text-end text-body-2 bg-warning':  item.activo === false}"
              color="white"
              size="small"
            > {{item.activo===true ?"Activo":"No activo" }}</v-chip>
            </span>
        </div>
        </div>
      </template>
      <template v-slot:[`item.telefonoPer1`]="{ item }">
        <div class="d-flex align-center gap-x-4" @click="handleWhatsApp(item.telefono)">
          <div class="text-center">
             <v-btn color="success" icon size="small"  flat>
              <BrandWhatsappIcon stroke-width="1.5"  />
            </v-btn>
            
          </div>
        </div>
      </template>
      <template v-slot:[`item.telefonoPer2`]="{ item }">
        <div class="d-flex align-center gap-x-4" @click="handleCall(item.telefono)">
          <div class="text-center">
             <v-btn color="primary" icon size="small"  flat>
              <PhoneCallIcon stroke-width="1.5"  />
            </v-btn>
            
          </div>
          
        </div>
      </template>
</v-data-table>
<v-dialog v-model="editEmpleadoDialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="mb-4 d-flex justify-space-between w-100" >
          <span class="text-h5 font-weight-semibold">Editar Empleado</span>
        <v-btn @click="openDeleteEmpleadoDialog" color="error" icon size="small"  flat>
                  <TrashIcon stroke-width="1.5"  />
                </v-btn>
      </div>
      </v-card-title>
      <v-card-text>
        <v-sheet class="mx-auto" width="300">
        <v-form @submit.prevent="actualizarEmpleado">
          <v-text-field
            v-model="EmpleadoEditar.nombre"
            :rules="reglasNombre"
            label="Nombre Completo"
          ></v-text-field>
          <v-text-field
            label="Teléfono"
            v-model="EmpleadoEditar.telefono"
            :rules="reglasTelefono"
            type="tel"
          ></v-text-field>
          <div class="d-flex justify-end mt-2">
            <v-btn color="secondary"  @click="closeEditEmpleadoDialog" variant="flat">
              Cancelar
            </v-btn>
            <v-btn color="primary" class="ml-2" type="submit" variant="flat">Guardar</v-btn>
          </div>
        </v-form>
      </v-sheet>
      </v-card-text>
      
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteEmpleadoDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-semibold">Eliminar Empleado</span>
      </v-card-title>
      <v-card-text>
        ¿Estás seguro de que quieres eliminar este cliente?
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="closeDeleteEmpleadoDialog" variant="flat">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click="desactivarEmpleado" variant="flat">
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';

import { BrandWhatsappIcon, CalculatorIcon, PencilIcon, PhoneCallIcon } from 'vue-tabler-icons';
const editEmpleadoDialog = ref(false);
const deleteEmpleadoDialog = ref(false);
const emit = defineEmits(['desactivar-empleado','actualizar-empleado']);
//const emitActualizar = defineEmits(['actualizar-empleado']);
const props = defineProps({
  empleados: {
  type: Array as PropType<Empleado[]>,
  required: true
}
});
interface Empleado {
  id: string;
activo: boolean;
nombre: string;
telefono: string;
}

const EmpleadoEditar = ref<any>({
  id: '',
  nombre: '',
  telefono: '',
  activo: null
});
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
    const exists = await checkPhoneNumberExists(value, EmpleadoEditar.value.id);
    return !exists || 'Este número de teléfono ya está registrado.';
  },
];

const checkPhoneNumberExists = async (phoneNumber: string, currentEmployeeId: string): Promise<boolean> => {
  return props.empleados.some(empleado => empleado.telefono === phoneNumber && empleado.id !== currentEmployeeId);
};

const search = ref('');
const headers = [
{ title: 'Nombre', key: 'nombrePer', sortable: false },
{ title: 'Nom', key: 'nombre', align: ' d-none' },
{ title: 'WhatsApp', key: 'telefonoPer1', sortable: false, align: 'center' },
{ title: 'Lamar', key: 'telefonoPer2', sortable: false, align: 'center'  },
{ title: 'Teléfono', key: 'telefono', sortable: false  },

];
const openEditEmpleadoDialog = (emp :Empleado) => {
  EmpleadoEditar.value.nombre = emp.nombre;
  EmpleadoEditar.value.id = emp.id;
  EmpleadoEditar.value.telefono = emp.telefono;
  editEmpleadoDialog.value = true;
};

const closeEditEmpleadoDialog = () => {
  editEmpleadoDialog.value = false;
};
const openDeleteEmpleadoDialog = (emp :Empleado) => {
  deleteEmpleadoDialog.value = true;
};
const closeDeleteEmpleadoDialog = () => {
  deleteEmpleadoDialog.value = false;
};

const actualizarEmpleado = async () => {
  if (!EmpleadoEditar.value.nombre || !EmpleadoEditar.value.telefono) {
       return;
     }
     if(!/^\d{10}$/.test(EmpleadoEditar.value.telefono)) {
       return;
     }
     if(await checkPhoneNumberExists(EmpleadoEditar.value.telefono,EmpleadoEditar.value.id))
     {
      return;
     }
     EmpleadoEditar
  editEmpleadoDialog.value = false;
  emit('actualizar-empleado', EmpleadoEditar);
};

const handleCall = (tel: string) => {
  if (tel) {
    window.location.href = `tel:${tel}`;
  } else {
    console.log('Número de teléfono no disponible');
  }
};

const handleWhatsApp = (tel: string) => {
  if (tel) {
    window.location.href = `https://wa.me/${"+593"+tel}`;
  } else {
    console.log('Número de teléfono no disponible');
  }
};

const desactivarEmpleado = async () => {
  deleteEmpleadoDialog.value = false;
  editEmpleadoDialog.value = false;
  emit('desactivar-empleado', EmpleadoEditar);
};
</script>
<style scoped>
</style>