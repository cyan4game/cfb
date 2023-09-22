export default {
  data() {
    return {
      isLoad: false,
    };
  },
  async onPullDownRefresh() {
    this.form.currentPage = 1;
    await this.getData();
    // setTimeout(() => {
    uni.stopPullDownRefresh();
    // }, 1000);
  },
  methods: {
    // 加载更多
    async loadMore() {
      if (this.dataList.length >= this.total) {
        this.loadStatus = "nomore";
      } else {
        this.isLoad = true;
        this.form.currentPage++;
        this.loadStatus = "loading";
        await this.getData();
        if (this.dataList.length >= this.total) this.loadStatus = "nomore";
        else this.loadStatus = "loadmore";
      }
    },
    showList(list) {
      if (this.isLoad) {
        this.dataList = this.dataList.concat(list);
      } else this.dataList = list;
      this.isLoad = false;
    },
  },
};
