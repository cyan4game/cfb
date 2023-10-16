import { throttle } from "@/utils/debounce";
import { BASE_ADDRESS, PROXY_PRE } from "../config/api";

export function handleLogout() {
  uni.removeStorage({
    key: "token",
  });
  uni.removeStorage({
    key: "pushToken",
  });
  const pages = getCurrentPages(); // 获取栈实例
  const page = pages[pages.length - 1];
  let currentPage = page && page.$page.fullPath; //当前页面路径(带参数)

  // #ifdef H5
  if (!currentPage) {
    currentPage = location.pathname;
  }
  // #endif

  if (
    !currentPage ||
    ![
      "/pages/login/index",
      "/pages/register/index",
      "/pages/retrievePassword/index",
    ].includes(currentPage)
  ) {
    uni.reLaunch({
      url: "/pages/login/index" + (location ? location.search : ''),
    });
  }
}

export const throttleFn = throttle(handleLogout, 500);

if (!uni.getStorageSync("token")) handleLogout();

module.exports = (vm) => {
  // 初始化请求配置
  uni.$u.http.setConfig((config) => {
    /* config 为默认全局配置*/
    // #ifdef APP-PLUS
    config.baseURL = BASE_ADDRESS + PROXY_PRE;
    // #endif
    // #ifdef H5
    config.baseURL = PROXY_PRE;
    // #endif
    return config;
  });

  // 请求拦截
  uni.$u.http.interceptors.request.use(
    (config) => {
      // 可使用async await 做异步操作
      // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
      config.data = config.data || {};
      // 根据custom参数中配置的是否需要token，添加对应的请求头
      if (config?.custom?.auth) {
        // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
        const token = uni.getStorageSync("token");
        if (token) {
          config.header.ugtoken = token;
          config.header.token = token;
          config.header["cfb-app"] = token;
        } else {
          throw new Error("当前token已失效,请重新登录");
        }
      }
      return config;
    },
    (config) => {
      // 可使用async await 做异步操作
      return Promise.reject(config);
    }
  );

  // 响应拦截
  uni.$u.http.interceptors.response.use(
    (response) => {
      /* 对响应成功做点什么 可使用async await 做异步操作*/
      const res = response.data;
      // 自定义参数
      const custom = response.config?.custom;
      if (res.code !== 200) {
        if (Number(res.code) === 1001) {
          uni.reLaunch({
            url: `/pages/ip-limit?ip=${res.data.ip}&address=${res.data.address}`,
          });
        } else {
          // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
          if (custom.toast !== false) {
            uni.showToast({
              title: res.message,
              icon: "none",
              duration: 3000,
            });
          }
          if (res.code === 401) {
            throttleFn();
          }
        }
      }
      return res || {};
    },
    (response) => {
      // 对响应错误做点什么 （statusCode !== 200）
      return Promise.reject(response);
    }
  );
};
