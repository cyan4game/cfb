import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import socket from "./modules/socket";
import bank from "./modules/bank";
import order from "./modules/order";
Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    version: '',
    versionList: ''
  },
  modules: {
    user,
    socket,
    bank,
    order,
  },
});
