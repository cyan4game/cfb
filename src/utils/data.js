import {
  getToDayStartDate,
  getToDayEndDate,
  getWeekStartDate,
  getWeekEndDate,
  getMonthStartDate,
  getMonthEndDate,
} from "./time"

/**
 * 定义相关静态数据
 */
export const otcType = [
  {
    key: "1",
    name: "我要买",
  },
  {
    key: "0",
    name: "我要卖",
  },
]
/**
 * 定义发布类型字典数据
 * ["全部", "已上架", "已完成", "已下架"]
 */
export const postBar = [
  {name: "全部", key: ""},
  {name: "已上架", key: "0", color: "success"},
  {name: "已下架", key: "1", color: "info"},
  {name: "已完成", key: "3", color: "info"},
]
// 状态 0:已取消 1:未付款 2:已付款 3:已完成 4:申诉中 5:交易失败
export const orderStatus = [
  {name: "全部", key: "", color: ""},
  {name: "已取消", key: "0", color: "warming"},
  {name: "未付款", key: "1", color: "success"},
  {name: "已付款", key: "2", color: "primary"},
  {name: "已完成", key: "3", color: "info"},
  {name: "申诉中", key: "4", color: "warming"},
  {name: "交易失败", key: "5", color: "error"},
]
export const currencyObj = {
  memberHomeBTCBO: "BTC",
  memberHomeETHBO: "ETH",
  memberHomeUSDTBO: "USDT",
  memberHomeTRXBO: "TRX",
  // memberHomeUSDTErcBO: "USDT-ERC",
  // memberHomeUSDTOmniBO: "USDT-OMNI",
  // memberHomeUSDTTrcBO: "USDT-TRC",
}
// CHAIN_OUT, CHAIN_OUT_ERR, CHAIN_IN, CHAIN_GAS, OUT, OUT_ERR, IN, SYS_GAS, ONLINE_IN,
// OTC_IN_DISPATCH, TRANSACT_IN, OTC_IN, OTC_OUT, HANGING_OUT, MANUAL_LOCK, UNLOCK
// 张变类型
export const flowTypeList = [
  // { name: "转出（公链)", key: "CHAIN_OUT", value: 0 },
  // { name: "公链gas", key: "CHAIN_OUT", value: 1 },
  // { name: "转出失败（公链)", key: "CHAIN_OUT_ERR", value: 2 },
  // { name: "收款（公链）", key: "CHAIN_IN", value: 3 },
  // { name: "内部收款 ", key: "CHAIN_GAS", value: 4 },
  // { name: "转出（内部）", key: "OUT", value: 5 },
  // { name: "转出失败（内部）", key: "OUT_ERR", value: 6 },
  // // { name: "收款（内部）", key: "IN", value: 6 },
  // { name: "系统GAS", key: "SYS_GAS", value: 7 },
  // { name: "网银充值", key: "ONLINE_IN", value: 8 },
  // { name: "OTC买入（派单）", key: "OTC_IN_DISPATCH", value: 9 },
  // { name: "交易奖励", key: "TRANSACT_IN", value: 10 },
  // { name: "OTC买入（普通）", key: "OTC_IN", value: 11 },
  // { name: "OTC卖出(普通)", key: "OTC_OUT", value: 12 },
  // { name: "OTC卖出(下发)", key: "OTC_OUT", value: 13 },
  //
  // { name: "挂单出售", key: "HANGING_OUT", value: 14 },
  // { name: "人工锁定", key: "MANUAL_LOCK", value: 15 },
  // { name: "解锁", key: "UNLOCK", value: 16 },
  // { name: "四方支付下发", key: "UNLOCK", value: 17 },
  // { name: "商户充币", key: "UNLOCK", value: 18 },

  {value: "0", name: "公链转出", type: "reduce"},
  {value: "1", name: "公链gas", type: "reduce"},
  {value: "2", name: "公链转出失败", type: "add"},
  {value: "3", name: "公链收款", type: "add"},
  {value: "4", name: "内部收款", type: "add"},
  {value: "5", name: "转出(内部)", type: "reduce"},
  {value: "6", name: "转出失败(内部)", type: "add"},
  {value: "7", name: "系统gas", type: "reduce"},
  {value: "8", name: "网银充值", type: "add"},
  {value: "9", name: "OTC买入(派单) ", type: "add"},
  {value: "10", name: "交易奖励", type: "add"},
  {value: "11", name: "OTC买入(普通) ", type: "add"},
  {value: "12", name: "OTC卖出(普通)", type: "reduce"},
  {value: "13", name: "OTC卖出(下发) ", type: "reduce"},
  {value: "14", name: "挂单出售", type: "keep"},
  {value: "15", name: "人工锁定", type: "keep"},
  {value: "16", name: "解锁", type: "keep"},
  {value: "17", name: "四方支付下发", type: "reduce"},
  {value: "18", name: "商户充币", type: "add"},
  {value: "19", name: "USDT下发", type: "reduce"},
  {value: "20", name: "下发失败", type: "add"},
  {value: "23", name: "人民币下发", type: "reduce"},
  {value: "24", name: "手续费", type: "reduce"},
  {value: "26", name: "收银台收款", type: "add"},
  {value: "27", name: "收银台付款", type: "reduce"},
  {value: "28", name: "API出币", type: "reduce"},
]
// "全部", "当日", "当日", "本月"
export const timeList = [
  {name: "全部", key: "all", start: "", end: ""},
  {
    name: "当日",
    key: "toDay",
    start: getToDayStartDate(),
    end: getToDayEndDate(),
  },
  {
    name: "本周",
    key: "toWeek",
    start: getWeekStartDate(),
    end: getWeekEndDate(),
  },
  {
    name: "本月",
    key: "toMonth",
    start: getMonthStartDate(),
    end: getMonthEndDate(),
  },
]
// Bitcoin、Ethereum、Trx、UsdtErc20、UsdtOmni、UsdtTrc20
export const currencyList = [
  {
    key: "Bitcoin",
    name: "Bitcoin",
  },
  {
    key: "Ethereum",
    name: "Ethereum",
  },
  {
    key: "Trx",
    name: "Trx",
  },
  {
    key: "UsdtErc20",
    name: "UsdtErc20",
  },
  {
    key: "UsdtOmni",
    name: "UsdtOmni",
  },
  {
    key: "UsdtTrc20",
    name: "UsdtTrc20",
  },
]
