import UniSocket from "../../utils/socket";
import { BASE_SOCKET } from "../../config/api";
import audio from "@/static/audio.mp3";
export default {
  namespaced: true,
  state: {
    ws: null,
    innerAudioContext: null,
    isMuted: false,
  },
  actions: {
    INIT_SOCKET({ dispatch, commit }) {
      commit("INIT_SOCKET", { dispatch, commit });
    },
    ACCEPT_MESSAGE({ dispatch, commit }, data) {
      // console.log(data.type, "ACCEPT_MESSAGE");
      // commit("PLAY_MUSIC");
      switch (data.type) {
        case "NOTIFY":
          commit("PLAY_MUSIC");
          uni.showToast({
            title: data.title,
            duration: 2000,
          });
          break;
        case "ORDER_DETAILS":
          commit("PLAY_MUSIC");
          uni.$u.route({
            url: "/pages/tradeDetails/index",
            params: {
              id: data.businessId,
            },
          });
          break;
        case "BILLING_CHANGES":
          uni.$u.route("/pages/index/changeRecord");
          break;
        // case "DISPATCH":
        //   dispatch("order/GET_ORDER_LIST", {}, { root: true });
        //   commit("PLAY_MUSIC");
        //   let pages = getCurrentPages();
        //   let page = pages[pages.length - 1].route;
        //   if (page !== "pages/index/index") {
        //     uni.showModal({
        //       title: "提示",
        //       content: "您有新的派单未完成,请前去支付!",
        //       showCancel: false,
        //       success: (res) => {
        //         if (res.confirm) {
        //           uni.$u.route({
        //             type: "switchTab",
        //             url: "pages/index/index",
        //           });
        //         }
        //       },
        //     });
        //   }
        //   break;
      }
    },
  },
  mutations: {
    // 初始化连接
    INIT_SOCKET(state, { dispatch, commit }) {
      const pushToken = uni.getStorageSync("pushToken");
      if (pushToken) {
        const url = `${BASE_SOCKET}webSocket`;
        const heartData = {
          token: pushToken,
          source: "h5",
        };
        const config = {
          dispatch,
          commit,
          url,
          heartData: JSON.stringify(heartData),
        };
        state.ws = new UniSocket(config);
      }
    },
    CLOSE_SOCKET(state) {
      if (state.ws) state.ws.closeSocket();
    },
    // 播放音乐
    PLAY_MUSIC(state) {
      if (!state.innerAudioContext) {
        state.innerAudioContext = uni.createInnerAudioContext();
        state.innerAudioContext.src = audio;
      }
      if (state.isMuted) state.innerAudioContext.volume = 0;
      state.innerAudioContext.onError((res) => {
        console.log(res.errMsg);
        console.log(res.errCode);
      });
      state.innerAudioContext.play();
    },
    SWITCH_MUTED(state, muted) {
      state.isMuted = muted;
    },
  },
};
