const http = uni.$u.http;
import {BASE_ADDRESS} from "../config/api"


// 上传文件
export const _upload = (file, successFunc, errorFunc, finishFunc) => {
  return uni.uploadFile({
    url: BASE_ADDRESS + 'file/upload',
    name: 'file',
    formData: {
      file: file
    },
    success: successFunc,
    fail: errorFunc,
    complete: finishFunc
  })
}

// 请求发送验证短信
export const sendSMS = (data) => {
  return http.post("/verify/sms", data, {
    custom: { toast: true, auth: false },
  });
};
/**
 * 请求发送邮箱验证码
 * @param data
 * @returns {Promise<any>}
 */
export const sendEmailCode = (data) => {
  return http.post("/verify/mail", data, {
    custom: { toast: true, auth: false },
  });
};
// 手机注册登录 
export const phoneRegister = (data) => {
  return http.post("/member/phoneRegister", data, {
    custom: { toast: true, auth: false },
  });
};
// 邮件注册登录  
export const emailRegister = (data) => {
  return http.post("/member/emailRegister", data, {
    custom: { toast: true, auth: false },
  });
};
/**
 * 获取个人信息
 * @returns {Promise<any>}
 */
export const memberInfo = () => {
  return http.get("/member/info", {
    custom: { auth: true, toast: true },
  });
};
// 音效通知设置  
export const soundNotificationSettings = (enabled) => {
  return http.post(`/member/soundNotificationSettings/${enabled}`, null, {
    custom: { toast: true, auth: false },
  });
};
// 退出登录 
export const logout = () => {
  return http.post(`/member/logout`, null, {
    custom: { toast: true, auth: false },
  });
};
// 设置昵称 
export const nicknameSettings = (data) => {
  return http.post("/member/nicknameSettings", data, {
    custom: { toast: true, auth: false },
  });
};
// 头像设置
export const avatarSettings = (data) => {
  return http.post("/member/avatarSettings", data, {
    custom: { toast: true, auth: false },
  });
};
// 消息列表
export const notification = (num=1,size=20,notificationType='') => {
  return http.get(`/notification/page?num=${num}&size=${size}&notificationType=${notificationType}`, {
    custom: { auth: true, toast: true },
  });
};







//  ---------------------------------------------------------------







// console.log(http.get, "http");
// 做市商账号密码登录
export const login = (data) =>
  http.post(`/market/login/login`, data, {
    custom: { toast: true },
  });
// 首次登录重置密码/设置支付密码
export const firstLoginRestPwd = (data) =>
  http.post("/market/login/firstLoginRestPwd", data, {
    custom: { auth: true, toast: true },
  });
// 生成谷歌验证码
export const googleQR = (data) =>
  http.post("/market/login/google/sendgoogle", data, {
    custom: { auth: true, toast: true },
  });
// 绑定谷歌验证并授权
export const googleAuth = (data) =>
  http.post("/market/login/google/googleAuth", data, {
    custom: { auth: true, toast: true },
  });
/**
 * 校验谷歌验证码
 * @param data
 * @returns {Promise<any>}
 */
export const checkGoogle = (data) =>
  http.post("/market/security/checkGoogle", data, {
    custom: { auth: true, toast: true },
  });
/**
 * 修改邮箱
 * @param data
 * @returns {Promise<any>}
 */
export const updateEmail = (data) =>
  http.post("/market/security/updateEmail", data, {
    custom: { auth: true, toast: true },
  });
// 获取币种接口
export const getCurrency = (data) =>
  http.post("/market/otc/getCurrency", data, {
    custom: { auth: true, toast: true },
  });
// 获取交易列表接口
export const getTradeList = (data) =>
  http.post("/market/otc/queryOtcTradeList", data, {
    custom: { toast: true, auth: true },
  });
// 获取汇率接口 /otc/queryExchangeRate
export const getRate = (data) =>
  http.post("/market/otc/queryExchangeRate", data, {
    custom: { auth: true, toast: true },
  });
// 发布交易 /otc/createTrade
export const createTrade = (data) =>
  http.post("/market/otc/createTrade", data, {
    custom: { auth: true, toast: true },
  });
// 获取快捷金额接口 /otc/fastAmount
export const getFastAmount = (data) =>
  http.post("/market/otc/fastAmount", data, {
    custom: { auth: true, toast: true },
  });
// 获取银行卡列表 /payModel/getPayModelList
export const getBankList = (data) =>
  http.post("/market/payModel/getPayModelList", data, {
    custom: { auth: true, toast: true },
  });
// 购买下单前校验 //otc/order/buyBefoerCheck
export const beforeBuyCheck = (data) =>
  http.post("/market/otc/order/buyBeforeCheck", data, {
    custom: { auth: true, toast: true },
  });
// 获取订单详情 /otc/getOtcTradeListeDetails
export const getTradeDetails = (data) => {
  return http.post("/market/otc/getOtcTradeListDetails", data, {
    custom: { auth: true, toast: true },
  });
};
// 购买下单 //otc/order/buy
export const buyNow = (data) => {
  return http.post("/market/otc/order/buy", data, {
    custom: { auth: true, toast: true },
  });
};
// 出售下单前校验 //otc/order/sellBefoerCheck
export const beforeSellCheck = (data) => {
  return http.post("/market/otc/order/sellBeforeCheck", data, {
    custom: { auth: true, toast: true },
  });
};
// 出售下单 //otc/order/sell
export const sellNow = (data) => {
  return http.post("/market//otc/order/sell", data, {
    custom: { auth: true, toast: true },
  });
};
// 新增银行卡 /payModel/savePayModel
export const savePayModel = (data) => {
  return http.post("/market/payModel/savePayModel", data, {
    custom: { auth: true, toast: true },
  });
};
// 获取我的发布记录 /otc/queryOtcTradeListByMemberId
export const queryTrade = (data) => {
  return http.post("/market/otc/queryOtcTradeListByMemberId", data, {
    custom: { auth: true, toast: true },
  });
};
// 获取订单详情 //otc/order/getDetail
export const getDetail = (data) => {
  return http.post("/market//otc/order/getDetail", data, {
    custom: { auth: true, toast: true },
  });
};
// 下架交易 /otc/shoutDownOtcTrade
export const cancelPost = (data) => {
  return http.post("/market/otc/shoutDownOtcTrade", data, {
    custom: { auth: true, toast: true },
  });
};
// 获取我的订单列表 //otc/order/getMyOrders
export const getMyOrders = (data) => {
  return http.post("/market//otc/order/getMyOrders", data, {
    custom: { auth: true, toast: true },
  });
};
// 获取累计取消 //otc/order/getCancelCount
export const getCancelCount = (data) => {
  return http.post("/market//otc/order/getCancelCount", data, {
    custom: { auth: true, toast: true },
  });
};
// 取消订单 //otc/order/cancel
export const orderCancel = (data) => {
  return http.post("/market/otc/order/cancel", data, {
    custom: { auth: true, toast: true },
  });
};
// 确认付款 //otc/order/userPayment
export const payConfirm = (data) => {
  return http.post("/market/otc/order/userPayment", data, {
    custom: { auth: true, toast: true },
  });
};
// 放币 //otc/order/releaseCoins
export const releaseCoins = (data) => {
  return http.post("/market/otc/order/releaseCoins", data, {
    custom: { auth: true, toast: true },
  });
};
// 验证交易密码 security/member/checkTxPassword
export const checkTxPassword = (data) => {
  return http.post("/market/security/member/checkTxPassword", data, {
    custom: { auth: true, toast: true },
  });
};
// 获取申诉详情 //otc/order/getAppealInfo
export const getAppealInfo = (data) => {
  return http.post("/market/otc/order/getAppealInfo", data, {
    custom: { auth: true, toast: true },
  });
};
// 提交申诉 //otc/order/appeal
export const appeal = (data) => {
  return http.post("/market//otc/order/appeal", data, {
    custom: { auth: true, toast: true },
  });
};
// 设置为默认银行卡 /payModel/updateDefaultPayModel
export const updateDefaultPayModel = (data) => {
  return http.post("/market/payModel/updateDefaultPayModel", data, {
    custom: { auth: true, toast: true },
  });
};
// 删除银行卡 /payModel/deletePayModel
export const deletePayModel = (data) => {
  return http.post("/market/payModel/deletePayModel", data, {
    custom: { auth: true, toast: true },
  });
};
// 上传 uploadFile
export const uploadFile = (data) => {
  return http.post("/uploadFile", data, {
    custom: { auth: true, toast: true },
  });
};
/**
 * 获取用户可用USDT币种 /transfer/getMemberTransferInfo
 * @param data
 * @returns {Promise<any>}
 */
export const getMemberTransferInfo = (data) => {
  return http.post("/market/transfer/getMemberTransferInfo", data, {
    custom: { auth: true, toast: true },
  });
};
/**
 * 获取转账币种信息
 * @returns {Promise<any>}
 */
export const getTransferCoinInfo = () => {
  return http.get("/market/transfer/getTransferCoinInfo", {
    custom: { auth: true, toast: true },
  });
};
/**
 * 地址簿 币种列表查询
 * @param data
 * @returns {*}
 */
export const getOtcCoinList = (data) => {
  return http.post("/market/addressBook/otcCoinList", data, {
    custom: { auth: true, toast: true },
  });
};
// 地址簿 获取地址簿列表 addressBook/getAddressBookList
export const getAddressBookList = (data) => {
  return http.post("/market/addressBook/getAddressBookList", data, {
    custom: { auth: true, toast: true },
  });
};
// 新增地址簿 /addressBook/saveAddressBook
export const saveAddressBook = (data) => {
  return http.post("/market/addressBook/saveAddressBook", data, {
    custom: { auth: true, toast: true },
  });
};
// 删除地址簿 /addressBook/deleteAddressBook
export const deleteAddressBook = (data) => {
  return http.post("/market/addressBook/deleteAddressBook", data, {
    custom: { auth: true, toast: true },
  });
};
// 身份证认证状态查询 /identity/queryIdentityInfo
export const queryIdentityInfo = (data) => {
  return http.post("/market/identity/queryIdentityInfo", data, {
    custom: { auth: true, toast: true },
  });
};
// 实名认证 /identity/realIdentity
export const realIdentity = (data) => {
  return http.post("/market/identity/realIdentity", data, {
    custom: { auth: true, toast: true },
  });
};
// 高级认证 /identity/seniorIdentity
export const seniorIdentity = (data) => {
  return http.post("/market/identity/seniorIdentity", data, {
    custom: { auth: true, toast: true },
  });
};
// 获取首页资产明细 /home/getMemberAssets
export const getMemberAssets = (data) => {
  return http.post("/market/home/getMemberAssets", data, {
    custom: { auth: true, toast: true },
  });
};
// 获取账变记录 /home/getFlowPageList
export const getFlowPageList = (data) => {
  return http.post("/market/home/getFlowPageList", data, {
    custom: { auth: true, toast: true },
  });
};
// 帮助中心文章列表 /article/getArticleList
export const getArticleList = (data) => {
  return http.post("/market/article/getArticleList", data, {
    custom: { auth: true, toast: true },
  });
};
// 获取转账手续费以及实际到账 /transfer/getMemberAmountInfo
export const getMemberAmountInfo = (data) => {
  return http.post("/market/transfer/getMemberAmountInfo", data, {
    custom: { auth: true, toast: true },
  });
};
/**
 * 获取转账地址信息
 * @returns {Promise<any>}
 * @param params
 */
export const getAddressInfo = (params) => {
  return http.get("/market/transfer/getAddressInfo", {
    custom: { auth: true, toast: true },
    params,
  });
};
/**
 * 获取订单详情
 * @returns {Promise<any>}
 * @param params
 */
export const getTransferOrderDetail = (params) => {
  return http.get("/market/transfer/getTransferOrderDetail", {
    custom: { auth: true, toast: true },
    params,
  });
};
/**
 * 转账记录列表
 * @returns {Promise<any>}
 * @param data
 */
export const getTransferOrderList = (data) => {
  return http.post("/market/transfer/getTransferOrderList", data, {
    custom: { auth: true, toast: true },
  });
};
/**
 * 收款记录列表
 * @returns {Promise<any>}
 * @param data
 */
export const getMemberReceiveList = (data) => {
  return http.post("/market/transfer/getMemberReceiveList", data, {
    custom: { auth: true, toast: true },
  });
};
// 转账 /transfer/submit
export const transferSubmit = (data) => {
  return http.post("/market/transfer/submit", data, {
    custom: { auth: true, toast: true },
  });
};
// 发送验证码 /login/sms/sendVerificationCode
export const sendVerificationCode = (data) => {
  return http.post("/market/login/sms/sendVerificationCode", data, {
    custom: { auth: true, toast: true },
  });
};
// 验证验证码 /login/sms/checkVerificationCode
export const checkVerificationCode = (data) => {
  return http.post("/market/login/sms/checkVerificationCode", data, {
    custom: { auth: true, toast: true },
  });
};
// 修改手机号 /security/updatePhone
export const updatePhone = (data) => {
  return http.post("/market/security/updatePhone", data, {
    custom: { auth: true, toast: true },
  });
};


// 修改登录密码 security/updateLoginPwd
export const updateLoginPwd = (data) => {
  return http.post("/market/security/updateLoginPwd", data, {
    custom: { auth: true, toast: true },
  });
};
// 首页查询我的代付订单 //otc/order/getMyDispatchOrders
export const getMyDispatchOrders = (data) => {
  return http.post("/market//otc/order/getMyDispatchOrders", data, {
    custom: { auth: true, toast: true },
  });
};
// 安全中心修改支付密码 /security/updateTxPassword
export const updateTxPassword = (data) => {
  return http.post("/market/security/updateTxPassword", data, {
    custom: { auth: true, toast: true },
  });
};
// 客服中心 /market/customer/getCustomerList
export const getCustomerList = (data) => {
  return http.post("/market/customer/getCustomerList", data, {
    custom: { toast: true, auth: true },
  });
};
// //otc/order/getAutoOrderSummary 查询接单摘要
export const getAutoOrderSummary = (data) => {
  return http.get("/market//otc/order/getAutoOrderSummary", {
    ...data,
    custom: { toast: true, auth: true },
  });
};
// //otc/order/getMemberPayModelList 获取银行卡列表
export const getMemberPayModelList = (data) => {
  return http.get("/market//otc/order/getMemberPayModelList", {
    ...data,
    custom: { toast: true, auth: true },
  });
};
// //otc/order/openAutoOrder 开启接单
export const openAutoOrder = (data) => {
  return http.post("/market//otc/order/openAutoOrder ", data, {
    custom: { toast: true, auth: true },
  });
};
// //otc/order/startProcessOrder/
export const startProcessOrder = (data) => {
  return http.get(`/market//otc/order/startProcessOrder/${data.orderSn}`, {
    custom: { toast: true, auth: true },
    // params: data,
    // ...data,
  });
};
// //otc/order/postPaymentVoucher 上传支付凭证
export const postPaymentVoucher = (data) => {
  return http.post("/market//otc/order/postPaymentVoucher", data, {
    custom: { toast: true, auth: true },
  });
};
// /market/otcIncome/getMyPagesList 收益报表
export const getMyPagesList = (data) => {
  return http.post("/market/otcIncome/getMyPagesList", data, {
    custom: { toast: true, auth: true },
  });
};
// transfer/qrcode 收款地址
export const getQrcode = (data) => {
  return http.post("/market/transfer/qrcode", data, {
    custom: { toast: true, auth: true },
  });
};
// updateTxPasswordJudge
export const updateTxPasswordJudge = (data) => {
  return http.post("/market/security/updateTxPasswordJudge", data, {
    custom: { toast: true, auth: true },
  });
};
// /market/eBank/getQrCodeUrl 网银充值地址
export const getQrCodeUrl = (data) => {
  return http.post("/market/eBank/getQrCodeUrl", data, {
    custom: { toast: true, auth: true },
  });
};
// //otc/order/getMemberLimitAmount 获取限制额度
export const getMemberLimitAmount = (data) => {
  return http.get("/market/otc/order/getMemberLimitAmount", {
    custom: { toast: true, auth: true },
  });
};
/**
 * 请求生成图形验证码
 * @returns {string}
 */
export const captcha = () => {
  const r = Math.random().toFixed(3) * 100;
  return "/market/register/captcha?r=" + r;
};


// /register/apply C端用户注册
export const register = (data) => {
  return http.post("/market/register/apply", data, {
    custom: { toast: true, auth: false },
  });
};
// /security/member/getOneById 获取用户信息
export const getOneById = (data) => {
  return http.post("/market/security/member/getOneById", data, {
    custom: { toast: true, auth: true },
  });
};
// /register/verifySMS 请求验证短信
export const verifySMS = (data) => {
  return http.post("/market/security/verifySMS", data, {
    custom: { toast: true },
  });
};
/**
 * 校验邮箱验证码
 * @param data
 * @returns {Promise<any>}
 */
export const verifyEmailCode = (data) => {
  return http.post("/market/security/verifyEmailCode", data, {
    custom: { toast: true },
  });
};
// /identity/initH5FaceIdInfo 初始化人脸比对参数
export const initH5FaceIdInfo = (data) => {
  return http.post("/market/identity/initH5FaceIdInfo", data, {
    custom: { toast: true, auth: true },
  });
};
// /identity/faceIdentity 人脸认证
export const faceIdentity = (data) => {
  return http.post("/market/identity/faceIdentity", data, {
    custom: { toast: true, auth: true },
  });
};
// market/otc/config/getOtcGlobalConfigByType
export const getOtcGlobalConfigByType = (data) => {
  return http.post("/market/otc/config/getOtcGlobalConfigByType", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 获取我的站内信列表
 * @param data
 * @returns {Promise<any>}
 */
export const stationletterList = (data) => {
  return http.post("/market/stationletter/list", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 读取站内信(已读)
 * @param data
 * @returns {Promise<any>}
 */
export const stationletterRead = (data) => {
  return http.post("/market/stationletter/read", data, {
    custom: { toast: false, auth: true },
  });
};
/**
 * 读取站内信(已读)
 * @returns {Promise<any>}
 */
export const stationletterReadAll = () => {
  return http.post(
    "/market/stationletter/readAll",
    {},
    {
      custom: { toast: true, auth: true },
    }
  );
};
/**
 * 删除站内信
 * @param data
 * @returns {Promise<any>}
 */
export const stationletterDelete = (data) => {
  return http.post("/market/stationletter/delete", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 删除推送消息
 * @param data
 * @returns {Promise<any>}
 */
export const pushMsgDelete = (data) => {
  return http.post("/market/pushMsg/delete", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 获取我的推送消息列表
 * @param data
 * @returns {Promise<any>}
 */
export const pushMsgList = (data) => {
  return http.post("/market/pushMsg/list", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 读取推送消息(已读
 * @param data
 * @returns {Promise<any>}
 */
export const pushMsgRead = (data) => {
  return http.post("/market/pushMsg/read", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 读取推送消息-全部已读
 * @returns {Promise<any>}
 */
export const pushMsgReadAll = () => {
  return http.post(
    "/market/pushMsg/readAll",
    {},
    {
      custom: { toast: true, auth: true },
    }
  );
};
/**
 * 获取未读的站内信及推送消息数量
 * @returns {Promise<any>}
 */
export const unreadMsgCount = () => {
  return http.post(
    "/market/pushMsg/unreadMsgCount",
    {},
    {
      custom: { toast: true, auth: true },
    }
  );
};
/**
 * 行情列表
 * @returns {Promise<any>}
 */
export const quotationList = () => {
  return http.post(
    "/market/quotation/list",
    {},
    {
      custom: { toast: true, auth: true },
    }
  );
};
/**
 * 检查二维码地址使用类型
 * @returns {Promise<any>}
 */
export const checkQrAddressType = (data) => {
  return http.post("/market/scanCode/checkQrAddressType", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 检查二维码支付订单
 * @returns {Promise<any>}
 */
export const getScanCodeOrder = (data) => {
  return http.post("/market/scanCode/getScanCodeOrder", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 二维码支付
 * @returns {Promise<any>}
 */
export const scanCodePay = (data) => {
  return http.post("/market/scanCode/scanCodePay", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 二维码支付查询
 * @returns {Promise<any>}
 */
export const scanCodePayOrderQuery = (data) => {
  return http.post("/market/scanCode/scanCodePayOrderQuery", data, {
    custom: { toast: true, auth: true },
  });
};
/**
 * 获取OTC订单信息
 * @returns {Promise<any>}
 */
export const getOtcOrderInfo = () => {
  return http.post(
    "/market/security/member/getOtcOrderInfo",
    {},
    {
      custom: { toast: true, auth: true },
    }
  );
};
/**
 * 获取最新的站内信及推送消息
 * @returns {Promise<any>}
 */
export const pushMsgLatestMsg = () => {
  return http.post(
    "/market/pushMsg/latestMsg",
    {},
    {
      custom: { toast: true, auth: true },
    }
  );
};
/**
 * 系统挂单，快捷入口搜索接口
 * @returns {Promise<any>}
 */
export const queryAdvertiseList = (data) => {
  return http.post(
    "/market/otc/queryAdvertiseList",
    data,
    {
      custom: { toast: true, auth: true },
    }
  );
};
/**
 * 获取系统支持的银行
 * @returns {Promise<any>}
 */
export const queryBankList = () => {
  return http.get("/market/eBank/system/queryBankList", {
    custom: { toast: true, auth: true },
  });
};
/**
 * 系统快捷挂单列表
 * @returns {Promise<any>}
 */
export const querySysAdvertiseList = (params) => {
  return http.get("/market/otc/querySysAdvertiseList", {
    custom: { toast: true, auth: true },
    params
  });
};

/**
 * 用户通过手机验证码更改密码(忘记密码-短信验证码通过后)
 * @param captcha
 * @param internationalCode
 * @param mobilePhone
 * @param email
 * @param password
 * @param confirmPwd
 * @returns {Promise<{code, data, message}>}
 */
export const resetPwdByCaptcha = ({
  captcha,
  internationalCode,
  mobilePhone,
  email,
  password,
  confirmPwd,
}) => {
  return http.post(
    "/market/security/resetPwdByCaptcha",
    { captcha, internationalCode, mobilePhone, email, password, confirmPwd },
    {
      custom: { toast: true },
    }
  );
};
// /otc/order/isPostPaymentVoucher 确认是否需要上传付款凭证
export const getVoucher = () => {
  return http.get("/market/otc/order/isPostPaymentVoucher", {
    custom: { toast: true, auth: true },
  });
};
// /otc/order/postPaymentVoucher 上传订单支付凭证
export const uploadVoucher = (data) => {
  return http.post("/market/otc/order/postPaymentVoucher", data, {
    custom: { toast: true, auth: true },
  });
};
