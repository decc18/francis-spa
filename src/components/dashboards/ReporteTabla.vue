<template>
    <v-data-table
      :headers="headers"
      :items="formattedTransacciones"
      :items-per-page=5
    >
    <template v-slot:[`item.montoPer`]="{ item }">
            <div>
              <v-chip
              :class="{'text-body-2 bg-success': item.tipo === 'Pago', 'text-body-2 bg-error': item.tipo !== 'Pago'}"
              color="white"
              size="small"
            > ${{ item.tipo === 'Pago' ? '+' : '-' }}{{parseFloat(item.monto).toFixed(2)}}</v-chip>
        </div>
      </template>
      <template v-slot:[`item.motivoPer`]="{ item }">
        <div class="d-flex align-center gap-x-4">
          
          <div class="ml-2 d-flex flex-column">
            <h6 class="text-h6 font-weight-medium user-list-name">
              {{ item.motivo }}
            </h6>
            <span class="text-sm text-medium">{{ item.formaPago }}
              <v-chip
              v-if="item.fechaPago"
              class="text-body-2 bg-info"
              color="white"
              size="small"
            ></v-chip>
            </span>
          </div>
        </div>
      </template>
    </v-data-table> 
     <!-- Dialog para eliminar transacción -->
  <!-- <v-dialog v-model="deleteTransactionDialog" max-width="500">
    <v-card>
      <v-card-title>
        <span class="text-h5 font-weight-semibold">Eliminar Transacción</span>
      </v-card-title>
      <v-card-text>
        ¿Estás seguro de que quieres eliminar esta transacción?
      </v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="closeDeleteTransactionDialog" variant="flat">
          Cancelar
        </v-btn>
        <v-btn color="primary" @click="deleteTransaction" variant="flat">
          Eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { ref, computed } from 'vue';
import { format } from "date-fns";
const props = defineProps({
  transacciones: {
    type: Array as PropType<Transaccion[]>,
    required: true
  }
});

interface Transaccion {
  id: string,
  fecha: any,
  motivo: string,
  monto: number,
  tipo: string,
  formaPago: string
  nombreEmpleado: string
};

const headers = [
  { title: 'NombreEmplead@', key: 'nombreEmpleado' },
  { title: 'MotivoTransacción', key: 'motivoPer' },
  { title: 'Monto', key: 'montoPer' },
  { title: 'FechaTransacción', key: 'fecha' },
  { title: 'Empleado', key: 'empleado' },
  { title: 'IdCliente', key: 'idCliente' },
];

// Formatear fechas en las transacciones
const formattedTransacciones = computed(() => {
  return props.transacciones.map(transaccion => ({
    ...transaccion,
    fecha: format(transaccion.fecha.toDate(), "dd/MM/yyyy HH:mm")
  }));
});

</script>
<style scoped>
</style>