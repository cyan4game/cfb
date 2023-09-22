<template>
  <view class="filter-ui flex-box">
    <view
      class="flex-box-between menu-list"
      @click="menuClick(item)"
      v-for="(item, index) in menuList"
      :key="index"
    >
      <text class="filter-text">{{ item.active ? item.active : item.label }}</text>
      <u-image
        class="trans-img"
        :class="{ 'trans-form': item.value === current }"
        width="24px"
        src="/static/icons/arrow.svg"
        height="24px"
      ></u-image>
    </view>
    <!-- <view :class="{ 'show-list-active': current }" class="show-list"> </view> -->
    <u-action-sheet
      :show="show"
      :actions="current === 'coin' ? amountActions : sortActions"
      @close="show = false"
      @select="select"
		>
		</u-action-sheet>
  </view>
</template>

<script>
export default {
  name: "filter-component",
  data() {
    return {
      show: false,
      amountActive: '',
      sortActive: '',
      amountActions: [
        { name: '¥0 - 1000', label: '0' },
        { name: '¥1000 - 5000', label: '1' },
        { name: '¥5000 - 1万', label: '2' },
        { name: '¥1万 - 2万', label: '3' },
        { name: '¥2万 - 5万', label: '4' },
        { name: '¥5万以上', label: '5' },
      ],
      sortActions: [
        { name: '数量由少到多', label: '1' },
        { name: '数量由多到少', label: '2' },
        { name: '金额由小到大', label: '3' },
        { name: '金额由大到小', label: '4' },
      ],
      menuList: [
        { label: "挂单金额", value: "coin", active: '' },
        { label: "排序方式", value: "sort", active: '' },
      ],
      current: "",
    };
  },
  methods: {
    select(val) {
      console.log(val)
      if (this.current === 'coin') {
        this.amountActive = val
        this.menuList[0].active = val.name
      } else {
        this.sortActive = val
        this.menuList[1].active = val.name
      }
      this.$emit('changeFilter', { current: this.current, label: val.label })
    },
    menuClick({ value }) {
      this.current = value;
      console.log(value)
      this.$nextTick(() => {
        this.show = true
      })

    },
  },
};
</script>

<style lang="scss" scoped>
.filter-ui {
  height: 36px;
  padding: 3px 0;
  box-sizing: border-box;
  position: relative;
  background: #fff;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
  border-top: 1px solid #f2f2f2;
  // z-index: 900;
  .menu-list {
    width: 50%;
    padding: 0 20px;
    box-sizing: border-box;
    border-right: 1px solid #cccccc;
    &:last-child {
      border-right: none;
    }
  }
  .filter-text {
    font-size: 14px;
    color: #666666;
  }
  .trans-img {
    transform: rotate(0deg);
    transition: all 0.01s;
  }
  .trans-form {
    transform: rotate(180deg);
  }
  .show-list {
    background: #ffffff 0% 0% no-repeat padding-box;
    box-shadow: 0px 3px 6px #00000029;
    padding: 0 20px;
    position: absolute;
    top: 36px;
    left: 0;
    width: 100%;
    overflow: hidden;
    height: 0;
    transition: all 0.3s;
    &-active {
      height: auto;
      padding: 15px 20px;
    }
  }
}
</style>
