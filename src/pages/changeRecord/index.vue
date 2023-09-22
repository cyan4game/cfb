<template>
  <view class="record-page">
    <timeSelect @getValue="getTime" v-model="time" :list="timeList" />
    <view class="view-content">
      <view class="view-full-scroll">
        <u-list class="full-list" height="100%" @scrolltolower="loadMore">
          <u-list-item v-for="(item, index) in dataList" :key="index">
            <view class="t-box">
              <view class="flex-box-between mb-5">
                <text class="label">{{ returnName(item.type) }}</text>
                <text class="value">{{ item.createTime }}</text>
              </view>

              <view class="item">
                <u-text
                  :color="showType(item.type).class"
                  :text="`${showType(item.type).text || ''} ${item.totalAmount || '0.00'} ${item.coin || ''}`"
                ></u-text>
              </view>
            </view>
          </u-list-item>
          <u-loadmore v-show="dataList.length > 5" :status="loadStatus" />
        </u-list>
      </view>
    </view>
  </view>
</template>

<script>
import timeSelect from "./components/time-select";
import { timeList, flowTypeList } from "../../utils/data";
import { getFlowPageList } from "../../api/api";
import mixins from "./mixins";

export default {
  name: "index",
  components: { timeSelect },
  mixins: [mixins],
  data() {
    return {
      timeList,
      time: "all",
      dataList: [],
      loadStatus: "loadmore",
      form: {
        queryStartDate: "",
        queryEndDate: "",
        pageSize: 20,
        currentPage: 1,
      },
      total: 1,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getTime(val) {
      this.form.currentPage = 1;
      const [start, end] = val;
      this.form.queryStartDate = start;
      this.form.queryEndDate = end;
      this.getData();
    },
    // loadMore() {},
    getData() {
      return new Promise((resolve) => {
        getFlowPageList({ ...this.form }).then((res) => {
          if (res.code.toString() === '0') {
            this.total = +res.data.total;
            this.showList(res.data.rows);
          }
          resolve();
        });
      });
    },
    returnName(type) {
      let name = "";
      try {
        name = flowTypeList.find((item) => item.value == type).name;
      } catch (e) {
        name = "-";
        console.log(e);
      }
      return name;
    },
    showType(type) {
      // const flowTypeList = flowTypeList;
      const list = flowTypeList.find((item) => item.value === type);
      const obj = {
        add: {
          text: "+",
          class: "#63B72E",
        },
        reduce: {
          text: "-",
          class: "#EF3C3C",
        },
        keep: {
          text: "",
          class: "#000",
        },
      };
      let info = {};
      if (list) {
        info = obj[list.type];
      }
      return info;
    },
  },
};
</script>

<style lang="scss" scoped>
.record-page {
  height: 100%;
  display: flex;
  width: 100%;
  flex-direction: column;
  .view-content {
    flex: 1;
    position: relative;
    .view-full-scroll {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      .full-list {
        width: 100%;
        height: 100%;
        overflow-y: scroll;
        padding: 10px;
        box-sizing: border-box;
        .t-box {
          background: #fff;
          padding: 15px 16px;
          border-radius: 5px;
          margin-bottom: 6px;
        }
      }
    }
  }
}
</style>
