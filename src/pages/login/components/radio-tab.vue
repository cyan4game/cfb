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
      <u-image
        :src="item.key === value ? item.active : item.icon"
        width="24px"
        height="24px"
      ></u-image>
      <text class="flex-label">{{ item.label }}</text>
    </view>
    <div class="bg-shadow" :class="showClass"></div>
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
  background: #fff;
  box-sizing: border-box;
  border-radius: 5px;
  height: 40px;
  border: 1px solid #505bde;
  position: relative;
  box-shadow: 5px 6px 24px 0px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  .bg-shadow {
    width: 50%;
    height: 40px;

    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 1;
    background: #505bde;
    transition: all 0.5s;
  }
  .is-default {
    transform: translateX(0);
  }
  .is-active {
    transform: translateX(100%);
  }
  .title-list {
    width: 50%;
    height: 100%;

    color: #505bde;
    justify-content: center;
    position: relative;
    z-index: 2;
    font-weight: 400;
    transition: all 0.5s;
    .flex-label {
      font-size: 15px;
      margin-left: 5px;
    }
    &-active {
      color: #fff;
    }
  }
}
</style>
