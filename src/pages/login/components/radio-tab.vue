<!--
   value传入方法 v-model:value
-->
<template>
  <view class="menu-title flex-box">
    <view
      class="title-list flex-box"
      @click="changeType(item)"
      :class="{ 'title-list-active': item.key === value }"
      v-for="(item, index) in menuList"
      :key="index"
    >
      <!-- <u-image
        :src="item.key === value ? item.active : item.icon"
        width="24px"
        height="24px"
      ></u-image> -->
      <text class="flex-label">{{ item.label }}</text>
    </view>
    <view class="bg-shadow" :class="showClass"></view>
  </view>
</template>

<script>
export default {
  name: "radio-tab",
  props: {
    value: {
      type: [String, Number, null],
      required: true,
    },
    menuList: {
      type: Array,
      required: true,
      default: [
        {
          label: "key",
          key: "value",
        },
      ],
    },
  },
  computed: {
    showClass() {
      const menuList = this.menuList;
      const index = menuList.findIndex((item) => item.key === this.value);
      return index > 0 ? "is-active" : "is-default";
    },
  },
  methods: {
    // 切换 列表类型
    changeType(item) {
      this.$emit("update:value", item.key);
      // state.listType = item.key
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-title {
  background: #f0f0f0;
  box-sizing: border-box;
  height: 110rpx;
  position: relative;
  overflow: hidden;
  font-size: 30rpx;
  color: #343434;
  .bg-shadow {
    width: 50%;
    height: 110rpx;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
    background: #fff;
    transition: all 0.5s;
  }
  .is-default {
    transform: translateX(0);
  }
  .is-active {
    transform: translateX(100%);
  }
  .title-list {
    width: 100%;
    height: 100%;
    justify-content: center;
    position: relative;
    z-index: 2;
    font-weight: 400;
    transition: all 0.5s;
    background-color: #fff;
    .flex-label {
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>
