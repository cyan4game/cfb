<!-- 区号选择 -->
<template>
  <uni-popup ref="popup" type="bottom">
    <view class="area-code-box">
      <view class="title">
        <text>选择国家</text>
        <view class="close" @click="() => $refs.popup.close()"
          ><u-image
            mode="contain"
            src="/static/images/index/close.png"
            width="24rpx"
            height="24rpx"
          ></u-image
        ></view>
      </view>
      <!-- 快捷 -->
      <view class="right-box">
        <view class="t" @click="handclick('aa')">#</view>
        <view @click="handclick(a)" class="a" v-for="a in rights" :key="a">{{
          a
        }}</view>
      </view>
      <!-- 列表 -->
      <scroll-view scroll-y="true" class="list" :scroll-into-view="intoView">
        <!-- 常用 -->
        <view class="subtitle" id="subtitle-aa">常用</view>
        <view class="item" @click="clickItem(item)" v-for="(item, i) in faster" :key="'f' + i">
          <u-image
            :src="item.flag"
            width="58rpx"
            height="44rpx"
            class="flag"
          ></u-image>
          <view class="item-content">
            <view>{{ item.zh }}({{ item.code }})</view>
            <view class="en">{{ item.en }}</view>
          </view>
        </view>
        <!-- 所有 -->
        <view v-for="(item, i) in countryData" @click="clickItem(item)" :key="'i' + i">
          <view
            class="subtitle"
            :id="getTitle(item, i) ? 'subtitle-' + getTitle(item, i) : ''"
            >{{ getTitle(item, i) }}</view
          >
          <view class="item">
            <u-image
              :src="item.flag"
              width="58rpx"
              height="44rpx"
              class="flag"
            ></u-image>
            <view class="item-content">
              <view>{{ item.zh }}({{ item.code }})</view>
              <view class="en">{{ item.en }}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<script>
import countryData from "./countryData.js";
export default {
  data() {
    return {
      intoView: "",
      faster: countryData.filter((item) =>
        ["China", "Philippines"].includes(item.en)
      ),
      countryData: countryData.sort((a, b) => (a.en < b.en ? -1 : 1)),
      rights: [],
    };
  },
  mounted() {
    this.getRight();
  },
  methods: {
    clickItem(item) {
        this.$emit('sure', item)
        this.close()
    },
    handclick(a) {
      this.intoView = "subtitle-" + a;
    },
    // 获取快捷字母
    getRight() {
      this.countryData.forEach((item) => {
        const A = item.en.substr(0, 1);
        if (!this.rights.includes(A)) {
          this.rights.push(A);
        }
      });
    },
    // 获取首字母展示
    getTitle(item, i) {
      if (!this.countryData[i - 1]) return item.en.substr(0, 1);
      const pre = this.countryData[i - 1];
      if (pre.en.substr(0, 1) == item.en.substr(0, 1)) return "";
      return item.en.substr(0, 1);
    },
    // 打开
    open() {
      this.$refs.popup.open();
    },
    // 关闭
    close() {
      this.$refs.popup.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.area-code-box {
  height: 1000rpx;
  width: 100%;
  background-color: #fff;
  border-radius: 6px 6px 0px 0px;
  display: flex;
  flex-direction: column;
  font-weight: 400;
  position: relative;
  .title {
    height: 128rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 50rpx 0 60rpx;
    border-bottom: 1px solid #dfdfdf;
    color: #38363b;
    font-size: 36rpx;

    .close {
      width: 40rpx;
      height: 40rpx;
      background-color: #eeeeee;
      border-radius: 50%;
      color: #888888;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .list {
    flex: 1;
    overflow: hidden;
    box-sizing: border-box;
    padding: 37rpx 28rpx 20rpx 60rpx;
  }
  .subtitle {
    color: #38363b;
    font-size: 30rpx;
    margin-bottom: 36rpx;
  }
  .item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 33rpx;
    .flag {
      margin-right: 30rpx;
    }
    .item-content {
      color: #38363b;
      font-size: 24rpx;
      .en {
        color: #c5c5c5;
        font-size: 25rpx;
      }
    }
  }
  .right-box {
    display: flex;
    flex-direction: column;
    position: absolute;
    align-items: center;
    justify-content: space-between;
    right: 28rpx;
    height: calc(100% - 240rpx);
    top: 170rpx;
    font-size: 22rpx;
    z-index: 99;
    .t {
      background-color: #449367;
      color: #fff;
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
