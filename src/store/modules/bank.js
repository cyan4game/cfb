/*
 * @author django
 * @description 用户银行卡的逻辑
 * @time 2022/2/17
 */
import { getAddressBookList } from "../../api/api";

export default {
  namespaced: true,
  state: {
    coinList: [], // 地址簿列表
    coin: "",
  },
  actions: {
    GET_COIN_ADDRESS_LIST({ commit, state }, data) {
      if (data) commit("SAVE_COIN", data.coin);
      return new Promise((resolve) => {
        const params = {};
        if (state.coin) params.coin = state.coin;
        getAddressBookList(params).then((res) => {
          if (res.code.toString() === '0') commit("SAVE_COIN_ADDRESS_LIST", res.data);
          resolve(res);
        });
      });
    },
  },
  mutations: {
    SAVE_COIN_ADDRESS_LIST(state, data) {
      state.coinList = data;
    },
    SAVE_COIN(state, coin) {
      state.coin = coin;
    },
  },
};
