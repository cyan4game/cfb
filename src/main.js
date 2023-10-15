import Vue from "vue";
import App from "./App";
import uView from "uview-ui";
import UTabs from "uview-ui/components/u-tabs/u-tabs";
import store from "@/store";
import { route } from "./utils/utils";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";


// 移除打印信息
try {
  window.console.log = () => {}
  window.console.error = () => {}
} catch {}

dayjs.locale("zh-cn");
dayjs.extend(utc);
dayjs.extend(relativeTime);

UTabs.mounted = function () {
  const that = this;
  setTimeout(function () {
    that.init();
  }, 500);
};

Vue.prototype.$dayjs = dayjs;
Vue.config.productionTip = false;
Vue.use(uView);
// 调用setConfig方法，方法内部会进行对象属性深度合并，可以放心嵌套配置
// 需要在Vue.use(uView)之后执行
uni.$u.setConfig({
  // 修改$u.config对象的属性
  config: {
    // 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
    // unit: 'rpx'
  },
  // 修改$u.props对象的属性
  props: {
    // 修改radio组件的size参数的默认值，相当于执行 uni.$u.props.radio.size = 30
    // radio: {
    //   size: 15
    // }
    // 其他组件属性配置
    // ......
  },
});

App.mpType = "app";
Vue.prototype.$store = store;
Vue.prototype.router = route;
Vue.prototype.$routers = {
  back: () => {
    // #ifdef H5
    const pages = getCurrentPages();
    if (pages.length === 1) {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    } else {
      // #endif
      uni.navigateBack({});
      // #ifdef H5
    }
    // #endif
  },
};

Vue.mixin({
  methods: {
    goHome() {
      uni.reLaunch({
        url: "/pages/index/index",
      });
    },
    goBack() {
      // #ifdef H5
      const pages = getCurrentPages();
      if (pages.length === 1) {
        history.back();
      } else {
        // #endif
        uni.navigateBack({});
        // #ifdef H5
      }
      // #endif
    },
  },
});

Vue.prototype.$uni = uni;

const app = new Vue({
  store,
  ...App,
});
require("@/api/request.js")(app);
app.$mount();
// #ifdef MP
// Vue.mixin({
//   onLoad: function () {
//     wx.hideShareMenu()
//   }
// })
// #endif
