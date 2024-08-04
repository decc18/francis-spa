<template>
    <v-overlay
      v-model="loading"
      class="align-center justify-center"
      contained
    >
     <v-progress-circular v-if="loading" indeterminate size="40" color="white"></v-progress-circular>
   </v-overlay>
   <v-card elevation="10">
    <v-card-title>
      <div class="mb-4 d-flex justify-space-between w-100" >
        <v-btn @click="goBack" color="primary" icon size="small"  flat>
                  <ArrowBackUpIcon stroke-width="1.5"  />
                </v-btn>
                <h6 class="text-h4 font-weight-medium user-list-name">
                  Detalle Cliente
            </h6>
        <v-btn @click="openDialog" color="primary" icon size="small"  flat>
                  <CalendarDollarIcon stroke-width="1.5"  />
                </v-btn>
      </div>
      <div class="d-flex align-center gap-x-4">
          <div class="text-center">
             <v-btn color="warning" @click="openEditClientDialog" icon size="small"  flat>
              <PencilIcon stroke-width="1.5"  />
            </v-btn>
        </div>
          <div class="ml-2 d-flex flex-column">
            <h6 class="text-h5 font-weight-medium user-list-name">
              {{ cliente?.nombre  }}
            </h6>
            <span class="text-sm text-medium">
              Balance: 
              <v-chip
              class="text-body-2"
              :class="{'text-body-2 bg-success': cliente?.balance >= 0, 'text-body-2 bg-error': cliente?.balance < 0}"
              color="white"
              size="small">
              {{parseFloat(cliente?.balance).toFixed(2)}}
            </v-chip>
            <v-btn color="primary" class="ml-4" @click="abrirDialogoAbono()" icon size="x-small"  flat>
              <BellDollarIcon stroke-width="1.5"  />
            </v-btn>
            </span>
            <span v-if="cliente?.fechaPago && cliente?.balance != 0" class="text-sm text-medium">
              Fecha Pago:{{moment(String(cliente?.fechaPago.toDate())).format('MM/DD/YYYY')}} 
            </span>
          </div>
        </div>
    </v-card-title>
  <v-card-subtitle class="text-h6 font-weight-semibold"> 
  </v-card-subtitle>
    <v-card-actions>
        <v-row class="justify-center">
          <v-col cols="3">
            <div class="motivo-container align-center text-center">
              <span> 
                <v-btn  size="small" @click="handleCall" icon class="bg-primary">
                    <v-avatar size="20" class="text-surface">
                      <v-icon left>mdi-phone</v-icon>
                    </v-avatar>
                </v-btn></span>
              <span class="text-sm text-medium">Llamar</span>
            </div>
          </v-col>
          <v-col cols="3">
            <div class="motivo-container align-center text-center">
              <span> 
                <v-btn  size="small" @click="handleWhatsApp" icon class="bg-success">
                    <v-avatar size="20" class="text-surface">
                      <v-icon left>mdi-whatsapp</v-icon>
                    </v-avatar>
                </v-btn></span>
              <span class="text-sm text-medium">WhatsA</span>
            </div>
          </v-col>
          <v-col cols="3">
            <div class="motivo-container align-center text-center">
              <span> 
                <v-btn  size="small" @click="handleReport" icon class="bg-info">
                    <v-avatar size="20" class="text-surface">
                      <v-icon left>mdi-file-document</v-icon>
                    </v-avatar>
                </v-btn></span>
              <span class="text-sm text-medium">Reporte</span>
            </div>
          </v-col>
          <v-col v-if="transacciones.length > 0" cols="3">
            <div class="motivo-container align-center text-center">
              <span> 
                <v-btn size="small" @click="openEditDateDialog" icon class="bg-warning">
                    <v-avatar size="20" class="text-surface">
                      <v-icon left>mdi-calendar</v-icon>
                    </v-avatar>
                </v-btn></span>
              <span class="text-sm text-medium">Agendar</span>
            </div>
          </v-col>
        </v-row>
      </v-card-actions>
 <Transacciones 
      @delete-transaccion="deleteTransaction"
      :transacciones="transacciones"/>
  </v-card>
 <v-dialog v-model="dialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-semibold">Agregar Transacción</span>
      </v-card-title>
      <v-card-text>
        <v-sheet class="mx-auto" width="300">
        <v-form @submit.prevent="guardarTransaccion">
          <v-select
            label="Forma de pago"
            v-model="nuevaTransaccion.formaPago"
            :items="['Efectivo', 'Transferencia', 'Tarjeta']"
            required
            :rules="[v => !!v || 'Tipo es requerido']"
          ></v-select>
          <v-select
            label="Nombre Empleado(opcional)"
            v-model="nuevaTransaccion.empleado"
            :items="stringArray"
            required
          ></v-select>
          <v-text-field
            label="Motivo"
            v-model="nuevaTransaccion.motivo"
            required
            :rules="[v => !!v || 'Motivo requerido']"
          ></v-text-field>
          <v-text-field
            label="Monto Total"
            v-model="nuevaTransaccion.montoTotal"
            type="number"  
            step="0.01"    
            required
            :rules="[
              v => !!v || 'Monto requerido',
              v => (parseFloat(v) > 0) || 'Monto debe ser mayor a 0',
              v => /^\d*\.?\d*$/.test(v) || 'Solo valores numéricos y decimales'
            ]"
          ></v-text-field>
          <v-text-field
            label="Monto Pagado"
            v-model="nuevaTransaccion.montoPagado"
            type="number"  
            step="0.01"    
            required
            :rules="[
              v => !!v || 'Monto requerido',
              v => (parseFloat(v) >= 0) || 'Monto debe ser mayor o igual 0',
              v => /^\d*\.?\d*$/.test(v) || 'Solo valores numéricos y decimales'
            ]"
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
  <v-dialog v-model="dialogoAbono" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-semibold">Abonar Saldo</span>
      </v-card-title>
      <v-card-text>
        <v-sheet class="mx-auto" width="300">
        <v-form @submit.prevent="guardarTransaccionAbono">
          <v-select
            label="Forma de pago"
            v-model="nuevaTransaccion.formaPago"
            :items="['Efectivo', 'Transferencia', 'Tarjeta']"
            required
            :rules="[v => !!v || 'Tipo es requerido']"
          ></v-select>
          <v-text-field
            label="Motivo"
            v-model="nuevaTransaccion.motivo"
            required
            :rules="[v => !!v || 'Motivo requerido']"
          ></v-text-field>
          <v-text-field
            label="Monto Total"
            v-model="nuevaTransaccion.montoTotal"
            type="number"  
            step="0.01"    
            required
            :rules="[
              v => !!v || 'Monto requerido',
              v => (parseFloat(v) > 0) || 'Monto debe ser mayor a 0',
              v => /^\d*\.?\d*$/.test(v) || 'Solo valores numéricos y decimales'
            ]"
          ></v-text-field>
          <div class="d-flex justify-end mt-2">
            <v-btn color="secondary"  @click="cerrarDialogoAbono()" variant="flat">
              Cancelar
            </v-btn>
            <v-btn color="primary" class="ml-2" type="submit" variant="flat">Guardar</v-btn>
          </div>
        </v-form>
      </v-sheet>
      </v-card-text>
    </v-card>
  </v-dialog> 
  
  <!-- Dialog para editar cliente -->
  <v-dialog v-model="editClientDialog" max-width="500">
    <v-card>
      <v-card-title>
        <div class="mb-4 d-flex justify-space-between w-100" >
          <span class="text-h5 font-weight-semibold">Editar Cliente</span>
        <v-btn @click="openDeleteClienteDialog" color="error" icon size="small"  flat>
                  <TrashIcon stroke-width="1.5"  />
                </v-btn>
      </div>
      </v-card-title>
      <v-card-text>
        <v-sheet class="mx-auto" width="300">
        <v-form @submit.prevent="updateClient">
          <v-text-field
            v-model="cliente.nombre"
            :rules="reglasNombre"
            label="Nombre Completo"
          ></v-text-field>
          <v-text-field
            label="Teléfono"
            v-model="cliente.telefono"
            :rules="reglasTelefono"
            type="tel"
          ></v-text-field>
          <v-text-field
            label="Email(opcional)"
            v-model="cliente.email"
            :rules="reglasEmail"
          ></v-text-field> 
          <div class="d-flex justify-end mt-2">
            <v-btn color="secondary"  @click="closeEditClientDialog" variant="flat">
              Cancelar
            </v-btn>
            <v-btn color="primary" class="ml-2" type="submit" variant="flat">Guardar</v-btn>
          </div>
        </v-form>
      </v-sheet>
      </v-card-text>
      
    </v-card>
  </v-dialog>
  <!-- Dialog para actualizar la fecha -->
  <v-dialog v-model="editDateDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-semibold">Actualizar Fecha de Pago</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="updateClientDate">
          <v-date-picker v-model="fechaPago"  hide-actions title="" >
            <template v-slot:header></template>
          </v-date-picker>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="closeEditDateDialog" variant="flat">Cancelar</v-btn>
        <v-btn color="primary" type="submit" @click="updateClientDate" variant="flat">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="deleteClienteDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-semibold">Eliminar Cliente</span>
      </v-card-title>
      <v-card-text>
        ¿Estás seguro de que quieres eliminar este cliente?
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="closeDeleteClienteDialog" variant="flat">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click="deleteCliente" variant="flat">
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { generarPDF } from '@/utils/pdfUtils';
import { useAuthStore } from '@/stores/auth';
import { doc, getDoc, updateDoc, orderBy  } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { collection, getDocs, addDoc, query, where  } from 'firebase/firestore';
import Transacciones from '@/components/dashboards/TransaccionesTabla.vue';
import { BellDollarIcon, PencilIcon, TrashIcon } from 'vue-tabler-icons';
import { CalendarDollarIcon } from 'vue-tabler-icons';
import { ArrowBackUpIcon } from 'vue-tabler-icons';
const editClientDialog = ref(false);
const editDateDialog = ref(false);
const dialogoAbono = ref(false);

const deleteClienteDialog = ref(false);
const empleados = ref<Array<Empleado>>([]);
const stringArray = ref<string[]>([]);

const cliente = ref<null | any>(null);
const dialog = ref(false);
const fechaPago = ref(new Date());
const loading = ref(false);
import moment from 'moment'
const nuevaTransaccion = ref<any>({
  idUsuario: '',
  idCliente: '',
  motivo: '',
  fecha: '',
  montoTotal: null,
  montoPagado: null,
  formaPago: null,
  empleado: null,
});
// Reglas de validación
const reglasNombre = [
  (value: string) => {
    if (value) return true;
    return 'Debe ingresar el nombre completo';
  },
];
const reglasTelefono = [
  (value: string) => !!value || 'Debe ingresar un número de teléfono.',
  (value: string) => /^\d{10}$/.test(value) || 'Teléfono debe tener 10 digits.',
  
];

const reglasEmail = [
  (value: string) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Ingrese un email valido.',
];



const authStore = useAuthStore();
interface Transaccion {
  id: string,
  fecha: string,
  motivo: string,
  montoTotal: number,
  montoPagado: number,
  tipo: string,
  formaPago: string,
  empleado: string,
};
interface Empleado {
  id: string;
  nombre: string;
  telefono: string;
  activo: boolean;
}

const route = useRoute();
const router = useRouter();
const transacciones = ref<Array<Transaccion>>([]);
const clientId = route.params.id as string;

const fetchClientDetails = async (id: string) => {
  try {
    const docRef = doc(db, "clientes", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      cliente.value = {
        id: docSnap.id,
        ...docSnap.data()
      };
      
      if(cliente.value.fechaPago){
        fechaPago.value = cliente.value.fechaPago.toDate(); 
      }
      
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error fetching client: ", error);
  }
};


const fetchEmpleados = async () => {
  loading.value = true;
  try {
    if(empleados.value.length === 0)
    {
    const q = query(
      collection(db, "empleados"),
      where("activo", "==", true),
      where("idUsuarioCreacion", "==", authStore?.user.uid), 
    );  

    const querySnapshot = await getDocs(q);

    empleados.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        nombre: data.nombre as string,
        telefono: data.telefono as string,
        activo: data.activo as boolean,
        };
      });
    }
    
    stringArray.value = empleados.value.map(doc => doc.nombre);

    
    
  } catch (error) {
    console.error("Error fetching Empleados: ", error);
  }finally {
    loading.value = false;
  }
}; 

const fetchTransacciones = async (id: string, actualizarBalance: boolean) => {
  loading.value = true;
  try {
    const q = query(
      collection(db, "transacciones"),
      where("idCliente", "==", id),
      where("activo", "==", true),
      orderBy("fecha", "desc") // Ordenar por fecha descendente
    );  
    
    const querySnapshot = await getDocs(q);
    
    const transaccionesActualizadas = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        fecha: data.fecha as string,
        motivo: data.motivo as string,
        montoTotal: data.montoTotal as number,
        montoPagado: data.montoPagado as number,
        tipo: data.tipo as string,
        formaPago: data.formaPago as string,
        empleado: data.empleado as string
        };
    });
    if(actualizarBalance){
      const bal = await calcularBalance(transaccionesActualizadas);
      await updateBalance(bal);
      await fetchClientDetails(clientId);
    }
    transacciones.value = transaccionesActualizadas;
    
    
  } catch (error) {
    console.error("Error fetching transacciones: ", error);
  }finally {
    loading.value = false;
  }
}; 

const deleteTransaction = async (trxEliminar: Transaccion) => {
  loading.value = true;
  try {
    const docRef = doc(db, 'transacciones', trxEliminar.value.id);
    await updateDoc(docRef, {
      activo: false
    });
    await fetchTransacciones(clientId, true);
    
  } catch (error) {
    console.error('Error deleting transaction: ', error);
  }finally {
    loading.value = false;
  }
};

const updateClient = async () => {
  loading.value = true;
  try {
    if (!cliente.value.nombre || !cliente.value.telefono) {
       return;
     }
     if(!/^\d{10}$/.test(cliente.value.telefono)) {
       return;
     }
     if(cliente.value.email &&  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.value.email)) {
       return;
     }
    closeEditClientDialog();
    const docRef = doc(db, 'clientes', clientId);
    await updateDoc(docRef, {
      nombre: cliente.value.nombre,
      telefono: cliente.value.telefono,
      email: cliente.value.email,
    });
    fetchClientDetails(clientId);
  } catch (error) {
    console.error('Error updating client: ', error);
  } finally {
    loading.value = false;
  }
};


const updateClientDate = async () => {
  loading.value = true;
  try {
    if (!fechaPago.value) {
       return;
    }
    closeEditDateDialog();
    const docRef = doc(db, 'clientes', clientId);
    await updateDoc(docRef, {
      fechaPago: fechaPago.value,
    });
    fetchClientDetails(clientId);
    
  } catch (error) {
    console.error('Error updating client date: ', error);
  } finally {
    loading.value = false;
  }
};

const updateBalance = async (balanceNuevo: number) => {
  loading.value = true;
  try {
    const docRef = doc(db, 'clientes', clientId);
    await updateDoc(docRef, {
      balance: balanceNuevo,
    });
    
  } catch (error) {
    console.error('Error updating client date: ', error);
  } finally {
    loading.value = false;
  }
};

const guardarTransaccion = async () => {
  const currentDate = new Date();
  loading.value = true;
  try
  {
    const isValid = validateForm();
    if(isValid){
      closeDialog();

       if (nuevaTransaccion.value.empleado) {
        const empleadoSeleccionado = empleados.value.find(emp => emp.nombre === nuevaTransaccion.value.empleado);
          var trxNueva = await addDoc(collection(db, "transacciones"), {
          ...nuevaTransaccion.value,
            idUsuario: authStore?.user.uid,
            montoTotal: parseFloat(nuevaTransaccion.value.montoTotal),
            montoPagado: parseFloat(nuevaTransaccion.value.montoPagado),
            idCliente:clientId,
            fecha: currentDate,
            activo: true,
            tipo: 'transaccion',
            idEmpleado: empleadoSeleccionado?.id
          });
      }
      else{
        var trxNueva = await addDoc(collection(db, "transacciones"), {
          ...nuevaTransaccion.value,
            idUsuario: authStore?.user.uid,
            montoTotal: parseFloat(nuevaTransaccion.value.montoTotal),
            montoPagado: parseFloat(nuevaTransaccion.value.montoPagado),
            idCliente:clientId,
            fecha: currentDate,
            tipo: 'transaccion',
            activo: true,
          });
      }
      
      await fetchTransacciones(clientId, true);
      limpiarFormulario();
     
    }
  
  }
  catch(ex)
  {
    console.log(ex);
  }finally {
    loading.value = false;
  }
  
};
const guardarTransaccionAbono = async () => {
  const currentDate = new Date();
  loading.value = true;
  try
  {
    const isValid = validateFormAbono();
    if(isValid){
      cerrarDialogoAbono();

      var trxNueva = await addDoc(collection(db, "transacciones"), {
          ...nuevaTransaccion.value,
            idUsuario: authStore?.user.uid,
            montoTotal: parseFloat(nuevaTransaccion.value.montoTotal),
            montoPagado: parseFloat(nuevaTransaccion.value.montoTotal),
            idCliente:clientId,
            fecha: currentDate,
            tipo: 'pago',
            activo: true,
          });
      
      await fetchTransacciones(clientId, true);
      limpiarFormulario();
    }
  
  }
  catch(ex)
  {
    console.log(ex);
  }finally {
    loading.value = false;
  }
  
};

const abrirDialogoAbono = () => {
  limpiarFormulario();
  dialogoAbono.value = true;
};

const cerrarDialogoAbono = () => {
  dialogoAbono.value = false;
};



const openDialog = () => {
  limpiarFormulario();
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const openDeleteClienteDialog = () => {
  deleteClienteDialog.value = true;
};
const closeDeleteClienteDialog = () => {
  deleteClienteDialog.value = false;
};

const deleteCliente = async () => {
  loading.value = true;
  try
  {
    closeDeleteClienteDialog();
    closeEditClientDialog();
    const docRef = doc(db, "clientes", clientId);
    await updateDoc(docRef, {
      activo: false
    });
    goBack();
  }
  catch(ex)
  {
    console.log(ex);
  }finally {
    loading.value = false;
  }
  
};

const limpiarFormulario = () => {
  nuevaTransaccion.value.idUsuario = '';
  nuevaTransaccion.value.idCliente = '';
  nuevaTransaccion.value.fecha = '';
  nuevaTransaccion.value.motivo = '';
  nuevaTransaccion.value.montoTotal = null;
  nuevaTransaccion.value.montoPagado = null;
  nuevaTransaccion.value.tipo = null;
  nuevaTransaccion.value.formaPago = null;
  nuevaTransaccion.value.empleado = null;
};

const validateForm = () => {
 
  if (!['Efectivo', 'Transferencia', 'Tarjeta'].includes(nuevaTransaccion.value.formaPago)) {
    return false;
  }
  if (!nuevaTransaccion.value.motivo || !nuevaTransaccion.value.montoTotal|| !nuevaTransaccion.value.montoPagado) {
      return false;
    }
  // Validar que el monto sea numérico y mayor a 0
  const montoTotal = parseFloat(nuevaTransaccion.value.montoTotal);
  if (isNaN(montoTotal) || montoTotal <= 0) {
    return false;
  }
  const montoPagado = parseFloat(nuevaTransaccion.value.montoPagado);
  if (isNaN(montoPagado) || montoPagado < 0) {
    return false;
  }

  return true;
};

const validateFormAbono = () => {
 
 if (!['Efectivo', 'Transferencia', 'Tarjeta'].includes(nuevaTransaccion.value.formaPago)) {
   return false;
 }
 if (!nuevaTransaccion.value.motivo || !nuevaTransaccion.value.montoTotal) {
     return false;
   }
 // Validar que el monto sea numérico y mayor a 0
 const montoTotal = parseFloat(nuevaTransaccion.value.montoTotal);
 if (isNaN(montoTotal) || montoTotal <= 0) {
   return false;
 }
 

 return true;
};


const calcularBalance = (trx: Array<Transaccion>) => {
  let balance = 0;
//  console.table(trx);
  for (const transaccion of trx) {
    if (transaccion.tipo === "pago") {
      balance += transaccion.montoTotal;
      //console.log("montoTotal: " + transaccion.montoTotal+ " balance: "+balance)
    } else if (transaccion.tipo === "transaccion") {
      balance += (transaccion.montoPagado - transaccion.montoTotal);
      //console.log("montoTotal: " + transaccion.montoTotal+" montoPagado: " + transaccion.montoPagado+ " balance: "+balance)
    }
  }
  //console.log(balance);
  return balance;
};


const handleCall = () => {
  if (cliente.value?.telefono) {
    window.location.href = `tel:${cliente.value.telefono}`;
  } else {
    console.log('Número de teléfono no disponible');
  }
};

const handleWhatsApp = () => {
  if (cliente.value?.telefono) {
    window.location.href = `https://wa.me/${"+593"+cliente.value.telefono}`;
  } else {
    console.log('Número de teléfono no disponible');
  }
};

const handleReport = () => {
  generarPDF(transacciones.value, cliente.value?.nombre, cliente.value?.balance);
};


const goBack = () => {
  router.back();
};

const openEditClientDialog = () => {
  editClientDialog.value = true;
};

const closeEditClientDialog = () => {
  editClientDialog.value = false;
};

const openEditDateDialog = () => {
  editDateDialog.value = true;
};

const closeEditDateDialog = () => {
  editDateDialog.value = false;
};

onMounted(() => {
  const clientId = route.params.id as string;
  fetchClientDetails(clientId);
  fetchTransacciones(clientId, false);
  fetchEmpleados();
});
</script>
<style scoped>
</style>