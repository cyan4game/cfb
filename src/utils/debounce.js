/**
 * @author django
 * @description 防抖函数
 * @param fn
 * @param wait
 * @return {debounced}
 */
export function debounce(fn, wait) {
  const callback = fn;
  let timerId = null;

  function debounced() {
    // 保存作用域
    const context = this;
    // 保存参数，例如 event 对象
    const args = arguments;

    clearTimeout(timerId);
    timerId = setTimeout(function () {
      callback.apply(context, args);
    }, wait);
  }

  // 返回一个闭包
  return debounced;
}

/**
 * @description 节流函数
 */
export function throttle(func, wait) {
  let timeout;

  return function () {
    const context = this;
    const args = arguments;
    if (!timeout) {
      timeout = setTimeout(() => {
        console.log(999999);
        timeout = null;
        func.apply(context, args);
      }, wait);
    }
  };
}
