<template>
  <div>
    <v-app class="d-flex justify-center align-center">
      <v-card class="form-container elevation-0 pulse">
        <div class="d-flex align-center">
          <h1 class="blue-grey--text text--darken-4 mr-4">Bienvenido!</h1>
          <img
            src="@/assets/saludo.png"
            width="38px"
            height="38px"
            class="rotateInDownRight"
          />
        </div>
        <v-form @submit.prevent="login" ref="form_login">
          <v-text-field
            name="username"
            label="Correo"
            id="email"
            v-model="username"
            persistent-placeholder
            :rules="[(v) => !!v || 'El correo es requerido']"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            name="password"
            label="Contraseña"
            counter
            @click:append="showPassword = !showPassword"
            persistent-placeholder
            v-model="password"
            :rules="[(v) => !!v || 'La contraseña es requerida']"
          ></v-text-field>

          <div
            v-if="errorMessage"
            class="error-container red lighten-1 text-center my-4 pa-2 rounded"
          >
            <span class="white--text">{{ errorMessage }}</span>
          </div>

          <v-btn
            class="mt-4 blue white--text"
            type="submit"
            :loading="authLoading"
            >Ingresar</v-btn
          >
          <div class="mt-4">
            <a
              to="/login"
              class="text-decoration-none blue-grey--text"
              @click="dialog = true"
              >Olvidaste tu contraseña?</a
            >
          </div>
        </v-form>
      </v-card>
      <div class="logo">
        Copyright © 2023 TelCo - Corrientes Telecomunicaciones
        <!-- <img src="../assets/logo.png" alt="" width="55px" /> -->
      </div>
    </v-app>

    <!-- FORMULARIO PARA RECUPERAR CONTRASEÑA -->
    <template>
      <v-row justify="center">
        <v-dialog v-model="dialog" persistent max-width="370px">
          <v-card class="pa-2">
            <v-card-title>
              <span class="text-h5 font-weight-bold">Recuperar contraseña</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="mt-3">
              <p class="mb-4">
                * Recibirás un correo junto con las intrucciones que debés
                seguir para restablecer tu contraseña.
              </p>
              <v-text-field
                ref="input_correo"
                label="Correo electrónico"
                type="email"
                :rules="[
                  () => !!correo || 'El correo es requerido',
                  (v) => /.+@.+\..+/.test(v) || 'Ingrese un correo válido',
                ]"
                v-model="correo"
                required
              ></v-text-field>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="grey" text @click="dialog = false">
                Cancelar
              </v-btn>
              <v-btn
                color="blue darken-1 white--text"
                @click="forgotPassword"
                :loading="forgotLoading"
              >
                ENVIAR
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </template>
  </div>
</template>

<script>
import loginService from "../services/login";
import jwt_decode from "jwt-decode";

export default {
  name: "LoginView",
  data() {
    return {
      //datos del formulario
      username: "",
      password: "",
      sistema_id: import.meta.env.VITE_VUE_APP_SISTEMA_ID,

      errorMessage: "",

      dialog: false, //para ver el formulario de restablecer
      authLoading: false,
      forgotLoading: false,
      correo: "",
      showPassword: false,
    };
  },

  methods: {
    async login() {
      if (this.$refs.form_login.validate()) {
        const userData = {
          username: this.username,
          password: this.password,
          sistema_id: this.sistema_id,
        };
        this.authLoading = true;

        await loginService
          .login(userData)
          .then((userLogged) => {
            if (userLogged.token) {
              //decodificando los datos del token
              const { permisos, user } = jwt_decode(userLogged.token);

              // validando si el usuario cuenta con el permiso para poder ingresar
              if (
                permisos.some(
                  (p) =>
                    p === "psp.herramienta" || p === "psp.herramienta.reporte"
                )
              ) {
                this.authLoading = false;

                this.$store.dispatch("login", user);

                window.localStorage.setItem("userLogged", userLogged.token);

                permisos.some((p) => p === "psp.herramienta")
                  ? this.$router.push("/banco")
                  : this.$router.push("/reportes_graficos");
              } else {
                this.authLoading = false;
                this.errorMessage = "Sin permisos suficientes para ingresar";
              }
            } else {
              // si el usuario se encuentra bloqueado
              this.authLoading = false;
              this.errorMessage = userLogged.activo;
            }
          })
          .catch((error) => {
            console.log(error);
            this.authLoading = false;
            this.errorMessage = error.response.data.message;
            setTimeout(() => {
              this.errorMessage = "";
            }, 4000);
          });
      }
    },
    async forgotPassword() {
      if (this.correo.length > 0) {
        try {
          this.forgotLoading = true;
          await loginService.forgotPassword(this.correo).then(() => {
            this.forgotLoading = false;
            this.correo = "";

            this.$swal.fire({
              text: "Se le ha enviado un correo para poder continuar con el proceso de reestablecimiento de contraseña",
              icon: "success",
            });
          });
        } catch (e) {
          console.error(e);
          this.forgotLoading = false;

          this.$swal.fire({
            text: e.response.data.message,
            icon: "error",
          });
        }
      }
    },
  },
};
</script>

<style scoped>
#app {
  background: #56ccf2; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #2f80ed,
    #56ccf2
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #2f80ed,
    #56ccf2
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.form-container {
  padding: 30px 40px;
  width: 430px;
  max-width: 430px !important;
  margin: auto;
}

.logo {
  position: absolute;
  bottom: 0;

  width: 100%;

  display: flex;
  justify-content: center;
  gap: 10px;
  color: #fff;
  margin-bottom: 15px;
}

.pulse {
  -webkit-animation-name: pulse;
  animation-name: pulse;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
@-webkit-keyframes pulse {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  50% {
    -webkit-transform: scale3d(1.05, 1.05, 1.05);
    transform: scale3d(1.05, 1.05, 1.05);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}
@keyframes pulse {
  0% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
  50% {
    -webkit-transform: scale3d(1.05, 1.05, 1.05);
    transform: scale3d(1.05, 1.05, 1.05);
  }
  100% {
    -webkit-transform: scale3d(1, 1, 1);
    transform: scale3d(1, 1, 1);
  }
}

.rotateInDownRight {
  -webkit-animation-name: rotateInDownRight;
  animation-name: rotateInDownRight;
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  animation-iteration-count: 2;
}
@-webkit-keyframes rotateInDownRight {
  0% {
    -webkit-transform-origin: right bottom;
    transform-origin: right bottom;
    -webkit-transform: rotate3d(0, 0, 1, 70deg);
    transform: rotate3d(0, 0, 1, 70deg);
    opacity: 0;
  }
  100% {
    -webkit-transform-origin: right bottom;
    transform-origin: right bottom;
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}
@keyframes rotateInDownRight {
  0% {
    -webkit-transform-origin: right bottom;
    transform-origin: right bottom;
    -webkit-transform: rotate3d(0, 0, 1, 70deg);
    transform: rotate3d(0, 0, 1, 70deg);
    opacity: 0;
  }
  100% {
    -webkit-transform-origin: right bottom;
    transform-origin: right bottom;
    -webkit-transform: none;
    transform: none;
    opacity: 1;
  }
}
</style>
