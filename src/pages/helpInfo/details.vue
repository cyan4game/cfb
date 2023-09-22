<template>
  <view class="view-content">
    <u-parse :content="content"></u-parse>
  </view>
</template>

<script>
import { getArticleList } from "../../api/api";

export default {
  data() {
    return {
      id: "",
      list: [],
    };
  },
  onLoad({ name, id }) {
    uni.setNavigationBarTitle({
      title: name ? name : "帮助中心",
    });
    if (id) this.id = id;
  },
  created() {
    this.getList();
  },
  computed: {
    content() {
      try {
        const data = this.list.find((item) => item.id === this.id);
        if (data) return data.content;
      } catch (e) {
        console.log(e);
      }
    },
  },
  methods: {
    getList() {
      getArticleList().then((res) => {
        if (res.code.toString() === '0') {
          this.list = res.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.view-content {
  background: #ffffff;
  padding: 10px;
  min-height: 100%;
  box-sizing: border-box;
}
</style>
