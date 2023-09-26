<!-- 收款方式 -->
<template>
    <view class="info-page-bg page-collection-list">
        
        <view class="info-page-content content-box">

            <!-- 支付宝 -->
            <view class="item" @click="jump('/pages/collection/alipay')">
                <u-image class="icon" src="@/static/images/mine/icon-alipay.png" width="41rpx" height="41rpx"></u-image>
                <view>支付宝</view>
                <view class="info">未绑定</view>
                <u-image class="right" src="@/static/images/mine/right.png" width="15rpx" height="29rpx"></u-image>
            </view>

            <!-- 微信 -->
            <view class="item" @click="jump('/pages/collection/wechat')">
                <u-image class="icon" src="@/static/images/mine/icon-wechat.png" width="41rpx" height="41rpx"></u-image>
                <view>微信</view>
                <view class="info info-ed">已绑定</view>
                <u-image class="right" src="@/static/images/mine/right.png" width="15rpx" height="29rpx"></u-image>
            </view>

            <!-- 银行卡 -->
            <view class="item" @click="jump('/pages/collection/bank')">
                <u-image class="icon" src="@/static/images/mine/icon-bank.png" width="41rpx" height="41rpx"></u-image>
                <view>银行卡</view>
                <view class="info">未绑定</view>
                <u-image class="right" src="@/static/images/mine/right.png" width="15rpx" height="29rpx"></u-image>
            </view>

        </view>

    </view>
</template>

<script>
import storage from "@/utils/storage";

export default {
    name: 'collectionList',
    data() {
        return {
            userInfo: {},
            list: [],
        }
    },
    onShow() {
        this.userInfo = storage.get('userInfo') || {}

    },
    methods: {
        // 跳转
        jump(name) {
            uni.navigateTo({
                 url: name
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