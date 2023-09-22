<template>
  <view class="page-transfer">
    <view class="page-transfer-top">
      <u-tabs
        lineWidth="80rpx"
        lineHeight="6rpx"
        lineColor="#505bde"
        activeStyle="color: #505bde"
        inactiveStyle="color: #999999"
        :current="currencyIndex"
        :list="currencyList"
        keyName="coinStr"
        @click="onCurrencyClick"
      >
        <view slot="right" style="padding: 0 8rpx" @tap="toTransferRecords">
          <u-icon name="/static/icons/icon-record.svg" size="48rpx"></u-icon>
        </view>
      </u-tabs>
    </view>
    <view class="page-transfer-form">
      <u-form labelWidth="0" class="form" :model="form" ref="form" :rules="rules">
        <u-form-item borderBottom prop="address">
          <view style="width: 100%">
            <u-text color="#505bde" bold text="收款地址"></u-text>
            <view class="page-transfer-form-address-box">
              <u-textarea confirmType="done" clearable v-model="form.address" autoHeight placeholder="请输入收款地址"></u-textarea>
              <view class="page-transfer-form-address-box-actions">
                <u-icon name="/static/icons/icon-address-book.svg" size="48rpx" @click="onInputFormAddressBook"></u-icon>
                <u-icon name="/static/icons/icon-qrcode.svg" size="48rpx" @click="onInputFormQRCode"></u-icon>
              </view>
            </view>
          </view>
        </u-form-item>
        <u-form-item borderBottom prop="amount">
          <view style="width: 100%">
            <u-text color="#505bde" bold text="转账数量"></u-text>
            <u-input clearable v-model="form.amount" placeholder="请输入转账数量">
              <view slot="suffix" style="display: flex;gap: 10rpx;" @click="onInputAll">
                <text style="color: #505bde;">全部</text>
              </view>
            </u-input>
          </view>
        </u-form-item>
        <u-text color="#505bde" :text="balanceStr" lineHeight="60rpx" style="display: block;height: 60rpx" size="24rpx"></u-text>
        <u-form-item borderBottom v-if="showProtocol">
          <view style="width: 100%">
            <u-text color="#505bde" bold text="币种协议"></u-text>
            <view class="page-transfer-top-bottom">
              <view
                :class="{'page-transfer-top-bottom-item': true, 'page-transfer-top-bottom-item-active': currencySubIndex === i}"
                v-for="(v, i) in currency.subTransferCoinInfo"
                :key="i"
                @click="currencySubIndex = i"
              >
                <text class="page-transfer-top-bottom-item-label">{{ v.coinStr.split('_')[1] }}</text>
              </view>
            </view>
          </view>
        </u-form-item>
        <view class="page-transfer-form-row">
          <text class="page-transfer-form-row-label">手续费</text>
          <text class="page-transfer-form-row-value">{{ coinDetails && coinDetails.charge || 0 }} {{ currency && currency.coinStr }}</text>
        </view>
        <view class="page-transfer-form-row">
          <text class="page-transfer-form-row-label">实际到账</text>
          <text class="page-transfer-form-row-value">{{ coinDetails && coinDetails.actualArrival || 0 }} {{ currency && currency.coinStr }}</text>
        </view>
        <u-button :disabled="!isEnabled" :loading="submitting" class="btn-submit" @click="showSubmit" color="#505bde">
          确认转账
        </u-button>
      </u-form>
    </view>
    <u-popup :show="isShowSubmit" @close="isShowSubmit = false" round="10rpx" mode="bottom">
      <view class="page-transfer-submit">
        <view class="page-transfer-submit-title">
          <text class="page-transfer-submit-title-text">确认订单</text>
        </view>
        <view class="page-transfer-submit-row">
          <text class="page-transfer-submit-row-label">转账币种</text>
          <text class="page-transfer-submit-row-value">{{ currency && currency.coinStr || '' }}</text>
        </view>
        <view class="page-transfer-submit-row">
          <text class="page-transfer-submit-row-label">转账数量</text>
          <text class="page-transfer-submit-row-value">{{ form.amount || 0 }}</text>
        </view>
        <view class="page-transfer-submit-row">
          <text class="page-transfer-submit-row-label">转账地址</text>
          <text class="page-transfer-submit-row-value">{{ form.address || '' }}</text>
        </view>
        <view class="page-transfer-submit-row">
          <text class="page-transfer-submit-row-label">手续费</text>
          <text class="page-transfer-submit-row-value">{{ coinDetails && coinDetails.charge || 0 }} {{ currency && currency.coinStr }}</text>
        </view>
        <u-button class="btn-submit" @click="onShowPassword" color="#505bde">
          确认转账
        </u-button>
      </view>
    </u-popup>
    <u-popup :show="isShowPassword" :title="isShowPassword" round="10rpx" mode="center">
      <view class="page-transfer-password">
        <view class="page-transfer-password-title">
          <text class="page-transfer-password-title-text">支付密码</text>
        </view>
        <view class="page-transfer-password-content">
          <password-input v-model="form.password" border="border" placeholder="请输入支付密码"></password-input>
        </view>
        <view class="page-transfer-password-bottom">
          <u-button class="btn-password" type="primary" color="#505bde" plain @click="isShowPassword = false">取消</u-button>
          <u-button class="btn-password" type="primary" color="#505bde" @click="onSubmit">确认转账</u-button>
        </view>
      </view>
    </u-popup>
    <u-picker
      :show="showAddressBook"
      ref="uPicker"
      :loading="loadingAddressBook"
      :columns="addressList"
      @confirm="onSelectAddress"
      keyName="name"
      @cancel="showAddressBook = false"
    ></u-picker>
  </view>
</template>

<script>
import {
  getAddressBookList,
  getAddressInfo,
  getMemberAmountInfo,
  getMemberTransferInfo,
  getTransferCoinInfo,
  transferSubmit
} from "../../api/api";
import PasswordInput from "../../components/password-input/password-input"

// #ifdef H5
import QrcodeDecoder from 'qrcode-decoder/dist'

/**
 * 获取文件地址函数
 * @param file
 * @returns {null}
 */
function getObjectURL(file) {
  let url
  if (window.createObjectURL !== undefined) { // basic
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

/**
 * 解码，输出：中文
 * @param str
 * @returns {string}
 */
function decodeStr(str) {
  let out, i, len, c;
  let char2, char3;
  out = "";
  len = str.length;
  i = 0;
  while (i < len) {
    c = str.charCodeAt(i++);
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += str.charAt(i - 1);
        break;
      case 12:
      case 13:
        // 110x xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
        break;
      case 14:
        // 1110 xxxx 10xx xxxx 10xx xxxx
        char2 = str.charCodeAt(i++);
        char3 = str.charCodeAt(i++);
        out += String.fromCharCode(((c & 0x0F) << 12) |
          ((char2 & 0x3F) << 6) |
          ((char3 & 0x3F) << 0));
        break;
    }
  }
  return out;
}

// #endif

export default {
  components: {
    PasswordInput
  },
  data() {
    return {
      query: {},
      showAddressBook: false,
      loadingAddressBook: false,
      addressList: [],
      isShowPassword: false,
      isShowSubmit: false,
      getFeeTask: NaN,
      checkSystemAddressTask: NaN,
      currencyList: [],
      currencyIndex: 0,
      currencySubIndex: 0,
      submitting: false,
      addressType: undefined,
      coinDetails: null,
      addressError: '',
      form: {
        address: '',
        amount: '',
      }
    }
  },
  computed: {
    showProtocol() {
      if (this.currency && this.currency.subTransferCoinInfo.length > 0) {
        this.addressError = ''
        switch (this.currency.coinStr) {
          case 'USDT':
          case 'USDC':
            if (
              /^m/.test(this.form.address) ||
              /^1[A-z\d]{25,33}$/.test(this.form.address) ||
              /^3[A-z\d]{33}/.test(this.form.address) ||
              /^bc1[A-z\d]{31,}/.test(this.form.address)
            ) {
              // 用户币种选择USDT或USDC，但是输入BTC公链的地址，页面需要纠正用户选择的币种，币种自动修改为BTC，币种协议不显示。
              const btcIndex = this.currencyList.findIndex(v => v.coinStr === 'BTC')
              if (btcIndex > -1) this.currencyIndex = btcIndex
              else {
                this.addressError = 'Omni协议已停止服务，请更换其他协议的地址'
              }
              return false
            } else if (/^T/.test(this.form.address)) {
              // 用户选择USDT或USDC，输入T开头的地址，币种协议不显示，后端默认走TRC20协议
              const currencySubIndex = this.currency.subTransferCoinInfo.findIndex(item => item.coinStr.includes('TRC20'))
              if (currencySubIndex > -1) this.currencySubIndex = currencySubIndex
              return false
            } else if (/^0x/.test(this.form.address)) {
              // 用户选择USDC，输入0x开头的地址，需要显示币种协议
              return this.addressType === 0
            }
            break
          default:
            return false
        }
      } else return false
    },
    balanceStr() {
      if (this.currency && this.currency.walletBalance) {
        return `可转账余额：${parseFloat(this.currency.walletBalance).toLocaleString('en-US')} ${this.currency.coinStr}`
      } else {
        return ''
      }
    },
    isEnabled() {
      return !!this.currency && !!this.form.address && !!this.form.amount && this.addressType !== undefined && this.coinDetails
    },
    currencySub() {
      return this.currency && this.currency.subTransferCoinInfo[this.currencySubIndex]
    },
    currency() {
      return this.currencyList[this.currencyIndex]
    },
    rules() {
      return {
        address: [
          {required: true, message: '请输入收款地址', trigger: ['change', 'blur']},
          {
            validator: (rule, value, callback) => {
              if (this.addressError) {
                callback(this.addressError)
              } else if (this.addressType === 2) {
                callback('转账地址已被拉入黑名单')
              } else {
                callback()
              }
            },
            trigger: ['change', 'blur']
          }
        ],
        amount: [
          {required: true, message: '请输入转账数量', trigger: ['change', 'blur']},
          {
            validator: (rule, value, callback) => {
              value = Number(value)
              if (this.currency && value > Number(this.currency.walletBalance)) {
                callback(new Error('不能大于可转账余额'))
              } else {
                callback()
              }
            },
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  watch: {
    currencyIndex() {
      this.currencySubIndex = 0
      this.addressList = []
      this.form.amount = ''
      this.getFee()
    },
    currencySubIndex() {
      this.form.amount = ''
      this.getFee()
    },
    'form.address'() {
      this.currencySubIndex = 0
      this.addressType = undefined
      this.getFee()
      this.checkSystemAddress()
    },
    'form.amount'() {
      this.getFee()
    }
  },
  created() {
  },
  onLoad(query) {
    this.query = query
    this.init(query)
  },
  methods: {
    showSubmit() {
      if (this.addressType === 2) {
        uni.showModal({
          title: '溫心提示',
          content: `转账地址:${this.form.address}\n已被拉入黑名单\n请删除该地址,重新输入`
        })
      } else {
        this.isShowSubmit = true
      }
    },
    onSelectAddress({indexs, value, values}) {
      this.form.address = value[0].address
      this.showAddressBook = false
    },
    onShowPassword() {
      this.isShowSubmit = false;
      this.showPasswordContent = false;
      this.isShowPassword = true;
    },
    onInputFormAddressBook() {
      // uni.showLoading({
      //   title: '正在获取地址簿...',
      //   mask: true
      // })
      this.loadingAddressBook = true
      getAddressBookList({
        coin: this.currency.coinStr
      }).then(res => {
        // uni.hideLoading()
        this.loadingAddressBook = false
        if (res.code.toString() === '0') {
          if (res.data && res.data.length) {
            this.showAddressBook = true
            this.addressList = [res.data]
          } else {
            this.showAddressBook = false
            uni.showToast({
              title: `您的地址簿中没有${this.currency.coinStr}相关的地址`,
              icon: 'none',
              duration: 2000
            })
          }
        }
      }).catch(_ => {
        console.error(_)
        this.showAddressBook = false
        // uni.hideLoading()
      })
    },
    onInputFormQRCode() {
      this.scanCode().then(code => {
        this.form.address = code
      })
    },
    onInputAll() {
      this.form.amount = parseFloat(this.currency.walletBalance) || ''
    },
    onSubmit() {
      if (this.form.password && /^\d{6}$/.test(this.form.password)) {
        this.isShowPassword = false
        uni.showLoading({
          title: '提交中...',
          mask: true
        });
        transferSubmit({
          address: this.form.address,
          amount: this.form.amount,
          payPassword: this.form.password,
          usdtCoin: this.currencySub ? this.currencySub.coinName : this.currency.coinName
        }).then(res => {
          uni.hideLoading()
          if (res.code.toString() === '0') {
            uni.reLaunch({
              url: '/pages/transfer/success?orderNo=' + res.data
            });
          } else if (!res.message.includes('支付密码')) {
            uni.navigateTo({
              url: '/pages/transfer/error',
              success: () => {
                setTimeout(() => {
                  uni.$emit('transfer-error', {error: res.message})
                }, 300)
              }
            })
          }
        }).catch(_ => {
          console.error(_)
          uni.hideLoading()
        })
      } else {
        uni.showToast({
          title: '请输入6位支付密码',
          icon: 'none',
          position: 'bottom',
          duration: 2000
        });
      }
    },
    onCurrencyClick({index, item}) {
      this.currencyIndex = index
    },
    toTransferRecords() {
      uni.navigateTo({
        url: '/pages/transfer/record'
      })
    },
    async init(query) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      });

      await this.getCurrency()

      const currencyIndex = this.currencyList.indexOf(query)
      if (currencyIndex > -1) this.currencyIndex = currencyIndex
      if (query.address) this.form.address = query.address

      uni.hideLoading()
    },
    /**
     * 获取地址簿
     * @returns {Promise<unknown>}
     */
    getAddressBookList() {
      return new Promise((resolve, reject) => {
        getAddressBookList().then(res => {
          if (res.code.toString() === '0') {
            resolve()
          } else reject()
        }).catch(_ => {
          reject(_)
        })
      })
    },
    /**
     * 获取币种列表
     * @returns {Promise<unknown>}
     */
    getCurrency() {
      return new Promise((resolve, reject) => {
        getTransferCoinInfo().then(res => {
          if (res.code.toString() === '0') {
            let currencyList = JSON.parse(JSON.stringify(res.data))
            currencyList.forEach(item => {
              if (!item.subTransferCoinInfo) item.subTransferCoinInfo = []
            })
            currencyList = currencyList.filter(item => {
              item.subTransferCoinInfo = item.subTransferCoinInfo.filter(v => v.switchStatus)
              return item.switchStatus
            })
            if (currencyList.length) {
              this.currencyList = currencyList
              resolve(res)
            } else {
              reject()
            }
          } else reject()
        }).catch(_ => {
          console.error(_)
          reject(_)
        })
      })
    },
    checkSystemAddress() {
      if (this.checkSystemAddressTask) return
      this.addressType = undefined
      this.checkSystemAddressTask = setTimeout(() => {
        if (this.checkSystemAddressTask) clearTimeout(this.checkSystemAddressTask)
        this.checkSystemAddressTask = NaN
        if (!this.form.address) return
        getAddressInfo({
          address: this.form.address
        }).then((res) => {
          if (res.code.toString() === '0') {
            this.addressType = Number(res.data)
          }
        });
      }, 500)
    },
    getFee() {
      const that = this
      if (that.getFeeTask) return
      that.getFeeTask = setTimeout(() => {
        if (that.getFeeTask) clearTimeout(that.getFeeTask)
        that.getFeeTask = NaN
        that.coinDetails = null
        if (isNaN(Number(that.form.amount)) || Number(that.form.amount) <= 0 || !that.currency || !that.form.address) return
        const params = {
          address: that.form.address.replace(/(^\s*|\s*$)/g, ""),
          amount: that.form.amount,
          usdtCoin: that.currencySub ? that.currencySub.coinName : that.currency.coinName,
        };
        getMemberAmountInfo(params).then((res) => {
          if (res.code.toString() === '0') {
            that.coinDetails = res.data;
          }
        });
      }, 500)
    },
    getValue() {
      if (!this.model.address) return;
      this.throttle();
    },
    scanCode() {
      return new Promise((resolve, reject) => {
        // #ifndef H5
        this.scanCodeApp(resolve, reject)
        // #endif
        // #ifdef H5
        this.scanCodeH5(resolve, reject)
        // #endif
      })
    },
    // #ifndef H5
    scanCodeApp(resolve, reject) {
      uni.scanCode({
        scanType: ['qrCode'],
        success: (res) => {
          console.error(JSON.stringify(res))
          if (res.result) {
            resolve(res.result)
          }
        },
        fail: (e) => {
          console.error(JSON.stringify(e))
        }
      })
    },
    // #endif
    // #ifdef H5
    scanCodeH5(resolve, reject) {
      uni.chooseImage({
        count: 1,
        success: imgRes => {
          const qr = new QrcodeDecoder();
          qr.decodeFromImage(getObjectURL(imgRes.tempFiles[0])).then((res) => {
            resolve(res.data)
          })
        }
      })
    },
    // #endif
  },
};
</script>

<style lang="scss">
::v-deep .u-border {
  padding-left: 0 !important;
  padding-right: 0 !important;
}

.page-transfer {
  min-height: 100%;
  background-color: #ffffff;

  &-top {
    background-color: #ffffff;
    min-height: 94rpx;

    &-bottom {
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0 14rpx;

      &-item {
        height: 60rpx;
        width: 130rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        &-label {
          color: #999999;
          font-size: 28rpx;
        }
      }

      &-item-active {
        background-color: #505bde;
        border-radius: 6rpx;

        .page-transfer-top-bottom-item-label {
          color: #ffffff;
        }
      }
    }
  }

  &-form {
    flex: 1;
    background-color: #ffffff;
    border-top: 12rpx solid #f8f8f8;
    padding: 40rpx;

    &-address-box {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;

      &-actions {
        display: flex;
        gap: 10rpx;
        padding-top: 20rpx;
      }
    }

    &-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 40rpx;
      margin-top: 20rpx;

      &-label {
        color: #333333;
        font-size: 28rpx;
        font-weight: 700;
      }

      &-value {
        color: #666666;
        font-size: 28rpx;
      }
    }
  }
}

.btn-submit {
  margin-top: 80rpx;
}

.page-transfer-submit {
  padding: 48rpx 40rpx;

  &-title {
    text-align: center;

    &-text {
      font-size: 32rpx;
      color: #333333;
      font-weight: bold;
    }
  }

  &-row {
    margin-top: 40rpx;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;

    &-label {
      font-size: 28rpx;
      color: #333333;
      font-weight: bold;
    }

    &-value {
      font-size: 28rpx;
      color: #666666;
      flex: 1;
      padding-left: 20rpx;
      text-align: right;
      word-break: break-all;
    }
  }
}

.page-transfer-password {
  width: 650rpx;
  height: 384rpx;

  &-title {
    height: 100rpx;
    background-color: #505bde;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: 10rpx;
    border-top-right-radius: 10rpx;

    &-text {
      font-size: 34rpx;
      color: #ffffff;
      font-weight: bold;
    }
  }

  &-content {
    height: 172rpx;
    padding: 32rpx;
    box-sizing: border-box;

    ::v-deep .u-input {
      border: 1px solid #dddddd;
      border-radius: 10rpx;
    }
  }

  &-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 80rpx;

    .btn-password {
      width: 280rpx;
      height: 80rpx;
    }
  }
}
</style>
