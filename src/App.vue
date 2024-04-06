<template>
  <div v-if="!isLogin">
    <v-app class="app-container" app id="inspire">
      <Dashboard v-if="!isLogin" />
      <!-- <ModalExpiracion /> -->
      <router-view></router-view>
    </v-app>
  </div>
  <div v-else>
    <router-view></router-view>
  </div>
</template>

<script>
import Dashboard from "./components/Dashboard.vue";
// import ModalExpiracion from "./components/ModalExpiracion.vue";

export default {
  name: "App",
  components: { Dashboard },
  data: () => ({ isLogin: true }),
  updated() {
    if (this.$router.currentRoute.path !== "/login") {
      this.isLogin = false;
    } else this.isLogin = true;
  },
};
</script>

<style>
* {
  font-family: "Inter", sans-serif !important;
  scrollbar-width: auto;
  scrollbar-color: #d1d1d1 #ffffff;
}

/* Other browsers */
*::-webkit-scrollbar {
  width: 15px;
}

*::-webkit-scrollbar-track {
  background: #ffffff;
}

*::-webkit-scrollbar-thumb {
  background-color: #d1d1d1;
  border-radius: 10px;
  border: 3px solid #ffffff;
}

html {
  overflow: hidden;
}
</style>
