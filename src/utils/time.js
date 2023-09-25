/**
 * 获取本周、本月、上月、本季度的开始日期、结束日期
 */
let now = new Date(); // 当前日期
let nowDayOfWeek = now.getDay(); // 今天本周的第几天
let nowDay = now.getDate(); // 当前日
let nowMonth = now.getMonth(); // 当前月
let nowYear = now.getYear(); // 当前年
nowYear += nowYear < 2000 ? 1900 : 0;

let lastMonthDate = new Date(); // 上月日期
lastMonthDate.setDate(1);
lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
let lastYear = lastMonthDate.getYear();
let lastMonth = lastMonthDate.getMonth();

// 格式化日期：yyyy-MM-dd
function formatDate(date, type) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let weekday = date.getDate();

  if (month < 10) {
    month = "0" + month;
  }
  if (weekday < 10) {
    weekday = "0" + weekday;
  }
  return (
    year +
    "-" +
    month +
    "-" +
    weekday +
    " " +
    (type === "start" ? "00:00:00" : "23:59:59")
  );
}

// 获得某月的天数
function getMonthDays(month) {
  let monthStartDate = new Date(nowYear, month, 1);
  let monthEndDate = new Date(nowYear, month + 1, 1);
  let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
  return days;
}

// 获得本季度的开始月份
function getQuarterStartMonth() {
  let quarterStartMonth = 0;
  if (nowMonth < 3) {
    quarterStartMonth = 0;
  }
  if (2 < nowMonth && nowMonth < 6) {
    quarterStartMonth = 3;
  }
  if (5 < nowMonth && nowMonth < 9) {
    quarterStartMonth = 6;
  }
  if (nowMonth > 8) {
    quarterStartMonth = 9;
  }
  return quarterStartMonth;
}
// 获取今日开始时间
export function getToDayStartDate() {
  const stamp1 = new Date(new Date().toLocaleDateString()); //获取当天零点的时间

  let dayDate = new Date(new Date().toLocaleDateString()); //获取当天零点的时间
  return formatDate(dayDate, "start");
}
// 获取今日结束时间
export function getToDayEndDate() {
  const dayDate = new Date(
    +new Date(new Date().toLocaleDateString()) + 24 * 60 * 60 * 1000 - 1
  ); //获取当天23:59:59的时间，+new Date(time)，表示获取时间戳

  return formatDate(dayDate, "end");
}
// 获得本周的开始日期
export function getWeekStartDate() {
  let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1);
  return formatDate(weekStartDate, "start");
}

// 获得本周的结束日期
export function getWeekEndDate() {
  let weekEndDate = new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek));
  return formatDate(weekEndDate, "end");
}

// 获得本月的开始日期
export function getMonthStartDate() {
  let monthStartDate = new Date(nowYear, nowMonth, 1);
  return formatDate(monthStartDate, "start");
}

// 获得本月的结束日期
export function getMonthEndDate() {
  let monthEndDate = new Date(nowYear, nowMonth, getMonthDays(nowMonth));
  return formatDate(monthEndDate, "end");
}

// 获得上月开始时间
export function getLastMonthStartDate() {
  let lastMonthStartDate = new Date(nowYear, lastMonth, 1);
  return formatDate(lastMonthStartDate, "start");
}

// 获得上月结束时间
export function getLastMonthEndDate() {
  let lastMonthEndDate = new Date(nowYear, lastMonth, getMonthDays(lastMonth));
  return formatDate(lastMonthEndDate, "end");
}

// 获得本季度的开始日期
export function getQuarterStartDate() {
  let quarterStartDate = new Date(nowYear, getQuarterStartMonth(), 1);
  return formatDate(quarterStartDate, "start");
}

// 获得本季度的结束日期
export function getQuarterEndDate() {
  let quarterEndMonth = getQuarterStartMonth() + 2;
  let quarterStartDate = new Date(
    nowYear,
    quarterEndMonth,
    getMonthDays(quarterEndMonth)
  );
  return formatDate(quarterStartDate, "end");
}

// 时间转换为 yyyy/mm/dd hh:mm:ss 格式
export function getTimestr(time) {
  if (!time) return "";
  // 获取当前时间
  const currentDate = new Date(time);
  // 获取年、月、日、小时、分钟和秒
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // 月份从0开始，需要加1，并且补0
  const day = String(currentDate.getDate()).padStart(2, "0"); // 补0
  const hours = String(currentDate.getHours()).padStart(2, "0"); // 补0
  const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // 补0
  const seconds = String(currentDate.getSeconds()).padStart(2, "0"); // 补0
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}
