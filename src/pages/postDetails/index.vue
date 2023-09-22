<template>
  <view class="trade-details">
    <view class="trade-view">
      <view class="flex-box-between mb-10">
        <text class="t-label">挂单编号</text>
        <text class="fs-14 t-value">{{ item.advertiseNo }}</text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">发布类型</text>
        <text class="fs-14 t-value">
          {{ Number(item.advertiseType) === 1 ? "购买" : "出售" }} {{ item.coinUnit }}
        </text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">发布时间</text>
        <text class="fs-14 t-value">{{ item.createTime }}</text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">挂单数量</text>
        <text class="fs-14 t-value">{{ item.number }} {{ item.coinUnit }}</text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">挂单金额</text>
        <text class="fs-14 t-value">¥ {{ item.amount }}</text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">交易限额</text>
        <text class="fs-14 t-value">
          ¥ {{ +item.minNumber }} - {{ +item.maxNumber }} {{ item.coinUnit }}
        </text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">完成度</text>
        <text class="fs-14 t-value"
          >{{ ((item.finishAmount / item.amount) * 100).toFixed(2) }}%</text
        >
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">状态</text>
        <text class="fs-14 t-value">{{ returnStatus2(item.status) }}</text>
      </view>
      <!-- <view class="flex-box-between mb-10">
        <text class="t-label">交易ID</text>
        <text class="fs-14 t-value">{{ item.tradeId }}</text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">订单号</text>
        <text class="fs-14 t-value">{{ item.advertiseNo }}</text>
      </view>
      <view class="flex-box-between mb-10">
        <text class="t-label">交易金额</text>
        <text class="fs-14 error">￥ {{ item.amount }}</text>
      </view> -->
      <view class="flex-box-between">
        <view></view>
        <!--         v-if="item.status === '0' && item.isCreateOrder !== '1'"-->
        <view
          v-if="item.status === '1'"
          @click="tipsShow = true"
          class="custom-button flex-box"
          >下架</view
        >
      </view>
      <view class="order-list">
        <u-row
          style="margin-bottom: 10px"
          @click="page(e.orderSn)"
          v-for="(e, i) in item.orderList"
          :key="i"
        >
          <u-col class="flex-box" span="8">
            <u-row>
              <u-col span="3"><u-text text="订单"></u-text></u-col>
              <u-col span="9"
                ><u-text color="#3375f6" :text="e.orderSn"></u-text
              ></u-col>
            </u-row>
          </u-col>
          <u-col span="4">
            <u-text
              align="right"
              :type="returnStatus3(e.status).info"
              suffixIcon="arrow-right-double"
              :text="returnStatus3(e.status).name"
            ></u-text>
          </u-col>
        </u-row>
      </view>
    </view>
    <custom-modal
      :show.sync="tipsShow"
      title="下架"
      message="您确认要取消您的发布？"
      cancelText="我再想想"
      confirmText="确认下架"
      :confirm="handleCancel"
      isCenter
    />
    <u-notify ref="uNotify" message="Hi uView"></u-notify>
  </view>
</template>

<script>
import { getTradeDetails, cancelPost } from "../../api/api";
import { postBar } from "../../utils/data";
import customModal from "@/components/custom-modal/index.vue";

export default {
  name: "index",
  components: { customModal },
  onPullDownRefresh() {
    this.getTradeDetails();
    // setTimeout(() => {

    // }, 1000);
  },
  onLoad({ id }) {
    if (id) this.advertiseNo = id;
    this.getTradeDetails();
  },
  data() {
    return {
      postBar,
      advertiseNo: "",
      item: {},
      tipsShow: false,
    };
  },

  methods: {
    page(orderSn) {
      this.router({
        url: "pages/tradeDetails/index",
        params: {
          id: orderSn,
        },
      });
    },
    returnStatus3(type) {
      switch (type) {
        case "0":
          return { name: "已取消", type: "warning" };
        case "1":
          return { name: "未付款", type: "primary" };
        case "2":
          return { name: "已付款", type: "success" };
        case "3":
          return { name: "已完成", type: "success" };
        case "4":
          return { name: "申诉中", type: "warning" };
        case "5":
          return { name: "交易失败", type: "error" };
      }
    },
    returnStatus2(type) {
      // 0已取消 1未付款 2已付款 3已完成 4申诉中 5交易失败
      switch (type) {
        case "0":
          return "已上架";
        case "1":
          return "已下架";
        case "2":
          return "已删除";
        case "3":
          return "已完成";
      }
    },
    returnStatus(list, status) {
      return list.find((item) => item.key === status);
    },
    returnName(status) {
      return postBar.find((item) => item.key === status);
    },
    getTradeDetails() {
      getTradeDetails({ advertiseNo: this.advertiseNo }).then((res) => {
        if (res.code.toString() === '0') {
          // console.table(res.data)
          this.item = res.data;
        }
        uni.stopPullDownRefresh();
      });
    },
    // 下架
    handleCancel() {
      cancelPost({ advertiseId: this.item.id, shoutDownSource: 0 }).then(
        (res) => {
          if (res.code.toString() === '0') {
            this.showToast({
              type: "success",
              message: "下架成功",
              duration: 1000,
            });
            this.getTradeDetails();
          }
        }
      );
      this.tipsShow = false;
    },
    showToast(params) {
      this.$refs.uNotify.show({
        ...params,
        complete() {
          params.url &&
            uni.navigateTo({
              url: params.url,
            });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.trade-details {
  height: 100%;
  .order-list {
    padding: 30px 0 0 0;
  }
  .trade-view {
    background: #fff;
    padding: 15px 20px;
  }
  .t-label {
    font-size: 14px;
    color: #333333;
  }
  .t-value {
    color: #666;
  }
  .fs-14 {
    font-size: 14px;
  }
  .custom-button {
    background: #0277ff;
    border-color: #0277ff;
    width: 64px;
    height: 30px;
    color: #fff;
    border-radius: 5px;
    justify-content: center;
    font-size: 14px;
  }
}
</style>
