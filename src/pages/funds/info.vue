<!-- 交易详情 -->
<template>
  <view class="info-page-bg self-body page-fundsinfo">
    <u-navbar
      :safeAreaInsetTop="false"
      :title="'资金详情'"
      @leftClick="() => $routers.back()"
    />
    <view class="info-page-content content-box">
      <!-- 状态 -->
      <view class="status-box">
        <u-image
          class="status-icon"
          src="@/static/images/funds/status-1.png"
          width="80rpx"
          height="80rpx"
        ></u-image>
        <view class="status-content">
          <view class="status-title">{{ typeMap[info.type] || "" }}成功</view>
          <view>{{ preMap[info.incomeType] || "" }}{{ info.amount }}{{ info.payCoin }}</view>
        </view>
      </view>

      <!-- 详情 -->
      <view class="info-box details">
        <view class="detail">
          <view class="name">数量</view>
          <view class="content"
            >{{ preMap[info.incomeType] || "" }}{{ info.amount
            }}{{ info.payCoin }}</view
          >
        </view>
        <view class="detail">
          <view class="name">手续费</view>
          <view class="content">--</view>
        </view>
        <view class="detail">
          <view class="name">转出地址</view>
          <view class="content">{{ info.payAddress || "--" }}</view>
        </view>
        <view class="detail">
          <view class="name">转入地址</view>
          <view class="content">{{ info.receiveAddress }}</view>
        </view>
        <view class="detail">
          <view class="name">交易哈希</view>
          <view class="content">{{ info.transactionHash }}</view>
        </view>
        <!-- <view class="detail">
                    <view class="name">充币地址</view>
                    <view class="content" @click="copy('复制的内容')">
                        <u-image class="copy-icon" src="@/static/images/funds/copy.png" width="26rpx"
                    height="31rpx"></u-image>
                        <text>{{ info.address }}</text>
                    </view>
                </view> -->
        <view class="detail">
          <view class="name">创建时间</view>
          <view class="content">{{ getTimestr(info.createDate) }}</view>
        </view>
        <view class="detail">
          <view class="name">完成时间</view>
          <view class="content">{{ getTimestr(info.finishDate) }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { copyTxt } from "@/utils/utils";
import { businessDetail } from "@/api/api";
import storage from "@/utils/storage";
import { getTimestr } from "@/utils/time";

const preMap = {
  0: "-",
  1: "+",
};
const typeMap = {
  1: "充币",
  2: "转账",
  3: "闪兑",
  4: "购买",
  5: "出售",
};
export default {
  name: "fundsInfo",
  data() {
    return {
      typeMap,
      preMap,
      info: {}, // 详情
    };
  },
  onLoad() {
    this.getInfoData();
  },
  methods: {
    getTimestr,
    getCoinStr(str) {
      if (str && str.includes("_")) return str.split("_")[0];
      return str;
    },
    // 获取详细数据
    getInfoData() {
      this.info = storage.get("fund-info");
    },
    // 复制
    copy(txt) {
      copyTxt(txt);
      uni.showToast({
        title: "已复制",
        icon: "none",
        duration: 2000,
      });
    },
  },
};
</script>

<style lang="scss">
.page-fundsinfo {
  .content-box {
    .info-box {
      padding: 0 20rpx;
    }

    .title {
      color: #38363b;
      font-size: 40rpx;
      font-weight: bold;
      margin-bottom: 28rpx;
    }

    .info-text {
      color: #38363b;
      font-size: 28rpx;
      margin-bottom: 38rpx;
    }

    .status-box {
      background-color: #f0f0f0;
      border-radius: 10rpx;
      padding: 39rpx 36rpx;
      color: #343635;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 60rpx;

      .status-icon {
        margin-right: 30rpx;
      }

      .status-content {
        flex: 1;

        .status-title {
          color: #1ba27a;
          font-size: 28rpx;
          margin-bottom: 8rpx;
        }
      }
    }
    .details {
      .detail {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        min-height: 50rpx;
        margin-bottom: 20rpx;
        font-size: 26rpx;
        .name {
          color: #7a7a7a;
          margin-right: 90rpx;
        }
        .content {
          flex: 1;
          overflow: hidden;
          word-break: break-all;
          color: #3c3c3c;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          text-align: right;
          .copy-icon {
            position: relative;
            top: 6rpx;
            margin-right: 10rpx;
          }
        }
      }
    }
  }
}
</style>
