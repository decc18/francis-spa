<template>
    <v-data-table
      :headers="headers"
      :items="formattedTransacciones"
      :items-per-page=5
    >
    <template v-slot:[`item.montoPer`]="{ item }">
            <div>
              <v-chip
              :class="{
                'text-body-2 bg-info': item.montoTotal === item.montoPagado,
                'text-body-2 bg-success': item.tipo === 'pago',
                'text-body-2 bg-error': item.tipo === 'transaccion' 
              }"
              color="white"
              size="small"
            >{{ item.tipo === 'pago' || item.montoTotal === item.montoPagado ?  '+':  '-' }} ${{ item.tipo === 'transaccion' ?  (parseFloat(item.montoTotal) - parseFloat(item.montoPagado)).toFixed(2):  parseFloat(item.montoTotal).toFixed(2) }} 
            </v-chip>
        </div>
      </template>
      <template v-slot:[`item.motivoPer`]="{ item }">
        <div class="d-flex align-center gap-x-4">
          <div class="text-center">
            <v-btn color="error" @click="openDeleteTransactionDialog(item)" icon size="x-small"  flat>
              <TrashIcon stroke-width="1.5"  />
            </v-btn>
        </div>
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
  <v-dialog v-model="deleteTransactionDialog" max-width="500">
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
  </v-dialog>
  
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { ref, computed } from 'vue';
import { format } from "date-fns";
import { PencilIcon, TrashIcon } from 'vue-tabler-icons';
const emit = defineEmits(['delete-transaccion']);
const deleteTransactionDialog = ref(false);
const props = defineProps({
  transacciones: {
    type: Array as PropType<Transaccion[]>,
    required: true
  }
});

const selectedTransaction = ref<null | Transaccion>(null);

interface Transaccion {
  id: string,
  fecha: any,
  motivo: string,
  montoTotal: number,
  montoPagado: number,
  tipo: string,
  formaPago: null,
  referencia: string,
};

const search = ref('');
const headers = [ 
  { title: 'MotivoTransacción', key: 'motivoPer' , sortable: false },
  { title: 'Pendiente', key: 'montoPer', sortable: false },
  { title: 'MontoTotal', key: 'montoTotal', sortable: false },
  { title: 'MontoPagado', key: 'montoPagado', sortable: false },
  { title: 'FechaTransacción', key: 'fecha', sortable: false },
  
  { title: 'Emplead@', key: 'empleado', sortable: false  },
];

// Formatear fechas en las transacciones
const formattedTransacciones = computed(() => {
  return props.transacciones.map(transaccion => ({
    ...transaccion,
    fecha: format(transaccion.fecha.toDate(), "dd/MM/yyyy HH:mm")
  }));
});

const openDeleteTransactionDialog = (transaccion: Transaccion) => {
  selectedTransaction.value = transaccion;
  deleteTransactionDialog.value = true;
};

const closeDeleteTransactionDialog = () => {
  deleteTransactionDialog.value = false;
};


const deleteTransaction = async () => {
  emit('delete-transaccion', selectedTransaction);
  deleteTransactionDialog.value = false;
};


</script>

<style scoped>

</style>