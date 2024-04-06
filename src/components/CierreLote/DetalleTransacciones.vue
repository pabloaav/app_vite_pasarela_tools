<template>
  <v-dialog v-model="dialog" max-width="900px">
    <v-card width="100%">
      <v-card-title>
        CIERRE DE LOTE <v-spacer></v-spacer> Pago intento id: {{ data.id }}
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="body-2">
        <v-list
          subheader
          dense
          v-for="(header, i) in Object.keys(data.detalle)"
          :key="i"
        >
          <v-list-item>
            <v-list-item-title> {{ header }}</v-list-item-title>

            <v-list-item-action>
              {{ Object.values(data.detalle)[i] }}
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "DetalleTransacciones",
  data() {
    return {
      dialog: false,
      data: null,
    };
  },

  mounted() {
    this.$on("showDialog", (data) => {
      this.data = data;
      this.dialog = true;
    });
  },
};
</script>
