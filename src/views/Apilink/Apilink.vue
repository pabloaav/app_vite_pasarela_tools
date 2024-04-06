<template>
  <div>
    <Drawer title="Ejecutar proceso" width="380px">
      <div>
        <EjecutarProceso></EjecutarProceso>
      </div>
    </Drawer>
    <v-main class="mx-8">
      <!--FILTROS-->
      <v-row align="center" class="mt-2">
        <v-col lg="12" xl="9" class="d-flex align-center">
          <!-- FECHA INICIO -->
          <v-menu
            v-model="menu1"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="formatDate(fechaInicio)"
                label="Fecha inicio"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                style="max-width: 260px"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fechaI"
              @change="setFechaInicio(fechaI)"
              @input="menu1 = false"
              locale="es"
              :max="new Date().toISOString().substr(0, 10)"
            ></v-date-picker>
          </v-menu>

          <!-- FECHA FIN -->
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            transition="scale-transition"
            offset-y
            min-width="auto"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="formatDate(fechaFin)"
                label="Fecha fin"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                style="max-width: 260px"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fechaF"
              @change="setFechaFin(fechaF)"
              @input="menu2 = false"
              locale="es"
              :max="new Date().toISOString().substr(0, 10)"
            ></v-date-picker>
          </v-menu>

          <v-text-field
            v-model="referenciaBanco"
            label="Referencia banco"
            prepend-inner-icon="mdi-bank-outline"
            class="ml-4"
            clearable
          ></v-text-field>

          <!-- boton dots para desplegar menu -->
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item link @click="setDrawer(true)">
                <v-list-item-icon>
                  <v-icon>mdi-plus-box-multiple</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Ejecutar proceso</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="modalDebin = true">
                <v-list-item-icon>
                  <v-icon>mdi-cash-refund</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>Consultar DEBIN</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- BTN GET DATA -->
          <v-btn class="blue white--text ml-8" @click="getApilinkData()">
            <v-icon left>mdi-filter-variant</v-icon> Filtrar
          </v-btn>
        </v-col>
      </v-row>

      <v-subheader class="font-weight-bold" v-if="!loadingTable">
        API - Link

        <v-radio-group
          v-model="conciliados"
          row
          class="ml-12"
          @change="getApilinkData()"
        >
          <v-radio
            label="Todos"
            :value="0"
            class="font-weight-regular"
          ></v-radio>
          <v-radio
            label="Conciliados"
            :value="1"
            class="font-weight-regular"
          ></v-radio>
          <v-radio
            label="No conciliados"
            :value="2"
            class="font-weight-regular"
          ></v-radio>
        </v-radio-group>
      </v-subheader>

      <TableApilink class="mb-4" />
    </v-main>

    <v-dialog
      v-model="modalDebin"
      max-width="650px"
      @click:outside="closeDebin()"
      :fullscreen="$vuetify.breakpoint.smAndDown"
    >
      <v-card>
        <v-card-title class="text-h6"> DEBIN </v-card-title>

        <v-form ref="formDebin" class="mb-2">
          <v-subheader class="mx-5">
            Paso 1 - Buscar información del ticket
          </v-subheader>
          <v-row no-gutters class="mx-5">
            <v-col class="d-flex ml-3">
              <v-text-field
                placeholder="External reference / Ticket ID"
                label="External reference / Ticket ID"
                v-model="external_reference"
                outlined
                dense
              ></v-text-field>
              <v-btn
                elevation="2"
                icon
                class="grey darken-1 ml-3 mt-1"
                @click="searchTiket"
                :loading="loadingTiket"
              >
                <v-icon small class="white--text">mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <div>
            <v-simple-table class="mx-6 mt-2" dense>
              <template v-slot:default>
                <thead class="grey lighten-2">
                  <tr>
                    <th class="text-left">DEBIN ID</th>
                    <th class="text-left">ESTADO</th>
                    <th class="text-left">FECHA DE PAGO</th>
                  </tr>
                </thead>
                <tbody class="grey lighten-5">
                  <tr v-for="item in dataTicket">
                    <th>
                      {{ item?.pagointento.external_id }}
                      <v-btn
                        small
                        icon
                        class="grey ma-2"
                        @click="
                          copiarPortaPapeles(item?.pagointento.external_id)
                        "
                      >
                        <v-icon small color="white">mdi-content-copy</v-icon>
                      </v-btn>
                    </th>
                    <th>{{ item.estado }}</th>
                    <th>{{ formatDate(item.fecha_pago) }}</th>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>

          <v-divider class="mt-6"></v-divider>

          <v-subheader class="mx-5">
            Paso 2 - Buscar información del DEBIN
          </v-subheader>
          <v-row no-gutters class="mx-5">
            <v-col class="d-flex ml-3">
              <v-text-field
                label="DEBIN ID"
                placeholder="DEBIN ID"
                dense
                v-model="debin_id"
                :rules="[(v) => !!v || 'DEBIN ID es requerido']"
                outlined
              ></v-text-field>
              <v-btn
                elevation="2"
                icon
                class="blue darken-1 ml-3 mt-1"
                @click="searchDebin"
                :loading="loadingDebin"
              >
                <v-icon small color="white">mdi-sync</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-card-text>
          <v-tabs dense v-model="tab" height="40">
            <v-tab class="text-capitalize text-body-2">Debin info</v-tab>
            <v-tab class="text-capitalize text-body-2">Comprador info</v-tab>
          </v-tabs>
          <v-data-table
            :headers="headersDebin"
            :items="dataDebin"
            :mobile-breakpoint="20000"
            disable-sort
            disable-pagination
            hide-default-footer
            dense
            no-data-text="Sin datos para mostrar"
            class="text-body-2 mt-3"
            height="250"
            v-show="tab === 0"
          >
            <template v-slot:[`item.importe`]="{ item }">
              {{ formatImport(item.importe) }}
            </template>
            <template v-slot:[`item.esCuentaPropia`]="{ item }">
              {{ item.esCuentaPropia ? "Si" : "No" }}
            </template>
            <template v-slot:[`item.recurrente`]="{ item }">
              {{ item.recurrente ? "Si" : "No" }}
            </template>
            <template v-slot:[`item.devuelto`]="{ item }">
              {{ item.devuelto ? "Si" : "No" }}
            </template>
            <template v-slot:[`item.estado`]="{ item }">
              <v-chip>
                {{ item.estado }}
              </v-chip>
            </template>
            <template v-slot:[`item.fechaExpiracion`]="{ item }">
              {{ formatDate(item.fechaExpiracion) }}
            </template>
            <template v-slot:[`item.fechaCreacion`]="{ item }">
              {{ formatDate(item.fechaCreacion) }}
            </template>
          </v-data-table>

          <v-data-table
            :headers="headersComprador"
            :items="dataComprador"
            :mobile-breakpoint="20000"
            disable-sort
            disable-pagination
            hide-default-footer
            dense
            no-data-text="Sin datos para mostrar"
            class="text-body-2 mt-3"
            height="250"
            v-show="tab === 1"
          ></v-data-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Dashboard from "@/components/Dashboard.vue";
import TableApilink from "@/components/CierreLote/TableApilink.vue";
import { mapActions, mapGetters, mapMutations } from "vuex";
import moment from "moment";
import Drawer from "@/components/Drawer.vue";
import EjecutarProceso from "./EjecutarProceso.vue";
import apilinkService from "@/services/apilink";
import { formatDate, formatImport } from "../../helpers";

export default {
  name: "ApilinkView",
  components: { Dashboard, TableApilink, Drawer, EjecutarProceso },
  data() {
    return {
      fechaI: null,
      fechaF: null,

      menu1: false,
      menu2: false,

      modalDebin: false,
      dialog: true,

      cbu: "",
      debin_id: "",
      external_reference: "",

      loadingDebin: false,
      loadingTiket: false,
      dataTicket: [],
      tab: 0,

      headersDebin: [
        { text: "Estado", value: "estado" },
        { text: "Id de comprobante", value: "comprobanteId" },
        { text: "Es cuenta propia", value: "esCuentaPropia" },
        { text: "Concepto", value: "concepto" },
        { text: "Tiempo expiracion", value: "tiempoExpiracion" },
        { text: "Importe", value: "importe" },
        { text: "Moneda", value: "moneda" },
        { text: "Id de usuario", value: "usuarioId" },
        { text: "Fecha de expiracion", value: "fechaExpiracion" },
        { text: "Fecha de cración", value: "fechaCreacion" },
        { text: "Devuelto", value: "devuelto" },
        { text: "Recurrente", value: "recurrente" },
        { text: "Prestacion", value: "prestacion" },
        { text: "Id de contracargo", value: "contracargoid" },
      ],
      dataDebin: [],

      headersComprador: [
        { text: "titular", value: "titular" },
        { text: "cbu", value: "cbu" },
        { text: "aliasCbu", value: "aliasCbu" },
        { text: "cuitcuil", value: "cuitcuil" },
        { text: "tipo", value: "tipo" },
        { text: "moneda", value: "moneda" },
        { text: "banco", value: "banco" },
        { text: "sucursal", value: "sucursal" },
      ],
      dataComprador: [],

      formatImport,
      formatDate,
    };
  },

  computed: {
    ...mapGetters("cierre_lote", ["fechaInicio", "fechaFin", "loadingTable"]),

    conciliados: {
      get() {
        return this.$store.getters["cierre_lote/conciliados"];
      },
      set(newCode) {
        return this.$store.dispatch("cierre_lote/setConciliados", newCode);
      },
    },

    referenciaBanco: {
      get() {
        return this.$store.getters["cierre_lote/referenciaBanco"];
      },
      set(nuevaRef) {
        return this.$store.dispatch("cierre_lote/setReferenciaBanco", nuevaRef);
      },
    },
  },

  mounted() {
    this.fechaI = moment(this.fechaInicio).format("YYYY-MM-DD");
    this.reset();
    this.getApilinkData();
  },

  methods: {
    ...mapActions("cierre_lote", [
      "setFechaInicio",
      "setFechaFin",
      "getApilinkData",
    ]),
    ...mapActions(["setDrawer"]),
    ...mapMutations("cierre_lote", ["reset"]),

    async searchDebin() {
      try {
        if (this.$refs.formDebin.validate()) {
          const params = { Id: this.debin_id };

          this.loadingDebin = true;

          const data = await apilinkService.getDebinByID(params);
          const debin = data?.data?.debin;

          console.log(data);

          this.dataDebin = [debin];
          this.dataComprador = [debin?.comprador];

          this.loadingDebin = false;

          this.$toast.success("Datos obtenidos correctamente");
        }
      } catch (error) {
        console.error(error);
        this.loadingDebin = false;
        this.$toast.error("Error al obtener información de debin");
      }
    },

    async searchTiket() {
      if (this.external_reference.length === 0) {
        this.$toast.error("Ingrese un external reference");
        return;
      }

      try {
        const params = { ExternalReference: this.external_reference };

        this.loadingTiket = true;

        const data = await apilinkService.getTicketInfo(params);
        this.dataTicket = [data?.data];

        this.loadingTiket = false;

        this.$toast.success("Datos obtenidos correctamente");
      } catch (error) {
        console.error(error);
        this.loadingTiket = false;
        this.closeDebin(true);
        this.$toast.error("Error al obtener información del tiket");
      }
    },

    async copiarPortaPapeles(text) {
      try {
        await navigator.clipboard.writeText(text);
        this.$toast.success("Código copiado con exito");
      } catch ($e) {
        this.$toast.error("Error al copiar en porta papeles");
      }
    },

    closeDebin(error) {
      this.dataComprador = [];
      this.dataDebin = [];
      this.dataTicket = [];

      this.cbu = "";
      this.debin_id = "";

      if (!error) this.external_reference = "";
    },
  },
};
</script>

<style scoped>
.v-application {
  display: flex;
  overflow: auto;
}
</style>
