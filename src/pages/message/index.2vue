<template>
  <view class="page">
    <u-sticky offsetTop="0" customNavHeight="0">
      <notice-navbar back title="通知" rightText="全部已读" @rightClick="onReadAll"></notice-navbar>
      <view class="page-top">
        <view class="page-tab">
          <u-subsection
            :class="'page-tab-' + tabIndex + (stationLetterCount > 0 ? ' page-tab-dot-0' : '') + (pushMsgCount > 0 ? ' page-tab-dot-1' : '')"
            :list="tabs"
            :current="tabIndex"
            mode="subsection"
            activeColor="#505bde"
            fontSize="28rpx"
            bold
            @change="onChangetabIndex"
          >
          </u-subsection>
        </view>
        <view class="uni-flex-item"></view>
        <text class="btn-edit" v-if="!editMode" @click="editMode = true">编辑</text>
        <template v-else>
          <text class="btn-delete" @click="onDelete">删除</text>
          <text class="btn-select-all" @click="onSelectAll">全选</text>
          <u-icon name="close-circle-fill" size="48rpx" @click="editMode = false" color="#505bde"></u-icon>
        </template>
      </view>
    </u-sticky>
    <u-collapse
      ref="uCollapse"
      accordion
      :border="false"
      class="page-list"
      v-for="(tab, index) in tabs"
      v-show="tabIndex === index"
      :key="index"
    >
      <u-collapse-item
        :isLink="false"
        :clickable="false"
        :disabled="editMode || (index === 0 && (v.content.length <= 24 || !v.content))"
        :name="i.toString()"
        :border="false"
        :accordion="true"
        class="page-list-item"
        v-for="(v, i) in listMap[index] || []"
        :key="i"
      >
        <template v-if="index === 0">
          <view class="page-list-item-box" slot="title" @click="onItemClick(v)">
            <view class="page-list-item-checkbox" v-if="editMode">
              <u-icon width="40rpx" height="40rpx" v-if="v.selected" name="/static/icons/icon-step-active.svg"></u-icon>
              <u-icon width="40rpx" height="40rpx" v-else name="/static/icons/icon-step-null.svg"></u-icon>
            </view>
            <view class="uni-flex-item">
              <view :class="{'page-list-item-top': true, 'page-list-item-top-edit': editMode}">
                <u-badge v-if="v.readStatus === '0'" class="page-list-item-top-dot" :isDot="true"></u-badge>
                <view class="page-list-item-top-type">
                  <text class="page-list-item-top-type-text">{{ v.typeName }}</text>
                </view>
                <text class="page-list-item-top-time">{{ v.createTime }}</text>
              </view>
              <view class="page-list-item-content">
                <view class="page-list-item-content-title">{{ v.content }}</view>
              </view>
            </view>
          </view>
          <view class="page-list-item-content-box">
            <view class="page-list-item-content-box-text">{{ v.content }}</view>
          </view>
        </template>
        <template v-else-if="index === 1">
          <view class="page-list-item-box" slot="title" @click="onItemClick(v)">
            <view class="page-list-item-checkbox" v-if="editMode">
              <u-icon width="40rpx" height="40rpx" v-if="v.selected" name="/static/icons/icon-step-active.svg"></u-icon>
              <u-icon width="40rpx" height="40rpx" v-else name="/static/icons/icon-step-null.svg"></u-icon>
            </view>
            <view class="uni-flex-item">
              <view :class="{'page-list-item-top': true, 'page-list-item-top-edit': editMode}">
                <u-badge v-if="v.readStatus === '0'" class="page-list-item-top-dot" :isDot="true"></u-badge>
                <view class="page-list-item-top-type">
                  <text class="page-list-item-top-type-text">{{ messageEnum[v.type] }}</text>
                </view>
                <text class="page-list-item-top-time">{{ $dayjs(Number(v.createTime)).format("YYYY-MM-DD HH:mm:ss") }}</text>
              </view>
              <view class="page-list-item-content">
                <view class="page-list-item-content-title">{{ v.title }}</view>
              </view>
            </view>
          </view>
          <view class="page-list-item-content-box">
            <view class="page-list-item-content-box-text">{{ v.message }}</view>
          </view>
        </template>
      </u-collapse-item>
      <view v-if="listMap[index] && listMap[index].length === 0" class="page-list-null">
        <u-image src="/static/icons/icon-record-null.svg" width="160rpx" height="160rpx"></u-image>
        <text class="page-list-null-tip">目前无记录</text>
      </view>
      <uni-load-more v-if="loadStatus[index] !== undefined" :status="loadStatus[index]"></uni-load-more>
    </u-collapse>
  </view>
</template>

<script>
import noticeNavbar from "@/components/notice-navbar"
import {
  pushMsgDelete,
  pushMsgList,
  pushMsgRead,
  pushMsgReadAll,
  stationletterDelete,
  stationletterList,
  stationletterRead,
  stationletterReadAll,
} from "../../api/api"
import {mapActions, mapState} from "vuex"

export default {
  name: "index",
  components: {noticeNavbar},
  data () {
    return {
      editMode: false,
      tabIndex: 0,
      pageSize: 10,
      listMap: {},
      pageIndexMap: {},
      refreshingMap: {},
      loadStatus: {},
      messageEnum: {
        NOTIFY: "普通通知",
        ORDER_DETAILS: "订单详情跳转",
        BILLING_CHANGES: "帐变记录跳转",
        DISPATCH: "派单",
        RELEASED_COIN: "待放币",
        PAY: "待支付",
        SYSTEM_MAINTAIN: "系统维护"
      },
      tabs: [
        {
          name: "站内信"
        },
        {
          name: "消息通知"
        }
      ],
      countData: {}
    }
  },
  computed: {
    ...mapState("user", ["pushMsgCount", "totalUnreadCount", "stationLetterCount"])
  },
  watch: {
    tabIndex () {
      this.editMode = false
      this.onLoadData(true)
    },
    editMode () {
      if (this.editMode) {
        this.$refs.uCollapse[this.tabIndex].init()
      } else {
        this.tabs.forEach((v, i) => {
          this.listMap[i] && this.listMap[i].forEach(item => {
            item.selected = undefined
            delete item.selected
          })
        })
      }
    }
  },
  created () {
    this.tabs.forEach((v, i) => {
      // this.listMap[i] = []
      this.pageIndexMap[i] = 0
      this.refreshingMap[i] = false
    })
    this.onLoadData(true)
    this.refreshCount()
  },
  onPullDownRefresh () {
    this.onLoadData(true)
  },
  onReachBottom () {
    this.onLoadData()
  },
  methods: {
    ...mapActions("user", ["GET_USER_INFO", "GET_USER_UNREAD_COUNT"]),
    refreshCount () {
      this.GET_USER_UNREAD_COUNT()
    },
    onDelete () {
      const tabIndex = this.tabIndex
      if (!this.listMap[tabIndex]) return
      const ids = this.listMap[tabIndex].filter(v => v.selected).map(v => v.id)
      if (ids && ids.length) {
        let api, params
        switch (tabIndex) {
          case 0:
            api = stationletterDelete
            params = {ids}
            break

          case 1:
            api = pushMsgDelete
            params = {idList: ids}
            break
        }

        if (!api) return

        uni.showLoading({
          title: "删除中...",
          mask: true
        })

        api(params).then(res => {
          uni.hideLoading()
          if (res.code.toString() === "0") {
            this.editMode = false
            this.onLoadData(true)
          }
        }).catch(_ => {
          console.error(_)
          uni.hideLoading()
        })
      }
    },
    onSelectAll () {
      this.listMap[this.tabIndex] && this.listMap[this.tabIndex].forEach(item => {
        item.selected = true
      })
      this.$forceUpdate()
    },
    onItemClick (item) {
      if (this.editMode) {
        item.selected = !item.selected
        this.$forceUpdate()
      } else {
        this.onRead(item)
      }
    },
    onRead (item) {
      const tabIndex = this.tabIndex
      if (item.readStatus === "0") {
        let api, params
        switch (tabIndex) {
          case 0:
            api = stationletterRead
            params = {ids: [item.id]}
            break

          case 1:
            api = pushMsgRead
            params = {idList: [item.id]}
            break
        }

        api && api(params).then(res => {
          if (res.code.toString() === "0") {
            item.readStatus = "1"
            this.refreshCount()
            this.$forceUpdate()
          }
        }).catch(_ => {
          console.error(_)
        })
      }
    },
    /**
     * 全部已读点击
     */
    onReadAll () {
      Promise.all([stationletterReadAll(), pushMsgReadAll()]).then(res => {
        this.onLoadData(true)
        this.refreshCount()
      })
    },
    /**
     * 分页加载数据
     */
    onLoadData (refresh) {
      const tabIndex = this.tabIndex
      if (!refresh && this.loadStatus[tabIndex] === "nomore" || this.refreshingMap[tabIndex]) return
      if (refresh) this.pageIndexMap[this.tabIndex] = 0

      let api
      switch (tabIndex) {
        case 0:
          api = stationletterList
          break
        case 1:
          api = pushMsgList
          break
      }
      if (!api) {
        uni.stopPullDownRefresh()
        return
      }

      uni.showLoading({
        title: "加载中...",
        mask: true
      })
      this.refreshingMap[tabIndex] = true
      this.pageIndexMap[this.tabIndex] += 1
      api({
        currentPage: this.pageIndexMap[this.tabIndex],
        pageSize: this.pageSize
      }).then(res => {
        setTimeout(() => {
          this.refreshingMap[tabIndex] = false
        }, 500)
        uni.stopPullDownRefresh()
        uni.hideLoading()
        if (res.code.toString() === "0" && res.data) {
          if (refresh) {
            this.listMap[tabIndex] = res.data.rows || []
          } else {
            this.listMap[tabIndex] = this.listMap[tabIndex].concat(res.data.rows || [])
          }

          if (Number(res.data.pages <= this.pageIndexMap[tabIndex])) {
            this.loadStatus[tabIndex] = "nomore"
          } else {
            this.loadStatus[tabIndex] = "loading"
          }

          this.$forceUpdate()
        }
      }).catch(_ => {
        console.error(_)
        setTimeout(() => {
          this.refreshingMap[tabIndex] = false
        }, 500)
        uni.stopPullDownRefresh()
        uni.hideLoading()
      })
    },
    onChangetabIndex (tabIndex) {
      this.tabIndex = tabIndex
    }
  }
}
</script>

<style lang="scss" scoped>
uni-page-wrapper,
uni-page-body {
  height: unset !important;
  min-height: 100%;
}

.page {
  min-height: 100vh;

  .btn-edit {
    color: #505bde;
    font-size: 28rpx;
    line-height: 1;
    font-weight: bold;
  }

  .btn-select-all {
    color: #505bde;
    font-size: 28rpx;
    line-height: 1;
    font-weight: bold;
    margin-right: 40rpx;
  }

  .btn-delete {
    color: #ef3c3c;
    font-size: 28rpx;
    line-height: 1;
    font-weight: bold;
    margin-right: 40rpx;
  }

  &-top {
    display: flex;
    background-color: #ffffff !important;
    align-items: center;
    justify-content: space-between;
    padding: 32rpx 24rpx;
  }

  &-tab {
    background-color: #ffffff !important;
    //height: 124rpx;
    width: 400rpx;

    @for $i from 0 through 10 {
      .page-tab-dot-#{$i} {
        ::v-deep .u-subsection__item--#{$i} {
          position: relative;

          &::after {
            content: ' ';
            display: block;
            width: 16rpx;
            height: 16rpx;
            position: absolute;
            right: 8rpx;
            top: 8rpx;
            background-color: #f56c6c;
            border-radius: 8rpx;
          }
        }
      }
    }

    ::v-deep .u-subsection--subsection {
      height: 60rpx;

      .u-subsection__item__text {
        color: #999999 !important;
        font-weight: bold !important;
      }
    }

    @for $i from 0 through 10 {
      .page-tab-#{$i} {
        ::v-deep .u-subsection__item--#{$i} {
          .u-subsection__item__text {
            color: #ffffff !important;
            z-index: $i;
          }
        }
      }
    }
  }

  ::v-deep .u-cell__body {
    padding: 0 !important;
  }

  ::v-deep .u-cell__body__content,
  ::v-deep .u-cell__title,
  .uni-flex-item {
    width: 100%;
  }

  &-list {
    padding: 20rpx;

    //::v-deep .u-cell__right-icon-wrap {
    //  display: none;
    //}

    &-null {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 320rpx;

      &-tip {
        color: #999999;
        font-size: 28rpx;
        padding-top: 20rpx;
      }
    }

    &-item {
      width: 710rpx;
      margin-bottom: 20rpx;
      //height: 170rpx;
      background-color: #ffffff;
      box-sizing: border-box;
      border-radius: 20rpx;

      &-box {
        display: flex;
      }

      &-checkbox {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 20rpx;
      }

      &-top {
        border-bottom: 1rpx solid #eeeeee;
        padding: 20rpx 32rpx 10rpx;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        position: relative;

        &-edit {
          border-bottom: 1rpx solid transparent;
        }

        &-dot {
          position: absolute;
          left: 8rpx;
        }

        &-type {
          height: 42rpx;
          background-color: #63B72E;
          border-radius: 4rpx;
          padding: 0 10rpx;
          margin-right: 10rpx;

          &-text {
            font-size: 28rpx;
            color: #ffffff;
          }
        }

        &-time {
          font-size: 24rpx;
          color: #999999;
        }
      }

      &-content {
        padding: 10rpx 32rpx 20rpx;
        box-sizing: border-box;
        width: 100%;

        &-title {
          font-size: 28rpx;
          color: #999999;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        &-text {
          font-size: 28rpx;
          color: #999999;
          word-break: break-all;
        }

        &-box {
          &-text {
            font-size: 28rpx;
            color: #999999;
            word-break: break-all;
          }
        }
      }
    }
  }
}
</style>
