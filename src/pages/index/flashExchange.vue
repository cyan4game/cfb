<!-- 闪兑 -->
<template>
    <view class="page-fe">

        <!-- 右上角功能按钮 -->
        <u-image class="time-icon" src="/static/images/home/time.png" width="36rpx" height="36rpx"></u-image>

        <view class="rate">
            <text>汇率：</text>
            <text class="num">7.09</text>
        </view>

        <view class="box">
            <view class="top">
                <view class="select" @click="openCoinSelect">
                    <u-image class="img" src="/static/images/index/usdt.png" width="34rpx" height="34rpx"></u-image>
                    <text>USDT</text>
                    <u-image class="more" src="/static/images/index/more.png" width="13rpx" height="8rpx"></u-image>
                </view>
                <input type="number" v-model="form.from" class="num" placeholder="">
            </view>
            <view class="bottom">
                <view class="total">
                    <text>可用余额：</text>
                    <text class="money">9999.99 USDT</text>
                </view>
                <view class="btn">全部</view>
            </view>
        </view>

        <view class="trans-icon">
            <u-image class="more" src="/static/images/home/trans.png" width="51rpx" height="47rpx"></u-image>
        </view>

        <view class="box box2">
            <view class="top">
                <view class="select" @click="openCoinSelect">
                    <u-image class="img" src="/static/images/index/usdt.png" width="34rpx" height="34rpx"></u-image>
                    <text>USDT</text>
                    <u-image class="more" src="/static/images/index/more.png" width="13rpx" height="8rpx"></u-image>
                </view>
                <input v-model="form.to" type="number" class="num" placeholder="">
            </view>
        </view>


        <coin-select ref="coinSelect" @select="coinSelect"></coin-select>
    </view>
</template>

<script>
export default {
    name: 'flashExchange',
    data() {
        return {
            form: {
                from: '0.00',
                to: '0.00'
            }
        }
    },
    methods: {
        // 开始选择
        openCoinSelect() {
            this.$refs.coinSelect.open()
        },
        // 币种选择
        coinSelect(item) {
            this.$refs.coinSelect.close()
            console.error(item)
        }
    }
}
</script>

<style lang="scss" scoped>
.page-fe {
    .time-icon {
        position: fixed;
        top: 24rpx;
        right: 24rpx;
        z-index: 999;
    }

    .rate {
        text-align: center;
        color: #7A7A7A;
        font-size: 26rpx;
        padding: 50rpx 0 8rpx 0;

        .num {
            color: #E63C3C;
        }
    }

    .box {
        padding: 50rpx 50rpx 80rpx 50rpx;
        box-sizing: border-box;
        border: 1px solid #CDCDCD;
        margin: 17rpx 50rpx;

        .top {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .select {
                display: flex;
                align-items: center;
                justify-content: space-between;
                box-sizing: border-box;
                height: 55rpx;
                background-color: #F0F0F0;
                border-radius: 7rpx;
                padding: 0 15rpx;
                color: #454545;
                font-size: 22rpx;

                .img {
                    margin-right: 8rpx;
                }

                .more {
                    margin-left: 17rpx;
                }
            }

            .num {
                text-align: right;
                color: #FCA223;
                font-size: 56rpx;
            }
        }

        .bottom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 50rpx;
            color: #252525;
            font-size: 26rpx;

            .money {
                color: #449367;
            }

            .btn {
                color: #232323;
            }
        }
    }

    .box2 {
        padding-top: 80rpx;
        position: relative;
        z-index: 1;
    }

    .trans-icon {
        background-color: #F0F0F0;
        width: 92rpx;
        height: 92rpx;
        border-radius: 12rpx;
        margin: -50rpx auto -50rpx auto;
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}</style>