<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title
          class="blue-grey--text text--darken-4 mr-4 font-weight-black"
        >
          Su sesión ha expirado
        </v-card-title>
        <v-card-text>Por favor, vuelva a ingresar.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="mt-4 blue white--text" text @click="aceptar">
            Aceptar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "ModalExpiracion",
  props: {
    dialog: Boolean,
  },
  methods: {
    aceptar() {
      this.$router.push("/login");
      window.localStorage.removeItem("userLogged");
    },
  },
};
</script>

<style scoped>
.modal-card {
  z-index: 9999;
}
</style>
