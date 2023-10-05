<!-- 充币 -->
<template>
    <view class="page-deposit">

        <!-- 浮标 -->
        <!-- <u-image class="right-icon" style="right:130rpx" src="/static/images/index/icon-help.png" width="42rpx" height="42rpx"></u-image>
        <u-image class="right-icon" src="/static/images/index/icon-his.png" width="45rpx" height="42rpx"></u-image> -->

        <!-- 币种 -->
        <view class="coin-box">
            <u-image class="icon" src="/static/images/index/usdt.png" width="50rpx" height="50rpx"></u-image>
            <view class="coin">USDT-TRC20</view>
            <u-image class="right" src="/static/images/mine/right.png" width="15rpx" height="29rpx"></u-image>
        </view>
        <!-- <view class="line"></view> -->
        <view class="qr-box">
            <tki-qrcode @result="result" ref="qrcode" :size="300" :val="'https://www.baidu.com'" />
        </view>
        <view class="btns">
            <view class="btn" @click="saveCode">保存至相册</view>
            <view class="btn">分享地址</view>
        </view>
        <view class="item">
            <text>收款地址</text>
        </view>
        <view class="address">
            <view style="width: 75%; word-break: break-all">sdas8sdfs6d5f76sd5f76sd5f76s5d7f65sd76f57sd5f67s</view>
            <u-image @click="copy('已复制的地址')" class="right" src="/static/images/mine/copy.png" width="26rpx" height="31rpx"></u-image>
        </view>
        <view class="line"></view>

        <!-- 详情 -->
        <view style="height:30rpx"></view>
        <view class="tip">1. 该地址仅支持 USDT 收款，请勿用于其他币种，否则会导致资产丢失并不可找回。</view>
        <view class="tip">2. 请使用TRC20（TRON）协议进行转入，使用其他协议转入会导致资产丢失并不可找回。</view>
        <view class="tip">3. 您的充值地址不会经常改变，可截图保存并重复充值。</view>
    </view>
</template>

<script>
import { copyTxt, savePic } from "@/utils/utils";

export default {
    name: "deposit",
    data() {
        return {
            qrcodePath: ''
        }
    },
    mounted() {
        this.$refs.qrcode._makeCode()
    },
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
        // 二维码图片
        result(rs) {
            this.qrcodePath = rs
        },
        // 保存二维码
        saveCode() {
            savePic(this.qrcodePath)
        }
    }
};
</script>

<style lang="scss" scoped>
.page-deposit {
    padding: 53rpx 66rpx;
    box-sizing: border-box;
    .right-icon {
        position: fixed;
        top: 26rpx;
        right: 40rpx;
        z-index: 999;
    }

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
        width: 300rpx;
        height: 300rpx;
        border: 1px dashed #d7d7d7;
        margin: 63rpx auto 10rpx auto;
        box-sizing: border-box;
        padding: 10rpx;
    }

    .btns {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 50rpx;
        .btn {
            height: 60rpx;
            margin: 0 20rpx;
            padding: 0 24rpx;
            background-color: #449367;
            color: #fff;
            border-radius: 6rpx;
            display: flex;
            font-size: 24rpx;
            align-items: center;
            justify-content: center;
        }
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
        margin-top: 10rpx;
        color: #696969;
        font-size: 23rpx;
    }
}
</style>
