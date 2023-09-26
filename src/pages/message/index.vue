<!-- 消息中心 -->
<template>
    <view class="page-message">
        <view class="content-box">
            <view class="item" @click="goList(3)">
                <view class="icon">
                    <u-image class="more" src="/static/images/index/msg-service.png" width="80rpx" height="80rpx"></u-image>
                </view>
                <view class="content">
                    <view class="title">服务消息</view>
                    <view class="info">{{ serverMsg.content || '暂无消息' }}</view>
                </view>
                <view class="time">
                    <view>{{ getDateOrTime(serverMsg.createDate, 0) }}</view>
                    <view>{{ getDateOrTime(serverMsg.createDate, 1) }}</view>
                </view>
                <u-image class="more" src="/static/images/mine/right.png" width="15rpx" height="30rpx"></u-image>
            </view>

            <view class="item" @click="goList(2)">
                <view class="icon">
                    <u-image class="more" src="/static/images/index/msg-active.png" width="80rpx" height="80rpx"></u-image>
                </view>
                <view class="content">
                    <view class="title">活动消息</view>
                    <view class="info">{{ activeMsg.content || '暂无消息' }}</view>
                </view>
                <view class="time">
                    <view>{{ getDateOrTime(activeMsg.createDate, 0) }}</view>
                    <view>{{ getDateOrTime(activeMsg.createDate, 1) }}</view>
                </view>
                <u-image class="more" src="/static/images/mine/right.png" width="15rpx" height="30rpx"></u-image>
            </view>

            <view class="item" @click="goList(1)">
                <view class="icon">
                    <u-image class="more" src="/static/images/index/msg-system.png" width="80rpx" height="80rpx"></u-image>
                </view>
                <view class="content">
                    <view class="title">系统消息</view>
                    <view class="info">{{ systemMsg.content || '暂无消息' }}</view>
                </view>
                <view class="time">
                    <view>{{ getDateOrTime(systemMsg.createDate, 0) }}</view>
                    <view>{{ getDateOrTime(systemMsg.createDate, 1) }}</view>
                </view>
                <u-image class="more" src="/static/images/mine/right.png" width="15rpx" height="30rpx"></u-image>
            </view>
        </view>
    </view>
</template>

<script>
import { notification } from '@/api/api'
import { getTimestr } from '@/utils/time'
// 消息通知类型 1 系统 2 活动 3 服务
export default {
  name: "message",
  data() {
    return {
        serverMsg: {},
        activeMsg: {},
        systemMsg: {},
    }
  },
  created() {
    this.getLastMsg(1)
    this.getLastMsg(2)
    this.getLastMsg(3)
  },
  methods: {
    // 获取最后一条消息
    getLastMsg(type) {
        notification(1, 1, type).then(res => {
            console.error(res)
            if (res.data?.data?.length) {
                switch(type) {
                    case 1:
                        this.systemMsg = res.data.data[0]
                        break
                    case 2:
                        this.activeMsg = res.data.data[0]
                        break
                    case 3:
                        this.serverMsg = res.data.data[0]
                        break
                }
            }
        })
    },
    // 获取日期或者时间字符  type 0-日期 1-时间
    getDateOrTime(time, type=0) {
        if (!time) return ''
        return getTimestr(time).splice(' ')[type]
    },
    // 去消息列表
    goList(type) {
        uni.navigateTo({
             url: `/pages/message/list?type=${type}`
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.page-message {
    background-color: rgb(14, 18, 22);
    min-height: 100%;
    box-sizing: border-box;
    padding-top: 20rpx;
    .content-box {
        border-top-right-radius: 22rpx;
        border-top-left-radius: 22rpx;
        background-color: #F1F1F1;
        padding: 52rpx 28rpx;
        box-sizing: border-box;
        min-height: 100vh;
        .item {
            background-color: #fff;
            padding: 40rpx;
            border-radius: 9rpx;
            display: flex;
            align-items: center;
            color: #8c8c8c;
            font-size: 26rpx;
            line-height: 40rpx;
            margin-bottom: 20rpx;
            .icon {
                width: 80rpx;
                height: 80rpx;
                border-radius: 50%;
                overflow: hidden;
                margin-right: 40rpx;
            }
            .content {
                flex: 1;
                overflow: hidden;
                .title {
                    font-size: 36rpx;
                    color: #484848;
                }
                .info {
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-top: 10rpx;
                }
            }
            .time {
                margin: 0 30rpx;
            }
        }
    }
    .btn {
        color: #449367;
        //   
    }
}
</style>