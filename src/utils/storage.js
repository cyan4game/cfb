/**
 * 储存数据到本地
 */

export default {
  // 存储
  set(KEY, DATA) {
    uni.setStorageSync(KEY, DATA);
  },
  // 获取
  get(KEY) {
    let data = null;
    try {
      data = uni.getStorageSync(KEY);
    } catch (e) {
    } finally {
      return data;
    }
  },
  remove(KEY) {
    try {
      uni.removeStorageSync(KEY);
    } catch (e) {
      console.log(e);
    }
  },
};
