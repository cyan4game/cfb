<!-- 设置 -->
<template>
    <view class="info-page-bg self-body page-setting">
        <u-navbar :safeAreaInsetTop="false" :title="'设置'" @leftClick="() => $routers.back()" />
        <view class="info-page-content content-box">
            <!-- 开关 -->
            <view class="switch-box">
                <text>音效通知</text>
                <switch class="switch" :checked="checked" @change="switchChange" />
                <view class="line"></view>
            </view>

            <!-- 退出登录 -->
            <view class="loginout" @click="loginout">退出登录</view>

        </view>

        

    </view>
</template>

<script>
import { soundNotificationSettings, logout } from '@/api/api'
import storage from '@/utils/storage'
import { updatUserInfo, clearAllStorage } from '@/utils/utils'

export default {
    data() {
        return {
            checked: false,
        }
    },
    created() {
        this.checked = (storage.get('userInfo') || {}).soundNotification
    },
    methods: {
        // 开关音效
        switchChange(e) {
            uni.showLoading({
                title: '',
                mask: true,
            });
            soundNotificationSettings(e.target.value).then(res => {
                if (res.code != 200) {
                    checked = !e.target.value
                } else {
                    updatUserInfo()
                }
            }).finally(() => {
                uni.hideLoading();
            })
        },
        // 退出登录
        loginout() {
            logout()
            setTimeout(() => {
                clearAllStorage()
                uni.reLaunch({
                    url: `/pages/login/index`
                })
            }, 100)
        }
    }
}

</script>

<style lang="scss" scoped>
.page-setting {
    .switch-box {
        border-radius: 22rpx;
        background-color: #fff;
        width: 100%;
        height: 200rpx;
        position: relative;
        box-sizing: border-box;
        padding: 20rpx 40rpx 10rpx 40rpx;
        top: -80rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: 32rpx;
        color: #454545;
        margin-top: 40rpx;
        .switch {
            transform: scale(0.7);
        }
        .line {
            width: 100%;
            height: 1px;
            background-color: #CECECE;
        }
    }
    .loginout {
        position: fixed;
        bottom: 100rpx;
        left: 50%;
        transform: translateX(-50%);
        background-color: #449367;
        width: 451rpx;
        height: 96rpx;
        font-size: 30rpx;
        color: #FFFFFF;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6rpx;
    }
}
</style>