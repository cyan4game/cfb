import {
  memberInfo,
  queryIdentityInfo,
  getBankList,
  getMemberAssets,
  logout,
  getQrCodeUrl,
  getOneById,
  getOtcGlobalConfigByType,
  unreadMsgCount,
} from "../../api/api";

export default {
  namespaced: true,
  state: {
    userInfo: {},
    identityInfo: {}, // 身份认证状态查询
    bankList: [], // 银行卡列表
    memberAssets: {}, // 资产明细
    qrUrl: "", // 网银地址URl
    configData: [],
    pushMsgCount: 0,
    totalUnreadCount: 0,
    stationLetterCount: 0,
  },
  getters: {
    userInfo(state) {
      const data = uni.getStorageSync("info");
      const info = data ? JSON.parse(data) : {};
      return state.userInfo.token ? state.userInfo : info;
    },
    memberAssets(state) {
      return state.memberAssets;
    },
  },
  mutations: {
    // 存储用户详情
    SET_USER_UNREAD_COUNT(state, data) {
      state.pushMsgCount = Number(data.pushMsgCount) || 0;
      state.totalUnreadCount = Number(data.totalUnreadCount) || 0;
      state.stationLetterCount = Number(data.stationLetterCount) || 0;
    },
    // 存储用户详情
    SAVE_USER_INFO(state, data) {
      console.log(data, "store");
      state.userInfo = data;
      uni.setStorage({
        key: "info",
        data: JSON.stringify(data),
      });
    },
    // 存储认证详情数据
    SAVE_IDENTITY_INFO(state, data) {
      state.identityInfo = data;
    },
    // 存储用户银行卡列表
    SAVE_BANK_LIST(state, data) {
      state.bankList = data;
    },
    SAVE_MEMBER_ASSETS(state, data) {
      state.memberAssets = data;
    },
    // 清空存储本地的数据
    CLEAR_STORAGE() {
      uni.removeStorageSync("token");
      uni.removeStorageSync("info");
    },
    // 保存网银地址
    SAVE_QR_CODE_URL(state, data) {
      state.qrUrl = data;
    },
    SAVE_GLOBAL_CONFIG(state, data) {
      state.configData = data;
    },
  },
  actions: {
    // 获取未读通知数量
    GET_USER_UNREAD_COUNT({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        const token = uni.getStorageSync("token");
        if (token) {
          unreadMsgCount()
            .then((res) => {
              if (res.code.toString() === "0") {
                commit("SET_USER_UNREAD_COUNT", res.data);
                resolve(res);
              } else {
                reject(res);
              }
            })
            .catch((_) => {
              reject(_);
            });
        }
      });
    },
    // 获取用户详情
    GET_USER_INFO({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        memberInfo()
          .then((res) => {
            if (res.code == 200) {
              storage.set("userInfo", res.data);
              commit('SAVE_USER_INFO', res.data)
              resolve(res.data);
            }
          })
          .catch(() => {
            resolve(false);
          });
      });
    },
    /**
     * 获取认证详情
     * @param dispatch
     * @param commit
     * @returns {Promise<unknown>}
     * @constructor
     */
    GET_IDENTITY_INFO({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        queryIdentityInfo()
          .then((res) => {
            if (res.code.toString() === "0") {
              commit("SAVE_IDENTITY_INFO", res.data);
              resolve(res);
            } else {
              reject(res);
            }
          })
          .catch((_) => {
            reject(_);
          });
      });
    },
    // 获取银行卡列表
    GET_BANK_LIST({ dispatch, commit }) {
      return new Promise((resolve, reject) => {
        getBankList()
          .then((res) => {
            if (res.code.toString() === "0") commit("SAVE_BANK_LIST", res.data);
            resolve(res.data);
          })
          .catch(() => {
            reject();
          });
      });
    },
    /**
     * 获取用户资产
     * @param commit
     * @returns {Promise<unknown>}
     * @constructor
     */
    GET_MEMBER_ASSETS({ commit }) {
      return new Promise((resolve, reject) => {
        const token = uni.getStorageSync("token");
        if (token) {
          getMemberAssets()
            .then((res) => {
              if (res.code.toString() === "0") {
                commit("SAVE_MEMBER_ASSETS", res.data);
                resolve(res);
              }
              reject(res);
            })
            .catch((_) => {
              console.error(_);
              reject(_);
            });
        } else {
          reject();
        }
      });
    },
    // 登出
    LOG_OUT({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        logout()
          .then((res) => {
            if (res.code.toString() === "0") {
              commit("socket/CLOSE_SOCKET", {}, { root: true });
              commit("CLEAR_STORAGE");
              resolve(res);
            } else {
              reject();
            }
          })
          .catch((_) => {
            console.error(_);
            reject();
          });
      });
    },
    // 获取充值地址
    GET_QR_CODE_URL({ commit }) {
      return new Promise((resolve) => {
        getQrCodeUrl().then((res) => {
          if (res.code.toString() === "0") {
            commit("SAVE_QR_CODE_URL", res.message);
          }
        });
      });
    },
    // 获取全局交易配置
    GET_GLOBAL_CONFIG({ commit }) {
      return new Promise((resolve) => {
        getOtcGlobalConfigByType({ searchValue: "app_user" }).then((res) => {
          if (res.code.toString() === "0") {
            commit("SAVE_GLOBAL_CONFIG", res.data);
          }
        });
      });
    },
  },
};
