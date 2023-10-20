const http = uni.$u.http;
import { BASE_ADDRESS, PROXY_PRE } from "../config/api";

// 上传文件
export const _upload = (file, successFunc, errorFunc, finishFunc) => {
  return uni.uploadFile({
    url: process.env.NODE_ENV === 'development' ? BASE_ADDRESS + PROXY_PRE + "file/upload" : PROXY_PRE + "file/upload",
    name: "file",
    formData: {
      file: file,
    },
    success: successFunc,
    fail: errorFunc,
    complete: finishFunc,
  });
};

// 请求发送验证短信-注册登录
export const sendSMS = (data) => {
  return http.post("/verify/sms", data, {
    custom: { toast: true, auth: false },
  });
};
/**
 * 请求发送邮箱验证码-注册登录
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

// 邮件安全验证码发送
export const mailSecurity = () => {
  return http.post(`/verify/mailSecurity`, null, {
    custom: { toast: true, auth: true },
  });
};
// 短信安全验证码发送
export const smsSecurity = () => {
  return http.post(`/verify/smsSecurity`, null, {
    custom: { toast: true, auth: true },
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
    custom: { toast: true, auth: true },
  });
};
// 退出登录
export const logout = () => {
  return http.post(`/member/logout`, null, {
    custom: { toast: true, auth: true },
  });
};
// 设置昵称
export const nicknameSettings = (data) => {
  return http.post("/member/nicknameSettings", data, {
    custom: { toast: true, auth: true },
  });
};
// 头像设置
export const avatarSettings = (data) => {
  return http.post("/member/avatarSettings", data, {
    custom: { toast: true, auth: true },
  });
};
// 消息列表
export const notification = (num = 1, size = 20, notificationType = "") => {
  return http.get(
    `/notification/page?num=${num}&size=${size}&notificationType=${notificationType}`,
    {
      custom: { auth: true, toast: true },
    }
  );
};
// 添加提现地址
export const addAddress = (data) => {
  return http.post("/member-address/add", data, {
    custom: { toast: true, auth: true },
  });
};
// 编辑提现地址
export const modifyAddress = (data) => {
  return http.post("/member-address/modify", data, {
    custom: { toast: true, auth: true },
  });
};
// 查询提现地址-根据memberId和币种类型
export const queryByMemberAndCoin = (data) => {
  return http.post("/member-address/queryByMember", data, {
    custom: { toast: true, auth: true },
  });
};
// 删除提现地址
export const delAddress = (id) => {
  return http.post(`/member-address/delete/${id}`, null, {
    custom: { toast: true, auth: true },
  });
};
// 查询支付绑定状态信息-根据memberId
export const queryPayBindInfo = () => {
  return http.get(`/memberPayModel/list`, {
    custom: { toast: true, auth: true },
  });
};
// 绑定支付方式
export const memberPaymodelBind = (data) => {
  return http.post(`/member-paymodel/bind`, data, {
    custom: { toast: true, auth: true },
  });
};
// 更新支付方式
export const memberPayModelUpdate = (data) => {
  return http.post(`/memberPayModel/update`, data, {
    custom: { toast: true, auth: true },
  });
};
// 查询支付信息-根据memberId和支付方式
export const queryByMemberAndPaytype = (data) => {
  return http.post(`/member-paymodel/queryByMemberAndPaytype`, data, {
    custom: { toast: true, auth: true },
  });
};
// 新手机绑定
export const phoneBind = (data) => {
  return http.post(`/member-security/phone-bind`, data, {
    custom: { toast: true, auth: true },
  });
};
// 验证旧手机号
export const phoneOld = (data) => {
  return http.post(`/member-security/phone-old`, data, {
    custom: { toast: true, auth: true },
  });
};
// 新邮箱绑定
export const emailBind = (data) => {
  return http.post(`/member-security/email-bind`, data, {
    custom: { toast: true, auth: true },
  });
};
// 验证旧邮箱
export const emailOld = (data) => {
  return http.post(`/member-security/email-old`, data, {
    custom: { toast: true, auth: true },
  });
};
// 查询资金明细(综合查询)
export const financeQuery = (data) => {
  return http.post(`/finance/page`, data, {
    custom: { toast: true, auth: true },
  });
};
// 账单详情
export const businessDetail = (type, businessId) => {
  return http.post(`/finance/businessDetail/${type}/${businessId}`, null, {
    custom: { toast: true, auth: true },
  });
};
// 在线客服-新增留言
export const complaintMessage = (data) => {
  return http.post(`/complaintMessage/add`, data, {
    custom: { toast: true, auth: false },
  });
};
// 支付密码设置
export const paypasswordSet = (data) => {
  return http.post(`/member-security/paypassword-set`, data, {
    custom: { toast: true, auth: true },
  });
};
// 支付密码修改
export const paypasswordModify = (data) => {
  return http.post(`/member-security/paypassword-modify`, data, {
    custom: { toast: true, auth: true },
  });
};
// 添加实名认证
export const certificateAdd = (data) => {
  return http.post(`/member-certificate/add`, data, {
    custom: { auth: true, toast: true },
  });
};
// 基础认证
export const basicCertification = (data) => {
  return http.post(`/memberCertificate/basicCertification`, data, {
    custom: { auth: true, toast: true },
  });
};
// 标准认证
export const standardCertification = (data) => {
  return http.post(`/memberCertificate/standardCertification`, data, {
    custom: { auth: true, toast: true },
  });
};
// 修改实名认证
export const certificateModify = (data) => {
  return http.post(`/member-certificate/modify`, data, {
    custom: { auth: true, toast: true },
  });
};
// 查询实名认证-登录用户
export const certificateQuery = () => {
  return http.get(`/memberCertificate/queryCertification`, {
    custom: { auth: true, toast: true },
  });
};
// 高级认证
export const advancedCertification = (data) => {
  return http.post(`/memberCertificate/advancedCertification`, data, {
    custom: { auth: true, toast: true },
  });
};
// 查询不同认证级别额度
export const queryOtcLimit = (data) => {
  return http.post(`/member-certificate/queryOtcLimit`, data, {
    custom: { auth: true, toast: true },
  });
};
// 提现
export const withdraw = (data) => {
  return http.post(`/withdraw/withdraw`, data, {
    custom: { auth: true, toast: true },
  });
};
// 获取币对兑换信息
export const getCoinPairExchangeInfo = (data) => {
  return http.post(`/coinPair/getCoinPairExchangeInfo`, data, {
    custom: { auth: true, toast: true },
  });
};
// 闪兑
export const toExchange = (data) => {
  return http.post(`/coinPair/toExchange`, data, {
    custom: { auth: true, toast: true },
  });
};
// 获取可转账余额
export const memberWalletList = () => {
  return http.get(`/memberWallet/list`, {
    custom: { auth: true, toast: true },
  });
};
// 发布委托
export const entrustRelease = (data) => {
  return http.post(`/entrust/release`, data, {
    custom: { auth: true, toast: true },
  });
};
// 编辑委托
export const entrustUpdate = (data) => {
  return http.post(`/entrust/update`, data, {
    custom: { auth: true, toast: true },
  });
};
// 查询支付方式列表
export const queryByPaymodelMember = (data) => {
  return http.post(`/member-paymodel/queryByMember`, data, {
    custom: { auth: true, toast: true },
  });
};
// 委托列表
export const entrustPage = (data) => {
  return http.post(`/entrust/page`, data, {
    custom: { auth: true, toast: true },
  });
};
// 取消委托
export const entrustCancel = (id) => {
  return http.get(`/entrust/cancel/${id}`, {
    custom: { auth: true, toast: true },
  });
};
// 申诉
export const appeal = (data) => {
  return http.post(`/appeal/appeal`, data, {
    custom: { auth: true, toast: true },
  });
};
// 获取我的订单
export const pageOtcMyOrder = (data) => {
  return http.post(`/cfbOtcOrder/pageOtcMyOrder`, data, {
    custom: { auth: true, toast: true },
  });
};
// 查询币种钱包地址
export const getWalletAddress = (currency, chain) => {
  return http.get(`/memberWalletAddress/get/${currency}/${chain}`, {
    custom: { auth: true, toast: true },
  });
};
// 创建出售订单
export const cfbOtcOrder = (data) => {
  return http.post(`/cfbOtcOrder`, data, {
    custom: { auth: true, toast: true },
  });
};
// 确认收款
export const confirmCollect = (data) => {
  return http.post(`/cfbOtcOrder/confirmCollect`, data, {
    custom: { auth: true, toast: true, "Content-Type": 'application/x-www-form-urlencoded' },
  });
};
// 取消交易
export const orderCancel = (data) => {
  return http.post(`/cfbOtcOrder/cancel`, data, {
    custom: { auth: true, toast: true, "Content-Type": 'application/x-www-form-urlencoded' },
  });
};
// 确认付款
export const confirmPay = (data) => {
  return http.post(`/cfbOtcOrder/confirmPay`, data, {
    custom: { auth: true, toast: true },
  });
};
// 银行列表
export const bankList = () => {
  return http.get(`/bank/list`, {
    custom: { auth: true, toast: true },
  });
};
// 获取所有可用banner
export const getAllBanner = () => {
  return http.get(`/banner/getAll`, {
    custom: { auth: true, toast: true },
  });
};
// 帮助中心分页列表
export const helpList = (data) => {
  return http.post(`/article/help/page`, data, {
    custom: { auth: true, toast: true },
  });
};
// 个人资产
export const memberAsset = () => {
  return http.get(`/member/asset`, {
    custom: { auth: true, toast: true },
  });
};
// 资金流水分页列表
export const financeList = (data) => {
  return http.post(`/finance/queryPage`, data, {
    custom: { auth: true, toast: true },
  });
};
// 获取提现网络
export const getNetwork = (coin) => {
  return http.get(`/member-address/getNetwork/${coin}`, {
    custom: { auth: true, toast: true },
  });
};
// 人脸认证初始化
export const initFaceVerify = (data) => {
  return http.post(`/memberCertificate/initFaceVerify`, data, {
    custom: { auth: true, toast: true },
  });
};
// 获取人脸认证结果
export const describeFaceVerify = (verifySource) => {
  return http.get(`/memberCertificate/describeFaceVerify/${verifySource}`, {
    custom: { auth: true, toast: false },
  });
};
// 内容分页列表（帮助中心，用户协议）
export const articlePage = (data) => {
  return http.post(`/article/page`, data, {
    custom: { auth: true, toast: true },
  });
};

// 代付固定金额列表(出售时的快捷金额)
export const paymentBehalf = () => {
  return http.get(`/cfbOtcOrder/paymentBehalf`, {
    custom: { auth: true, toast: true },
  });
};
// C端获取快捷购买金额(购买时的快捷金额)
export const quickPayAmount = () => {
  return http.post(`/cfbOtcOrder/quickPayAmount`, null,  {
    custom: { auth: true, toast: true },
  });
};

// 撮合购买订单金额(购买时匹配金额)
export const matchMoney = (data) => {
  return http.post(`/cfbOtcOrder/match`, data,  {
    custom: { auth: true, toast: true },
  });
};
// 确认购买
export const confirmBuyOrder = (data) => {
  return http.post(`/cfbOtcOrder/confirmBuyOrder`, data,  {
    custom: { auth: true, toast: true },
  });
};

// 具体币种信息（获取手续费配置）
export const getCoinConfig = (currency) => {
  return http.get(`/coin/get/${currency}`, {
    custom: { auth: true, toast: true },
  });
};