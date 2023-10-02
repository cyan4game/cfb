<!-- 收款方式 -->
<template>
    <view class="info-page-bg page-collection-list">
        
        <view class="info-page-content content-box">

            <!-- 支付宝 -->
            <view class="item" @click="jump('/pages/collection/alipay')">
                <u-image class="icon" src="@/static/images/mine/icon-alipay.png" width="41rpx" height="41rpx"></u-image>
                <view>支付宝</view>
                <view class="info" :class="{ 'info-ed': status.alipay }">{{ status.alipay ? '已绑定' : '未绑定' }}</view>
                <u-image class="right" src="@/static/images/mine/right.png" width="15rpx" height="29rpx"></u-image>
            </view>

            <!-- 微信 -->
            <view class="item" @click="jump('/pages/collection/wechat')">
                <u-image class="icon" src="@/static/images/mine/icon-wechat.png" width="41rpx" height="41rpx"></u-image>
                <view>微信</view>
                <view class="info" :class="{ 'info-ed': status.wechat }">{{ status.wechat ? '已绑定' : '未绑定' }}</view>
                <u-image class="right" src="@/static/images/mine/right.png" width="15rpx" height="29rpx"></u-image>
            </view>

            <!-- 银行卡 -->
            <view class="item" @click="jump('/pages/collection/bank')">
                <u-image class="icon" src="@/static/images/mine/icon-bank.png" width="41rpx" height="41rpx"></u-image>
                <view>银行卡</view>
                <view class="info" :class="{ 'info-ed': status.bank }">{{ status.bank ? '已绑定' : '未绑定' }}</view>
                <u-image class="right" src="@/static/images/mine/right.png" width="15rpx" height="29rpx"></u-image>
            </view>

        </view>

    </view>
</template>

<script>
import { queryPayBindInfo } from '@/api/api'
import storage from "@/utils/storage";

// payType	支付方式类型 1支付宝 2微信 3银行卡 4云闪付
export default {
    name: 'collectionList',
    data() {
        return {
            userInfo: {},
            list: [],
            status: {}, // 状态 wechat  alipay   bank

            idenInfo: {}, // 认证信息
        }
    },
    onShow() {
        this.userInfo = storage.get('userInfo') || {}
        this.idenInfo = storage.get('idenInfo') || {}
        this.checkStatus()
    },
    methods: {
        // 跳转
        jump(name) {
            if (!this.idenInfo.type) return uni.showToast({
                title: '请先完成实名认证',
                icon: 'none',
                duration: 2000
            })
            uni.navigateTo({
                 url: name
            })
        },
        // 检测绑定状态
        checkStatus() {
            const paywayMap = storage.get('paywayMap')
            if (paywayMap) {
                this.status = paywayMap
            }
            queryPayBindInfo().then(res => {
                if (res.code == 200) {
                    this.status = res.data
                    storage.set('paywayMap', res.data)
                }
            })
        }
    }
}

</script>

<style scoped lang="scss">
.page-collection-list {
    .content-box {
        .item {
            height: 136rpx;
            border-bottom: 1px solid #CECECE;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #454545;
            font-size: 32rpx;
            .icon {
                margin-right: 29rpx;
            }
            .info {
                color: #E02F2F;
                font-size: 28rpx;
                flex: 1;
                text-align: right;
            }
            .info-ed {
                color: #999;
            }
            .right {
                margin-left: 32rpx;
            }
        }
    }
}
</style>