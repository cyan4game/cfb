<template>
  <view>
    <view
      class="help-list flex-box-between"
      v-for="(item, index) in list"
      :key="index"
      @click="pageTo(item)"
    >
      <view class="help-label">{{ item.name }}</view>
      <u-image
        width="24px"
        height="24px"
        src="/static/icons/right.svg"
      ></u-image>
    </view>
  </view>
</template>

<script>
import { getArticleList } from "../../api/api";

export default {
  name: "index",
  data() {
    return {
      list: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getArticleList().then((res) => {
        if (res.code.toString() === '0') {
          this.list = res.data;
        }
      });
    },
    pageTo(item) {
      this.router({
        url: "pages/helpInfo/details",
        params: { name: item.name, id: item.id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.help-list {
  padding: 19px 16px;
  color: #333333;
  border-bottom: 1px solid #f8f8f8;
  background: #ffffff;
  min-height: 100%;
  box-sizing: border-box;

  .help-label {
    font-size: 16px;
  }
}
</style>
