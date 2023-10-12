<!-- 委托详情 -->
<template>
  <view class="info-page-bg self-body page-entrust-info">
    <u-navbar :safeAreaInsetTop="false" :title="'委托详情'" @leftClick="() => $routers.back()" />
    <view class="info-page-content content-box">
      <view class="title">{{ stateMap[info.state] || "--" }}</view>
      <view class="info">
        <text>创建时间</text>
        <text class="time">{{ getTimestr(info.createDate) }}</text>
      </view>

      <view class="item">
        <text>委托人</text>
        <text class="val">{{ info.realName }}</text>
      </view>
      <view class="item">
        <text>委托类型</text>
        <text class="val">{{ info.type == 2 ? "出售" : "购买" }}</text>
      </view>
      <view class="item">
        <text>数量</text>
        <text class="val">{{ info.entrustAmount }}</text>
      </view>
      <view class="item">
        <text>币种</text>
        <text class="val">{{ info.currency }}</text>
      </view>
      <view class="item">
        <text>参考汇率</text>
        <text class="val">￥{{ info.referenceRate }}</text>
      </view>
      <view class="item">
        <text>预估成交金额</text>
        <text class="val"
          >￥{{ (info.entrustAmount * info.referenceRate).toFixed(2) }}</text
        >
      </view>
      <view class="item">
        <text>结束时间</text>
        <text class="val">{{ info.endTime }}天</text>
      </view>

      <view class="line"></view>

      <!-- 卖出 -->
      <template v-if="info.type == 2">
        <view class="item">
          <text>收款账号</text>
          <view class="val">
            <text>{{ info.accountName }}</text>
            <u-image
              @click="copy(info.accountName)"
              style="margin-left: 30rpx"
              src="/static/images/mine/copy.png"
              width="26rpx"
              height="31rpx"
            ></u-image>
          </view>
        </view>
        <view class="item">
          <text>收款方式</text>
          <text class="val">{{ paywayMap[info.payType] }}</text>
        </view>
      </template>
      <!-- 银行卡 -->
      <template v-if="info.payType == 3">
        <view class="item">
          <text>收款银行</text>
          <text class="val">{{ info.bankName }}</text>
        </view>
        <view class="item">
          <text>收款银行分行</text>
          <text class="val">{{ info.branchName }}</text>
        </view>
      </template>

      <view class="btns">
        <!-- 发布中 -->
        <template v-if="info.state == 0">
          <view class="btn" @click="() => $refs.cancelBox.open()"
            >取消委托</view
          >
          <view class="submit" @click="rePost(false)">编辑</view>
        </template>
        <!-- 交易中 -->
        <template v-if="info.state == 1">
          <view class="btn">查看收款信息</view>
          <view class="submit">确认付款</view>
        </template>
        <!-- 已关闭-配对成功 -->
        <template v-if="info.state == -1">
          <view class="btn">查看订单</view>
          <view class="submit" @click="rePost(true)">再次下单</view>
        </template>
        <!-- 已关闭-未配对成功 -->
        <template v-if="info.state == 2">
          <view class="submit" @click="rePost(true)">重新发布</view>
        </template>
      </view>
    </view>

    <!-- 取消委托弹窗 -->
    <confirm-dialog
      ref="cancelBox"
      :title="'取消委托'"
      :content="'确认取消该委托吗？'"
      :borderBtn="'不取消'"
      :btn="'取消委托'"
      :btnHandle="cancel"
    ></confirm-dialog>
  </view>
</template>

<script>
import { entrustPage, entrustCancel } from "@/api/api";
import { getTimestr } from "@/utils/time";
import { copyTxt } from "@/utils/utils";

// 状态：-1关闭,0发布中,1交易中，2完成
const stateMap = {
  "-1": "关闭",
  0: "发布中",
  1: "交易中",
  2: "完成",
};

const paywayMap = {
  1: "支付宝",
  2: "微信",
  3: "银行卡",
};

export default {
  name: "entrust",
  data() {
    return {
      paywayMap,
      stateMap,
      id: "",
      info: {},
    };
  },
  onLoad(data) {
    this.id = data.id;
  },
  onShow() {
    setTimeout(() => {
      this.getInfo();
    }, 200);
  },
  methods: {
    getTimestr,
    copy(txt) {
      copyTxt(txt);
      uni.showToast({
        title: "复制成功",
        icon: "none",
        duration: 2000,
      });
    },
    // 获取详情
    getInfo() {
      entrustPage({
        id: this.id,
      }).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.list && res.data.list[0]) {
            this.info = res.data.list[0];
          }
        }
      });
    },
    // 取消委托
    cancel() {
      this.$refs.cancelBox.close();
      entrustCancel(this.id).then((res) => {
        if (res.code == 200) {
          uni.showToast({
            title: "委托已取消",
            duration: 2000,
            icon: "none",
          });
          setTimeout(() => {
            uni.navigateBack();
          }, 600);
        }
      });
    },
    // 重新发布
    rePost(newP = false) {
      // new为true时是发布新委托，不传id过去
      const params = JSON.parse(
        JSON.stringify(this.info, [
          "currency",
          "paymodelId",
          "entrustAmount",
          "estimatedAmount",
          "referenceRate",
          "endTime",
          "type",
        ])
      );
      if (!newP) params.id = this.info.id;
      let str = "";
      for (let key in params) {
        str += `${key}=${params[key]}&`;
      }
      str = str.substr(0, str.length - 1);
      uni.navigateTo({
        url: "/pages/entrust/post?" + str,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.page-entrust-info {
  .content-box {
    overflow: auto;
    font-weight: 400;
  }
  .title {
    color: #38363b;
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 44rpx;
    padding-left: 20rpx;
  }
  .info {
    height: 120rpx;
    border-radius: 10rpx;
    background-color: #f0f0f0;
    color: #343635;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 0 42rpx 0 36rpx;
    margin-bottom: 17rpx;
    .time {
      font-size: 24rpx;
    }
  }
  .item {
    display: flex;
    color: #7a7a7a;
    font-size: 26rpx;
    align-items: center;
    justify-content: space-between;
    height: 80rpx;
    .val {
      color: #3c3c3c;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
  .line {
    width: 100%;
    height: 1px;
    background-color: #f1f1f1;
    margin: 40rpx 0;
  }
  .btns {
    margin: 80rpx 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .btn {
    box-sizing: border-box;
    height: 96rpx;
    flex: 1;
    margin-right: 30rpx;
    border: 1px solid #38363b;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #38363b;
    font-size: 32rpx;
    border-radius: 6rpx;
  }
  .submit {
    box-sizing: border-box;
    border-radius: 6rpx;
    flex: 2;
    height: 96rpx;
    background-color: #449367;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 32rpx;
  }
}
</style>
