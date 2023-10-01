<!-- 充币 -->
<template>
    <view class="page-deposit">
        <!-- 币种 -->
        <view class="coin-box">
            <u-image class="icon" src="/static/images/index/usdt.png" width="50rpx" height="50rpx"></u-image>
            <view class="coin">USDT</view>
            <u-image class="right" src="/static/images/mine/right.png" width="15rpx" height="29rpx"></u-image>
        </view>
        <view class="item">
            <text>充币网络</text>
        </view>
        <view class="chain-box">
            <text>USDT-TRC20</text>
            <u-image class="right" src="/static/images/index/more.png" width="15rpx" height="9rpx"></u-image>
        </view>
        <view class="line"></view>
        <view class="qr-box">
            <tki-qrcode ref="qrcode" :size="170" :val="'https://www.baidu.com'" />
        </view>
        <view class="item">
            <text>充币地址</text>
        </view>
        <view class="address">
            <view style="width: 60%; word-break: break-all">sdas8sdfs6d5f76sd5f76sd5f76s5d7f65sd76f57sd5f67s</view>
            <u-image class="right" src="/static/images/mine/copy.png" width="26rpx" height="31rpx"></u-image>
        </view>
        <view class="line"></view>

        <!-- 详情 -->
        <view class="item">
            <text>最小充币额</text>
            <text class="val">0.0001USDT</text>
        </view>
        <view class="item">
            <text>充币到账</text>
            <text class="val">1网络确认</text>
        </view>
        <view class="item">
            <text>提币解锁</text>
            <text class="val">1次网络确认</text>
        </view>
        <view class="item">
            <text>合约信息</text>
            <text class="val">尾号为SDFlDQ &gt;</text>
        </view>

        <view class="tip">您只能向此地址充入USDT-TRC20，充入其他资产将无法找回
        </view>
    </view>
</template>

<script>
import { copyTxt } from "@/utils/utils";

export default {
    name: "deposit",
    methods: {
        // 复制
        copy(txt) {
            copyTxt(txt);
            uni.showToast({
                title: "复制成功",
                icon: "none",
                duration: 2000,
            });
        },
    },
    mounted() {
        this.$refs.qrcode._makeCode()
    }
};
</script>

<style lang="scss" scoped>
.page-deposit {
    padding: 53rpx 66rpx;
    box-sizing: border-box;

    .coin-box {
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #454545;
        font-size: 26rpx;
        border-bottom: 1px solid #cecece;
        padding-right: 20rpx;

        .icon {
            margin-right: 22rpx;
        }

        .coin {
            flex: 1;
        }
    }

    .chain-box {
        height: 72rpx;
        background-color: #f0f0f0;
        padding: 0 45rpx;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #343635;
        font-size: 26rpx;
    }

    .line {
        margin-top: 50rpx;
        border-bottom: 1px dashed #888888;
        width: 100%;
    }

    .address {
        color: #3b3b3b;
        font-size: 26rpx;
        display: flex;
        justify-content: space-between;
    }

    .qr-box {
        width: 190rpx;
        height: 190rpx;
        border: 1px dashed #d7d7d7;
        margin: 63rpx auto 10rpx auto;
        box-sizing: border-box;
        padding: 10rpx;
    }

    .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #696969;
        font-size: 26rpx;
        height: 80rpx;

        .val {
            color: #3c3c3c;
        }
    }

    .tip {
        margin-top: 40rpx;
        color: #696969;
        font-size: 23rpx;
    }
}
</style>
