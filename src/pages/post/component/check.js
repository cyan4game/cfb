export default {
  data() {
    return {
      rules: {
        amount: [
          {
            required: true,
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              if (!value) {
                callback("请输入金额");
                return false;
              } else {
                if (+value >= 1 && +value <= +this.limit.singleAmount) {
                  const { fee } = this.payFee;
                  if (+value > +fee) {
                    return true;
                  } else {
                    callback(`交易金额不能低于手续费`);
                    return false;
                  }
                } else {
                  callback(`最低1最高${this.limit.singleAmount}`);
                  return false;
                }
              }
            },
            // message: "请输入",
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
        rate: [
          {
            required: true,
            message: "请输入单价",
            // blur和change事件触发检验
            trigger: ["blur", "change"],
          },
        ],
        number: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value) {
                callback("请输入数量");
                return false;
              } else {
                if (this.cryptoRateDTO.isCapped) {
                  if (+value >= (this.cryptoRateDTO.cryptoMin * 1) && +value <= (this.cryptoRateDTO.cryptoMax * 1)) {
                    return true;
                  } else {
                    callback(`限量${this.cryptoRateDTO.cryptoMin}-${this.cryptoRateDTO.cryptoMax}`);
                    return false;
                  }
                }
                
              }
            },
            // blur和change事件触发检验
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    isDisabled() {
      const { amount, number, rate } = this.form;
      const isAmount = +amount <= +this.limit.singleAmount && +amount >= 1;
      let isNumber = null
      if (this.cryptoRateDTO.isCapped) {
        isNumber = +number <= (this.cryptoRateDTO.cryptoMax) && +number >= (this.cryptoRateDTO.cryptoMin * 1);
      } else {
        isNumber = true
      }
      const isRate = +rate;
      const isBank = this.bankInfo.hasOwnProperty("id");
      console.log(isAmount, isNumber, isRate, isBank)
      return !(isAmount && isNumber && isRate && isBank && !this.loading);
    },
  },
};
