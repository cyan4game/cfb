<template>
  <u-navbar
    title="支付管理"
    height="55px"
    :titleStyle="{ color: '#fff' }"
    placeholder
    bgColor="#505bde"
  >
    <view class="u-nav-slot" slot="left">
      <u-image
        @click="router({ type: 'back' })"
        :showLoading="true"
        src="/static/icons/back.svg"
        width="24px"
        height="24px"
      ></u-image>
    </view>
    <view class="u-nav-slot" slot="right">
      <u-image
        :showLoading="true"
        src="/static/icons/customer.svg"
        width="24px"
        height="24px"
      ></u-image>
    </view>
  </u-navbar>
</template>

<script>
export default {
  name: "header-nav",
  methods: {
    toMine() {
      this.router({
        url: "pages/mine/index",
        type: "",
      });
    },
  },
};
</script>

<style scoped></style>
