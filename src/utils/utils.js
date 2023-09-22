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
