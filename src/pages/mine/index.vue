<template>
  <view class="mine-page">
    <notice-navbar :back="false"  title="我的"></notice-navbar>
    <mineHeader ref="mineHeader"/>
    <mineMenu/>
  </view>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar/index";
import mineHeader from "./components/mine-header";
import mineMenu from "./components/mine-menu";
import {mapActions} from "vuex";

export default {
  name: "index",
  components: {noticeNavbar, mineHeader, mineMenu},
  created() {
    this.GET_IDENTITY_INFO();
  },
  onShow(options) {
    this.$nextTick(() => {
      this.$refs.mineHeader.refresh()
    })
  },
  onPullDownRefresh() {
    this.$nextTick(() => {
      this.$refs.mineHeader.refresh()
    })
  },
  methods: {
    ...mapActions("user", ["GET_IDENTITY_INFO"]),
  },
};
</script>

<style lang="scss" scoped>
.mine-page {
  height: 100%;
  overflow-y: scroll;
}
</style>
