import { getAutoOrderSummary } from "../../api/api";

export default {
  namespaced: true,
  state: {
    orderInfo: {},
  },
  actions: {
    // 查询接单摘要
    GET_AUTO_ORDER_INFO({ commit, dispatch }, isLoop = true) {
      return new Promise((resolve, reject) => {
        getAutoOrderSummary()
          .then((res) => {
            if (res.code.toString() === '0') {
              commit("SAVE_ORDER_INFO", res.data);
            }
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },
  },
  mutations: {
    SAVE_ORDER_INFO(state, data) {
      state.orderInfo = data;
    },
  },
};
