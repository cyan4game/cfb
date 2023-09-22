<template>
  <u-sticky style="width: 100%" offsetTop="0" customNavHeight="0">
    <u-navbar
      :title="title"
      :titleStyle="{ color: '#fff' }"
      placeholder
      bgColor="#505bde"
      @leftClick="leftClick"
      :leftIcon="back ? 'arrow-left' : ''"
      leftIconSize="48rpx"
      leftIconColor="#ffffff"
      @rightClick="rightClick"
      :rightText="rightText"
    >
      <view class="u-nav-slot" slot="right" v-if="!rightText">
        <slot name="right" v-if="$slots.right"></slot>
        <view v-else-if="customer" @click="toCustomer">
          <u-image
            :showLoading="true"
            src="/static/icons/customer.svg"
            width="24px"
            height="24px"
          ></u-image>
          <text v-if="totalUnreadCount > 0" class="show-count">{{ totalUnreadCount }}</text>
        </view>
        <view v-else @click="toMessage">
          <u-image
            :showLoading="true"
            src="/static/icons/notice.svg"
            width="24px"
            height="24px"
          ></u-image>
          <text v-if="totalUnreadCount > 0" class="show-count">{{ totalUnreadCount }}</text>
        </view>
      </view>
    </u-navbar>
  </u-sticky>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "index",
  props: {
    title: {
      type: String,
    },
    rightText: {
      type: String,
    },
    back: {
      type: Boolean,
      default: true,
    },
    customer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      count: 0,
    };
  },
  computed: {
    ...mapState('user', ['totalUnreadCount'])
  },
  created() {
    if (!this.rightText) {
      this.refreshCount();
    }
  },
  methods: {
    ...mapActions('user', ['GET_USER_UNREAD_COUNT']),
    refreshCount() {
      this.GET_USER_UNREAD_COUNT()
    },
    toCustomer() {
      uni.navigateTo({
        url: "/pages/customer/meiqia",
      });
    },
    toMessage() {
      uni.navigateTo({
        url: "/pages/message/index",
      });
    },
    rightClick() {
      this.$emit("rightClick");
    },
    leftClick() {
      if (this.back) {
        this.goBack()
      } else this.$emit('leftClick')
    }
  },
};
</script>

<style lang="scss">
::v-deep {
  .u-navbar--fixed {
    //max-width: 500px;
    position: absolute;
  }
}

.u-nav-slot {
  position: relative;

  .show-count {
    position: absolute;
    right: -6px;
    top: -6px;
    background: #ff8000 0% 0% no-repeat padding-box;
    border-radius: 50%;
    color: #fff;
    width: 18px;
    height: 18px;
    font-size: 12px;
    text-align: center;
    line-height: 18px;
  }
}

::v-deep .u-navbar__content__title {
  font-weight: bold;
  font-size: 34rpx;
}

::v-deep .u-navbar__content__right__text {
  font-size: 28rpx;
  color: #ffffff !important;
}

::v-deep .u-navbar__content__left {
  .u-icon__icon {
    //font-weight: bold !important;
  }
}
</style>
