<template>
  <view class="time-list flex-box">
    <view
      class="item-list value"
      :class="{ 'is-active': item.key === value }"
      @click="changeTime(item)"
      v-for="(item, index) in list"
      :key="index"
      >
      {{ item.name }}
    </view>
  </view>
</template>

<script>
export default {
  name: "time-select",
  props: {
    list: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
    },
    isTime: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    changeTime(item) {
      this.$emit("input", item.key);
      if (this.isTime) this.$emit("getValue", [item.start, item.end]);
    },
  },
};
</script>

<style lang="scss" scoped>
.time-list {
  padding: 16px 13px;
  white-space: nowrap;
  overflow-x: scroll;
  background: #fff;
  .item-list {
    padding: 5px 10px;
    margin-right: 5px;
    border-radius: 3px;
    &:last-child {
      margin-right: 0;
    }
  }
  .is-active {
    background: #505bde;
    color: #fff;
  }
}
</style>
