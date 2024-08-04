<template>
    <v-text-field
      v-model="search"
      label="Buscar"
      clearable
      class="mx-4"
    ></v-text-field>
    <v-data-table
      :headers="headers"
      :items="tablaClientes"
      :search="search"
      :items-per-page=5
    >
    <!-- <template v-slot:[`item.ver`]="{ item }">
        <div class="text-center" @click="viewClientDetails(item)">
             <v-btn color="primary" icon size="small"  flat>
              <UserSearchIcon stroke-width="1.5"  />
            </v-btn>
        </div>
      </template> -->
      <!-- <template v-slot:[`item.acciones`]="{ item }">
        <div class="text-center">
             <v-btn color="error" icon size="x-small"  flat>
              <PencilIcon stroke-width="1.5"  />
            </v-btn>
        </div>
      </template> -->
      <!-- <template v-slot:[`item.balancePer`]="{ item }">
        <div>
            <v-chip
           @click="viewClientDetails(item)"
              :class="{'text-end text-body-2 bg-success': item.balance >= 0, 'text-end text-body-2 bg-error': item.balance < 0}"
              color="white"
              size="small"> ${{parseFloat(item.balance).toFixed(2)}}
            </v-chip>
        </div>
      </template> -->
      <!-- <template v-slot:[`item.fechaPagoPer`]="{ item }">
        <div>
          {{ item.fechaPago ? moment(String(item.fechaPago.toDate())).format('MM/DD/YYYY') : '' }}
        </div>
      </template> -->
      <template v-slot:[`item.nombrePer`]="{ item }">
        <div class="d-flex align-center gap-x-4" @click="viewClientDetails(item)">
          <div class="text-center">
             <v-btn color="primary" icon size="small"  flat>
              <UserSearchIcon stroke-width="1.5"  />
            </v-btn>
          </div>
          <div class="ml-2 d-flex flex-column">
              <h6 class="text-h6 font-weight-medium user-list-name">
                {{ item.nombre }}
              </h6>
              <span v-if="item.balance != 0" class="text-sm text-medium">
                <v-chip
                @click="viewClientDetails(item)"
                    :class="{'text-end text-body-2 bg-success': item.balance >= 0, 'text-end text-body-2 bg-error': item.balance < 0}"
                    color="white"
                    size="small"> ${{parseFloat(item.balance).toFixed(2)}}
                  </v-chip>
              </span>
          </div>
        </div>
      </template>
      <template v-slot:[`item.fechaPagoPer`]="{ item }">
        <div class="d-flex align-center gap-x-4" @click="viewClientDetails(item)">
          <div class="ml-2 d-flex flex-column">
              <h6 v-if="item.fechaPago" class="text-h6 font-weight-medium user-list-name">
                {{ moment(String(item.fechaPago?.toDate())).format('MM/DD/YYYY') }}
              </h6>
              <span v-if="item.balance != 0" class="text-sm text-medium">
                <v-chip
                v-if="item.fechaPago"
                :class="{'text-end text-body-2 bg-success': calculateDifference(item.fechaPago?.toDate()) >= 0, 'text-end text-body-2 bg-warning': calculateDifference(item.fechaPago?.toDate()) < 0}"
                color="white"
                size="small"
              > Pago en {{calculateDifference(item.fechaPago?.toDate())}} día(s)</v-chip>
              </span>
          </div>
        </div>
      </template>
  </v-data-table>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import moment from 'moment'

const props = defineProps({
  tablaClientes: {
    type: Array as PropType<DatosCliente[]>,
    required: true
  }
});

interface DatosCliente {
  //activo: boolean;
  balance: number;
  idUsuario: string;
  nombre: string;
  telefono: string;
  fechaPago: string;
}

const search = ref('');
const headers = [
  // { title: 'Ver', key: 'ver', sortable: false, align: 'center'},
  { title: 'NombreCompletoCliente', value: 'nombrePer', sortable: false},
  { title: 'Nom', key: 'nombre', align: ' d-none' },
  // { title: 'Balance', key: 'balancePer', sortable: false , align: 'right'},
  { title: 'FechaPago', key: 'fechaPagoPer', sortable: false },
  // { title: 'FechaPago', key: 'fechaPagoPer', sortable: false , align: 'right' },
  { title: 'Teléfono', key: 'telefono', sortable: false  },
  { title: 'Email', key: 'email', sortable: false  },
  
];

const calculateDifference = (date: string) => {
  if (date) {
        const start = moment(new Date(date));
        const end = moment(new Date());
        return start.diff(end, 'days');
  }
};


const router = useRouter();
const viewClientDetails = (itemCliente: DatosCliente) => {
  router.push({ name: 'DetalleCliente', params: { id: itemCliente.id } });
};

</script>
<style scoped>
</style>