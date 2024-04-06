<template>
  <v-dialog
    v-model="dialogDetalleMovimiento"
    max-width="80%"
    scrollable
    @click:outside="setDialogDetalleMovimiento(false)"
  >
    <v-card v-if="item">
      <v-card-title class="text-h5">
        Detalle de movimiento
        <v-divider class="mx-6" vertical />
        ID:
        {{ item.Id }}
        <v-divider class="mx-6" vertical />
        <span class="font-weight-light"
          >Cantidad de movimientos: {{ item.DetalleMovimientos.length }}</span
        >
      </v-card-title>

      <!--DETALLE DE OPERACIÓN-->

      <v-card-text class="pa-0 pb-2 px-2">
        <p class="black--text pa-2 text-h6 mb-0">
          Códigos de autorización:
          <span class="font-weight-medium mx-2">{{
            codigosAutorizacion
              .map(({ codigo }) => codigo)
              .toString()
              .replaceAll(",", "  -  ")
          }}</span>
        </p>
        <v-divider></v-divider>
        <v-data-table
          :headers="headers"
          :items="item.DetalleMovimientos"
          loading-text="Cargando movimientos"
          item-key="Id"
          no-data-text="Datos no encontrados"
          fixed-header
          height="530px"
          show-select
          checkbox-color="black"
          v-model="selected"
          hide-default-footer
          disable-pagination
        >
          <template v-slot:[`item.FechaOrigenCompra`]="{ item }">
            {{ formatDate(item.FechaOrigenCompra, true) }}
          </template>
          <template v-slot:[`item.Match`]="{ item }">
            <v-chip :color="item.Match ? 'success' : 'error'">
              {{ item.Match === 1 ? "Si" : "No" }}
            </v-chip>
          </template>
          <template v-slot:[`item.FechaPago`]="{ item }">
            {{ formatDate(item.FechaPago, true) }}
          </template>
          <template v-slot:[`item.FechaPagoOrigenAjuste`]="{ item }">
            {{ formatDate(item.FechaPagoOrigenAjuste, true) }}
          </template>
          <template v-slot:[`item.Importe`]="{ item }">
            {{ formatImport(item.Importe) }}
          </template>
          <template v-slot:[`item.Contracargovisa`]="{ item }">
            {{
              item.Contracargovisa.Id + " - " + item.Contracargovisa.Contracargo
            }}
          </template>
          <template v-slot:[`item.Contracargomaster`]="{ item }">
            {{
              item.Contracargomaster.Id +
              " - " +
              item.Contracargomaster.Contracargo
            }}
          </template>
          <template v-slot:[`item.Tipooperacion`]="{ item }">
            {{ item.Tipooperacion.Id + " - " + item.Tipooperacion.Operacion }}
          </template>
          <template v-slot:[`item.Rechazotransaccionprincipal`]="{ item }">
            {{
              item.Rechazotransaccionprincipal.Id +
              " - " +
              item.Rechazotransaccionprincipal.Rechazo
            }}
          </template>
          <template v-slot:[`item.Rechazotransaccionsecundario`]="{ item }">
            {{
              item.Rechazotransaccionsecundario.Id +
              " - " +
              item.Rechazotransaccionsecundario.Rechazo
            }}
          </template>
          <template v-slot:[`item.Motivoajuste`]="{ item }">
            {{ item.Motivoajuste.Id + " - " + item.Motivoajuste.Motivoajustes }}
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { formatDate, formatImport } from "@/helpers";
import { mapActions, mapGetters } from "vuex";
export default {
  name: "DetalleMovimientoPrisma",
  props: { item: Object },
  data: () => ({
    formatDate: formatDate,
    formatImport,

    selected: [],

    headers: [
      { text: "Id", value: "Id", sortable: false },
      {
        text: "Match",
        value: "Match",
        sortable: false,
      },
      {
        text: "PrismamovimientototalesId",
        value: "PrismamovimientototalesId",
        sortable: false,
      },
      {
        text: "PrismamastercontracargosId",
        value: "PrismamastercontracargosId",
        sortable: false,
      },
      {
        text: "PrismamovimientototalesId",
        value: "PrismamovimientototalesId",
        sortable: false,
      },
      {
        text: "PrismaoperacionsId",
        value: "PrismaoperacionsId",
        sortable: false,
      },
      {
        text: "RechazoPrincipalId",
        value: "RechazoPrincipalId",
        sortable: false,
      },
      {
        text: "PrismavisacontracargosId",
        value: "PrismavisacontracargosId",
        sortable: false,
      },
      {
        text: "PrismamotivosajustesId",
        value: "PrismamotivosajustesId",
        sortable: false,
      },
      {
        text: "TipoRegistro",
        value: "TipoRegistro",
        sortable: false,
      },
      {
        text: "TipoAplicacion",
        value: "TipoAplicacion",
        sortable: false,
      },
      {
        text: "Lote",
        value: "Lote",
        sortable: false,
      },
      {
        text: "NroTarjeta",
        value: "NroTarjeta",
        sortable: false,
      },
      {
        text: "FechaOrigenCompra",
        value: "FechaOrigenCompra",
        sortable: false,
      },
      {
        text: "FechaPago",
        value: "FechaPago",
        sortable: false,
        width: "130",
      },
      {
        text: "NroCupon",
        value: "NroCupon",
        sortable: false,
      },
      {
        text: "Importe",
        value: "Importe",
        sortable: false,
      },
      {
        text: "SignoImporte",
        value: "SignoImporte",
        sortable: false,
      },
      {
        text: "NroAutorizacion",
        value: "NroAutorizacion",
        sortable: false,
      },
      {
        text: "NroCuota",
        value: "NroCuota",
        sortable: false,
      },
      {
        text: "PlanCuota",
        value: "PlanCuota",
        sortable: false,
      },
      {
        text: "RecAcep",
        value: "RecAcep",
        sortable: false,
      },
      {
        text: "NroLiquidacion",
        value: "NroLiquidacion",
        sortable: false,
      },
      {
        text: "ContracargoOrigen",
        value: "ContracargoOrigen",
        sortable: false,
      },
      {
        text: "Moneda",
        value: "Moneda",
        sortable: false,
      },
      {
        text: "IdCf",
        value: "IdCf",
        sortable: false,
        width: "220",
      },
      {
        text: "CfExentoIva",
        value: "CfExentoIva",
        sortable: false,
        width: "190",
      },
      {
        text: "FechaPagoOrigenAjuste",
        value: "FechaPagoOrigenAjuste",
        sortable: false,
      },
      {
        text: "PorcentDescArancel",
        value: "PorcentDescArancel",
        sortable: false,
      },
      {
        text: "Arancel",
        value: "Arancel",
        sortable: false,
      },
      {
        text: "TnaCf",
        value: "TnaCf",
        sortable: false,
      },
      {
        text: "ImporteCostoFinanciero",
        value: "ImporteCostoFinanciero",
        sortable: false,
      },
      {
        text: "SignoImporteCostoFinanciero",
        value: "SignoImporteCostoFinanciero",
        sortable: false,
      },
      {
        text: "BanderaEstablecimiento",
        value: "BanderaEstablecimiento",
        sortable: false,
      },
      {
        text: "NroTarjetaXl",
        value: "NroTarjetaXl",
        sortable: false,
      },
      {
        text: "NroAutorizacionXl",
        value: "NroAutorizacionXl",
        sortable: false,
      },

      {
        text: "Contracargovisa",
        value: "Contracargovisa",
        sortable: false,
        width: "260px",
        align: "center",
      },
      {
        text: "Contracargomaster",
        value: "Contracargomaster",
        sortable: false,
        width: "200px",
        align: "center",
      },
      {
        text: "Tipooperacion",
        value: "Tipooperacion",
        sortable: false,
        width: "220px",
        align: "center",
      },
      {
        text: "Rechazotransaccionprincipal",
        value: "Rechazotransaccionprincipal",
        sortable: false,
        width: "220px",
        align: "center",
      },
      {
        text: "Rechazotransaccionsecundario",
        value: "Rechazotransaccionsecundario",
        sortable: false,
        width: "220px",
        align: "center",
      },
      {
        text: "Motivoajuste",
        value: "Motivoajuste",
        sortable: false,
        width: "220px",
        align: "center",
      },
    ],
  }),

  watch: {
    selected(newSelection) {
      const codigos = newSelection.map((detalle) => {
        let codigo = detalle.NroAutorizacionXl.substr(2);

        if (this.item.Codop !== "0005" && this.item.TipoAplicacion === "-") {
          codigo = detalle.NroAutorizacionXl.substr(3);
        }
        return {
          codigo,
          importe: detalle.Importe,
        };
      });

      this.setCodigosAutorizacion(codigos);
    },
  },

  computed: {
    ...mapGetters("cierre_lote", ["codigosAutorizacion"]),
    dialogDetalleMovimiento: {
      get() {
        return this.$store.state.cierre_lote.dialogDetalleMovimiento;
      },
      set(value) {
        this.setDialogDetalleMovimiento(value);
      },
    },
  },
  methods: {
    ...mapActions("cierre_lote", [
      "setDialogDetalleMovimiento",
      "setCodigosAutorizacion",
    ]),
  },
};
</script>

<style scoped></style>
