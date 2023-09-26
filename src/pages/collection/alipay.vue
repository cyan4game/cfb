<!-- 收款方式-支付宝 -->
<template>
    <view class="info-page-bg page-collection-alipay">
        
        <view class="info-page-content content-box">

            <view class="item">
                <text>支付宝姓名</text>
                <input class="item-ipt" placeholder="请输入支付宝姓名" type="text" v-model.trim="form.name">
            </view>

            <view class="item">
                <text>支付宝账号</text>
                <input class="item-ipt" placeholder="请输入支付宝账号" type="text" v-model.trim="form.account">
            </view>


            <!-- 上传 -->
            <view class="upload">
                <u-image class="right" src="@/static/images/mine/pic.png" width="84rpx" height="84rpx"></u-image>
                <view class="upload-info">
                    <view style="color: #757575;font-size: 28rpx;">上传图片</view>
                    <view>请上传收款二维码</view>
                </view>
            </view>

            <view class="qrcode"></view>

            <view style="height: 240rpx;"></view>

        </view>


        <view class="btn">确定</view>

    </view>
</template>

<script>
import storage from "@/utils/storage";

export default {
    name: 'collectionAlipay',
    data() {
        return {
            userInfo: {},
            form: {
                name: '',
                account: '',
                qrcode: ''
            }
        }
    },
    onShow() {
        this.userInfo = storage.get('userInfo') || {}
    },
}

</script>

<style scoped lang="scss">
.page-collection-alipay {
    .content-box {
        .item {
            height: 134rpx;
            border-bottom: 1px solid #CECECE;
            display: flex;
            align-items: center;
            justify-content: space-between;
            color: #454545;
            font-size: 32rpx;
            padding-left: 40rpx;
            .item-ipt {
                flex: 1;
                margin-left: 40rpx;
                font-size: 28rpx;
            }
        }
        .upload {
            width: 670rpx;
            height: 218rpx;
            padding: 0 75rpx;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-top: 65rpx;
            color: #454545;
            font-size: 32rpx;
            border-radius: 6rpx;
            border: 1px solid #747474;
            box-sizing: border-box;
            .upload-info {
                margin-left: 74rpx;
            }
        }
        .qrcode {
            width: 670rpx;
            height: 670rpx;
            background-color: #e4e4e4;
            margin-top: 65rpx;
        }
    }
    .btn {
        width: 451rpx;
        height: 96rpx;
        background-color: #449367;
        border-radius: 6rpx;
        color: #fff;
        font-size: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        bottom: 60rpx;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>