import { memberInfo } from "@/api/api";
import storage from "./storage";

// 更新用户信息
export const updatUserInfo = () => {
  memberInfo().then((res) => {
    if (res.code == 200) {
      storage.set("userInfo", res.data);
    }
  });
};
// 清除缓存的信息-退出登录
export const clearAllStorage = () => {
  storage.set("userInfo", {});
  storage.set("tokenName", "");
  storage.set("token", "");
  storage.set("LOGIN_INFO", "");
};

// 复制
export function copyTxt(txt) {
  txt += "";
  if (txt == "null" || txt == "undefined" || txt == "") {
    return;
  }
  // #ifdef APP-PLUS
  uni.setClipboardData({
    data: txt,
  });
  // #endif
  // #ifdef H5
  if (document.queryCommandSupported("copy")) {
    let textarea = document.createElement("textarea");
    textarea.value = txt;
    textarea.readOnly = "readOnly";
    document.body.appendChild(textarea);
    textarea.select(); // 选中文本内容
    textarea.setSelectionRange(0, txt.length);
    let result = document.execCommand("copy");
    textarea.remove();
  }

  // #endif
}

export const formatTime = (time) => {
  let hours = Math.floor(time / 3600);
  let minute = Math.floor(Math.floor(time % 3600) / 60);
  let second = time % 60;
  hours = hours.toString().length === 1 ? `0${hours}` : hours;
  minute = minute.toString().length === 1 ? `0${minute}` : minute;
  second = second.toString().length === 1 ? `0${second}` : second;
  return hours + ":" + minute + ":" + second;
};
/**
 * @description 判断一个图片是否存在, 注意是异步行为
 * @param url
 * @returns {Promise<unknown>}
 */
export function imageIsExist(url) {
  return new Promise((resolve) => {
    let img = new Image();
    img.src = url;
    img.onload = () => {
      if (img.complete) {
        resolve(true);
        img = null;
      }
    };
    img.onerror = () => {
      resolve(false);
      img = null;
    };
  });
}

/**
 * 路由跳转
 */
export function route(data) {
  if (typeof data === "string") uni.$u.route(data);
  if (typeof data === "object") uni.$u.route({ ...data });
}
