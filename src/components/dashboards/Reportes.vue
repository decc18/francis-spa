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
        <span class="text-h5 font-weight-semibold">Generar Reportes</span>
      </v-card-title>
      <v-card-text>
        <v-sheet class="mx-auto" width="300">
        <v-form @submit.prevent="generarReporte">
          <v-select
            label="Reporte"
            v-model="nombreReporte"
            :items="['Transacciones por cliente','Transacciones por empleados' ]"
             :rules="[v => !!v || 'Motivo requerido']"
            required
          ></v-select>
          <v-text-field type="date" v-model="fechaInicio"  :rules="[v => !!v || 'Motivo requerido']" label="Fecha Inicio"></v-text-field>
          <v-text-field type="date" v-model="fechaFin"  :rules="[v => !!v || 'Motivo requerido']" label="Fecha Fin"></v-text-field>
        
          <div class="d-flex justify-end mt-2">
            <v-btn color="primary" class="ml-2" type="submit" block variant="flat">Generar</v-btn>
          </div>
        </v-form>
      </v-sheet>
      </v-card-text>
      <Reporte 
      :transacciones="transaccionesReporte"/>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from '@/firebaseConfig';
import { collection, getDocs, orderBy, query, where, Timestamp  } from 'firebase/firestore';
import Reporte from '@/components/dashboards/ReporteTabla.vue';

const nombreReporte = ref(null);
const fechaInicio = ref('');
const fechaFin = ref('');
const loading = ref(false);
interface Transaccion {
  id: string,
  fecha: string,
  motivo: string,
  monto: number,
  tipo: string,
  formaPago: string,
  idEmpleado: string,
  idCliente: string,
  nombreEmpleado: string
};

const transacciones = ref<Array<Transaccion>>([]);
const transaccionesReporte = ref<Array<Transaccion>>([]);


const generarReporte = async () =>  {
  if (!nombreReporte.value || !fechaInicio.value || !fechaFin.value) {
       return;
     }
  await fetchTransacciones();
  
  if (nombreReporte.value === "Transacciones por cliente") {
    const clientesConsulta = await fetchClientes();
    const idsClientes = clientesConsulta.map(cli => cli.id); 
    const filteredTransacciones = transacciones.value.filter(transaccion => idsClientes.includes(transaccion.idCliente));
    transaccionesReporte.value = filteredTransacciones;
  }

  if (nombreReporte.value === "Transacciones por empleados") {
    const empleadosConsulta = await fetchEmpleados();
    const idsEmpleados = empleadosConsulta.map(emp => emp.id); 
    
    const filteredTransacciones = transacciones.value.filter(transaccion => idsEmpleados.includes(transaccion.idEmpleado));
    // Añadir datos adicionales de empleados a transaccionesReporte
    const transaccionesReporte = filteredTransacciones.map(transaccion => {
      const empleadoEncontrado = empleadosConsulta.find(emp => emp.id === transaccion.idEmpleado);
      return {
        ...transaccion,
        nombreEmpleado: empleadoEncontrado?.nombre
      };
    });
    console.table(transaccionesReporte);
    //transaccionesReporte.value = transaccionesReporte;
  }
}

const fetchEmpleados = async () => {
  const empleadosQuery = query(
    collection(db, "empleados"),
  );

  const clientesSnapshot = await getDocs(empleadosQuery);
  const empleados = clientesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return empleados;
};

const fetchClientes = async () => {
  const clientesQuery = query(
    collection(db, "clientes"),
    //where("id", "in", clienteIds)
  );

  const clientesSnapshot = await getDocs(clientesQuery);
  const clientes = clientesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  
  return clientes;
};

const fetchTransacciones = async () => {
  loading.value = true;
  try {
    const fechaInicio2 = new Date(fechaInicio.value);
    const fechaFin2 = new Date(fechaFin.value);
    fechaFin2.setDate(fechaFin2.getDate() + 1);
    const q = query(
      collection(db, "transacciones"),
      where("activo", "==", true),
      where("fecha", ">=", Timestamp.fromDate(fechaInicio2)),
      where("fecha", "<=", Timestamp.fromDate(fechaFin2)),
      orderBy("fecha", "desc") // Ordenar por fecha descendente
    );  

    const querySnapshot = await getDocs(q);
    
    transacciones.value = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        fecha: data.fecha as string,
        motivo: data.motivo as string,
        monto: data.monto as number,
        tipo: data.tipo as string,
        formaPago: data.formaPago as string,
        idEmpleado: data.idEmpleado as string,
        idCliente: data.idCliente as string
        };
    });
    
  } catch (error) {
    console.error("Error fetching transacciones: ", error);
  }finally {
    loading.value = false;
  }
}; 

</script>
