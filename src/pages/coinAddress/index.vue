<!-- 地址管理 -->
<template>
  <view class="info-page-bg page-address-list">
    <scroll-view scroll-y="true" class="info-page-content content-box">
      <!-- 列表 -->
      <uni-swipe-action>
        <!-- 使用插槽 （请自行给定插槽内容宽度）-->
        <uni-swipe-action-item v-for="(item, i) in list" :key="i">
          <view class="item">
            <view class="title">
              <view style="margin-right:20rpx" v-if="item.name">{{ item.name }}</view>
              <view class="type">{{
                item.coin || item.currency + "_" + item.chain
              }}</view>
            </view>
            <view class="address">{{ item.address }}</view>
          </view>
          <template v-slot:right>
            <view class="sa-btns">
              <view class="sa-btn" @click="jumpEdit(item)">编辑</view>
              <view class="sa-btn sa-danger" @click="deleteItem(item)"
                >删除</view
              >
            </view>
          </template>
        </uni-swipe-action-item>
      </uni-swipe-action>

      <!-- 没有数据 -->
      <view class="nodata" v-if="!list.length">
        <u-image
          class="nodata-icon"
          src="@/static/images/mine/null.png"
          width="258rpx"
          height="293rpx"
        ></u-image>
        <view>尚未添加地址</view>
      </view>
    </scroll-view>

    <!-- 添加地址 -->
    <view class="btn" @click="jumpAdd">添加地址</view>

    <!-- 删除弹框 -->
    <confirm-dialog
      :title="'温馨提示'"
      :btn="'确认'"
      :content="'您确定删除此地址吗？'"
      :borderBtn="'取消'"
      :btnHandle="btnHandle"
      ref="deleteDialog"
    />
  </view>
</template>

<script>
import { queryByMemberAndCoin, delAddress } from "@/api/api";
import storage from "@/utils/storage";

export default {
  name: "addressList",
  data() {
    return {
      userInfo: {},
      list: [],

      activeItem: {}, // 当前准备删除的元素
    };
  },
  onShow() {
    this.userInfo = storage.get("userInfo") || {};
    this.getList();
  },
  methods: {
    // 跳转添加
    jumpAdd() {
      uni.navigateTo({
        url: `/pages/coinAddress/item?type=1`,
      });
    },
    // 跳转编辑
    jumpEdit(item) {
      let query = "";
      for (const key in item) {
        query += `${key}=${item[key]}&`;
      }
      uni.navigateTo({
        url: `/pages/coinAddress/item?${query}type=2`,
      });
    },
    // 确认删除
    deleteItem(item) {
      this.activeItem = item;
      this.$refs.deleteDialog.open();
    },
    // 查询地址
    getList() {
      this.list = storage.get("coin_address_list") || [];
      queryByMemberAndCoin().then((res) => {
        if (res.code == 200) {
          this.list = res.data || [];
          storage.set("coin_address_list", this.list);
        }
      });
    },
    // 确认删除
    btnHandle() {
      this.$refs.deleteDialog.close();
      delAddress(this.activeItem.id).then((res) => {
        if (res.code == 200) {
          this.getList();
          uni.showToast({
            title: "已删除",
            icon: "none",
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.page-address-list {
  .content-box {
    color: #757575;
    font-size: 28rpx;
    padding-bottom: 160rpx;

    .item {
      height: 173rpx;
      border-bottom: 1px solid #cecece;
      box-sizing: border-box;
      padding: 0 40rpx;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      .address {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #757575;
        font-size: 24rpx;
        width: 100%;
        margin-top: 10rpx;
      }
      .title {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        color: #454545;
        font-size: 32rpx;
        .type {
          background-color: #f1f1f1;
          height: 54rpx;
          padding: 0 30rpx;
          border-radius: 6rpx;
          display: flex;
          align-items: center;
          color: #449367;
          font-size: 20rpx;
          // margin-left: 20rpx;
        }
      }
    }
    .sa-btns {
      display: flex;
      align-items: center;
      .sa-btn {
        height: 102rpx;
        padding: 0 30rpx;
        color: #454545;
        font-size: 22rpx;
        background-color: #f1f1f1;
        margin-left: 10rpx;
        display: flex;
        align-items: center;
        border-radius: 6rpx;
      }
      .sa-danger {
        background-color: #f84a4a;
        color: #fff;
      }
    }

    .nodata {
      margin: 0 auto;
      text-align: center;
      padding-top: 100rpx;

      .nodata-icon {
        display: inline-block;
        margin-bottom: 40rpx;
      }
    }
  }

  .btn {
    width: 451rpx;
    height: 96rpx;
    background-color: #449367;
    color: #fff;
    border-radius: 6rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    position: fixed;
    left: 50%;
    transform: translateX(-50%);
    bottom: 60rpx;
  }
}
</style>
