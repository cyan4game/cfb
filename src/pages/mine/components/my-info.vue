<!-- 我的-基本信息 -->
<template>
    <view class="my-info">
        <view class="avatar" @click="goInfo">
            <u-image v-if="!userInfo.avatar" class="icon" src="/static/images/mine/avatar.png" width="100rpx" height="100rpx"></u-image>
            <u-image v-if="userInfo.avatar" class="icon" :src="userInfo.avatar" width="100rpx" height="100rpx"></u-image>
        </view>
        <view class="info" @click="goInfo">
            <view class="name">{{ userInfo.nickname || '未设置昵称' }}</view>
            <view>{{ userInfo.id || '--' }}</view>
        </view>
        <view class="btn">基础认证</view>
    </view>
</template>

<script>

export default {
    props: {
        userInfo: { // 用户信息
            type: Object,
            default: () => {}
        }
    },
    methods: {
        // 去个人中心
        goInfo() {
            uni.navigateTo({
                    url: '/pages/mine/info'
            })
        }
    }
}

</script>

<style lang="scss">
.my-info {
    padding-left: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20rpx;
    .avatar {
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        overflow: hidden;
    }
    .info {
        flex: 1;
        padding-left: 20rpx;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-start;
        font-size: 24rpx;
        color: #FFFFFD;
        .name {
            font-size: 28rpx;
        }
    }
    .btn {
        background-color: #F0F0F0;
        height: 47rpx;
        border-top-left-radius: 24rpx;
        border-bottom-left-radius: 24rpx;
        padding: 0 16rpx 0 24rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #111113;
        font-size: 26rpx;
    }
}
</style>