import Vue from "vue";
import App from "./App.vue";
import VueRouter from "vue-router";
import router from "./router/index";
import vuetify from "@/plugins/vuetify";
import store from "./storage/index";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueHtml2pdf from "vue-html2pdf";

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueSweetalert2);
Vue.use(VueHtml2pdf);
Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true,
});

new Vue({
  router,
  vuetify,
  store,
  render: (h) => h(App),
}).$mount("#app");
