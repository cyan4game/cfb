<!-- 详情 -->
<template>
    <view class="info-page-bg order-info">
        <view class="info-page-content content-box">
            
            <view class="title">交易已完成</view>
            <view class="info">您已成功出售1,234.26CFB</view>

            <view class="box">
                <view class="avatar"></view>
                <view class="content">
                    <view class="name">Picker</view>
                    <view>C2C订单消息]订单已完成</view>
                </view>
                <view class="btn">聊天</view>
            </view>

            <view class="subtitle">
                <u-image
                class="coin"
                src="/static/images/index/usdt.png"
                width="50rpx"
                height="50rpx"
                ></u-image>
                <text>出售CFB</text>
            </view>

            <view class="container" style="border-bottom: 1px solid #DFDFDF;">
                <view class="info-item">
                    <view class="item-name">单价</view>
                    <view class="item-box">￥7.04</view>
                </view>
                <view class="info-item">
                    <view class="item-name">数量</view>
                    <view class="item-box">123123CFB</view>
                </view>
                <view class="info-item">
                    <view class="item-name">总金额</view>
                    <view class="item-box">
                        <text>12313</text>
                        <u-image
                            class="copy"
                            src="/static/images/funds/copy.png"
                            width="26rpx"
                            height="31rpx"
                            ></u-image>
                    </view>
                </view>
            </view>

            <view class="container" style="border-bottom: 1px solid #DFDFDF;">
                <view class="info-item">
                    <view class="item-name">收款方式</view>
                    <view class="item-box bank">银行卡</view>
                </view>
                <view class="info-item">
                    <view class="item-name">收款账号</view>
                    <view class="item-box">23432423423</view>
                </view>
            </view>

            <view class="container">
                <view class="info-item">
                    <view class="item-name">买家昵称</view>
                    <view class="item-box">Paker</view>
                </view>
                <view class="info-item">
                    <view class="item-name">订单编号</view>
                    <view class="item-box">
                        <text>1231a2342342343</text>
                        <u-image
                            class="copy"
                            src="/static/images/funds/copy.png"
                            width="26rpx"
                            height="31rpx"
                            ></u-image>
                    </view>
                </view>
                <view class="info-item">
                    <view class="item-name">下单时间</view>
                    <view class="item-box">2023/06/17 00:45:08</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.order-info {
    color: #38363B;
    font-size: 28rpx;
    .content-box {
        border-top-right-radius: 6rpx;
        border-top-left-radius: 6rpx;
        overflow: auto;
    }
    .title {
        color: #38363B;
        font-size: 40rpx;
        margin-bottom: 27rpx;
    }
    .info {
        color: #38363B;
        font-size: 28rpx;
        margin-bottom: 38rpx;
    }
    .box {
        min-height: 158rpx;
        border-radius: 10rpx;
        background-color: #F0F0F0;
        margin-bottom: 60rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 27rpx;
        .avatar {
            background: #DEE1E9;
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 20rpx;
        }
        .btn {
            padding: 0 40rpx;
            height: 55rpx;
            background-color: #0D1115;
            color: #fff;
            font-size: 26rpx;
            border-radius: 28rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 20rpx;
        }
        .content {
            flex: 1;
            color: #343635;
            font-size: 24rpx;
            .name {
                font-size: 28rpx;
                margin-bottom: 4rpx;
            }
        }
    }
    .subtitle {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .coin {
            margin-right: 16rpx;
        }
    }
    .container {
        padding: 44rpx 0 0 0;
        .info-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 44rpx;
            color: #7A7A7A;
            .item-box {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                color: #3C3C3C;
                .copy {
                    margin-left: 24rpx;
                }
            }
            .bank {
                border-left: 1px solid #2EA984;
                padding-left: 20rpx;
                line-height: 20rpx;
            }
        }
    }
}
</style>