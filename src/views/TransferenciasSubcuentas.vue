<template>
  <v-main>
    <v-subheader class="font-weight-bold mt-2">
      Transferencias Subcuentas
    </v-subheader>

    <template>
      <v-row class="ml-3">
        <!-- -------------fecha INICIO----------------- -->
        <v-col cols="12" sm="6" md="4">
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
                label="Fecha Inicio"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fechaInicio"
              @input="menu1 = false"
              :max="moment().format('YYYY-MM-DD')"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <!-- -------------fecha FIN----------------- -->
        <v-col cols="12" sm="6" md="4">
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
                label="Fecha Fin"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fechaFin"
              @input="menu2 = false"
              :max="moment().format('YYYY-MM-DD')"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <!-- ------------------ BOTON FILTRAR ------------------ -->
        <v-col cols="12" sm="6" md="4">
          <v-btn class="blue white--text ml-8 mt-3">
            <v-icon left>mdi-filter-variant</v-icon> Filtrar
          </v-btn>
        </v-col>
      </v-row>
      <!-- tabla  -->
      <v-row>
        <v-col cols="12">
          <TablaTransfSubcuentas class="ml-5" />
        </v-col>
      </v-row>
    </template>
  </v-main>
</template>

<script>
import moment from "moment";
import { formatDate } from "@/helpers";
import TablaTransfSubcuentas from "@/components/TransferenciasSubcuentas/TablaTransfSubcuentas.vue";
export default {
  name: "TransferenciasSubcuentas",
  components: {
    TablaTransfSubcuentas,
  },
  data: () => ({
    fechaInicio: moment().format("YYYY-MM-DD"),
    menu1: false,
    fechaFin: moment().format("YYYY-MM-DD"),
    menu2: false,

    moment,
    formatDate,
  }),
};
</script>

<style scoped></style>
