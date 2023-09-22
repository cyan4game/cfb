<template>
  <view class="appeal-info-page">
    <view class="appeal-list" v-if="appealInfo.appeal">
      <view class="appeal-list-page">
        <view
          class="list-item"
          v-for="(item, i) in appealInfo.appeal.contentJson"
          :key="i"
        >
          <!--      v-if="!showMySelf(item)"-->
          <view class="is-left" v-if="!showMySelf(item)">
            <view class="flex-box show-start">
              <view class="show-category" style="margin-right: 10px">
                {{ appealInfo.advertiseType.toString() === "1" ? "卖" : "买" }}
              </view>
              <view>
                <view class="show-time">{{ item.createTime }}</view>
                <view class="left-text show-remark">
                  {{ item.remark }}
                </view>
                <view class="flex-box show-img">
                  <u-image
                    class="mr-5"
                    width="80px"
                    height="80px"
                    :src="item"
                    v-for="(item, k) in item.imgUrls.split(',')"
                    :key="k"
                    alt=""
                  ></u-image>
                </view>
              </view>
            </view>
          </view>
          <!--      v-if="showMySelf(item)"-->
          <view class="is-right" v-if="showMySelf(item)">
            <view class="flex-box show-start is-right-title">
              <view>
                <view class="show-time" style="text-align: right">{{
                  item.createTime
                }}</view>
                <view class="left-text show-remark" style="text-align: right">
                  {{ item.remark }}
                </view>
                <view class="flex-box show-img img-right">
                  <u-image
                    width="80px"
                    height="80px"
                    class="ml-5"
                    :src="item"
                    v-for="(item, k) in item.imgUrls.split(',')"
                    :key="k"
                    alt=""
                  ></u-image>
                </view>
              </view>

              <view class="show-category" style="margin-left: 10px">我</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="show-button" v-if="appealInfo.status === '4'">
      <u-button @click="pageTo" class="appeal-button">
        {{ appealInfo.advertiseType.toString() === "0" ? "提交申诉" : "继续申诉" }}
      </u-button>
    </view>
  </view>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "appeal-info",
  props: {
    appealInfo: {
      type: Object,
      default: {},
    },
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
  },
  methods: {
    showMySelf(item) {
      return this.userInfo.userInfo.id === item.memberId;
    },
    pageTo() {
      this.router({
        url: "pages/appeal/index",
        params: {
          id: this.appealInfo.orderSn,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.appeal-info-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.appeal-list {
  background: #fff;
  position: relative;
  flex: 1;
  &-page {
    padding: 15px 20px;
    box-sizing: border-box;
    position: absolute;
    overflow-y: scroll;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .list-item {
    margin-bottom: 15px;
  }
  .show-category {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0277ff;
    color: #fff;
  }
  .left-text {
    padding-left: 55px;
  }
  .show-start {
    align-items: flex-start;
  }
  .is-right {
    margin-left: auto;
    &-title {
      justify-content: flex-end;
    }
  }
  .show-remark {
    font-size: 14px;
    color: #333;
    padding: 10px;
    background: #f8f8f8 0% 0% no-repeat padding-box;
    border-radius: 5px;
    margin-top: 10px;
    max-width: 250px;
    white-space: normal;
    word-break: break-all;
  }
  .show-img {
    margin-top: 15px;
    img {
      max-width: 300px;
      margin: 0 10px;
    }
  }
  .img-right {
    justify-content: flex-end;
    margin-left: 5px;
  }
  .show-time {
    font-size: 12px;
    color: #333;
  }
}
.show-button {
  padding: 20px;
  margin-top: 6px;
  background: #fff;
  .appeal-button {
    background: #505bde;
    border-color: #505bde;
    color: #fff;
  }
}
</style>
