// 一些公共的数据配置
import usdtIcon from "@/static/images/index/usdt.png";
import cfbIcon from "@/static/images/index/cfb.png";

import iconAlipay from "@/static/images/mine/icon-alipay.png";
import iconWechat from "@/static/images/mine/icon-wechat.png";
import iconBank from "@/static/images/mine/icon-bank.png";

// 币种图标
export const iconMap = {
  USDT: usdtIcon,
  CFB: cfbIcon,
};

// 币种列表
export const coinList = [
  {
    coin: "USDT",
    name: "USDT",
    chain: "TRC20",
  },
  {
    coin: "CFB",
    name: "CFB",
    chain: "CFB",
  },
];

// 支付方式
export const paywayMap = {
  1: '支付宝',
  2: '微信',
  3: '银行卡'
}
export const payWayIcons = {
  1: iconAlipay,
  2: iconWechat,
  3: iconBank,
}

// 资金明细类型
export const fundTypeMap = { 
  1: "转入",
  2: "转出",
  3: "闪兑",
  4: "购买",
  5: "出售",
};
