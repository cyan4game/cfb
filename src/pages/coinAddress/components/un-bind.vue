<template>
  <view class="un-bind">
    <view class="flex-box address-book">
      <u-image
        width="120px"
        height="120px"
        src="@/static/icons/address-book.svg"
      ></u-image>
    </view>
    <view class="value">您还没有添加地址</view>
  </view>
</template>

<script>
export default {
  name: "un-bind",
};
</script>

<style lang="scss" scoped>
.un-bind {
  height: 100%;
  padding: 60px 20px 0;
  background: #fff;
  box-sizing: border-box;
  text-align: center;
  .address-book {
    justify-content: center;
  }
  .login-button {
    background: #505bde;
    border-color: #505bde;
    margin-top: 60px;
    box-sizing: border-box;
    color: #fff;
  }
}
</style>
