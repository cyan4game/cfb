import { memberInfo } from "@/api/api";
import storage from "./storage";

/* ---------------------- 地址校验 --------------------------- */

export const  isValidTRONAddress = (address) => { // 波场地址校验  trc20
  // 长度检查
  if (address.length !== 34) {
      return false;
  }
  // 字符集检查
  const validChars = /^[A-HJ-NP-Za-km-z0-9]+$/;
  if (!validChars.test(address)) {
      return false;
  }
  // 首字符检查
  if (address[0] !== 'T') {
      return false;
  }
  return true;
}

/* ---------------------- 地址校验结束 --------------------------- */

// 隐藏手机号
export const hiddenPhone = str => {
  return str.substr(0, 3) + '****' + str.substr(str.length - 3, 3)
}
// 隐藏邮箱
export const hiddenEmail = str => {
  return str.substr(0, 1) + '****' + str.split('@')[1]
}
// 隐藏身份证
export const hiddenIden = str => {
  return str.substr(0, 4) + '****' + str.substr(str.length - 4, 4)
}
// 校验身份证号
export const idReg = str => {
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(str)
}
// 校验名字
export const nameReg = str => {
  const reg = /^[\u4e00-\u9fa5.·]{2,20}$/;
  return reg.test(str)
}

// 更新用户信息
export const updatUserInfo = () => {
  return new Promise(resolve => {
    memberInfo().then((res) => {
      if (res.code == 200) {
        storage.set("userInfo", res.data);
        resolve(res.data)
      }
    }).catch(() => {
      resolve(false)
    })
  })
};
// 清除缓存的信息-退出登录
export const clearAllStorage = () => {
  storage.set("userInfo", {});
  storage.set("tokenName", "");
  storage.set("token", "");
  storage.set("LOGIN_INFO", "");
  uni.clearStorageSync()
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

// 秒数转换为分钟
export function secondsToMinutesAndSeconds(seconds) {
  if (typeof seconds !== 'number' || seconds < 0) {
    return 'Invalid input';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  const minutesString = minutes < 10 ? `0${minutes}` : minutes.toString();
  const secondsString = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds.toString();

  return `${minutesString}:${secondsString}`;
}
