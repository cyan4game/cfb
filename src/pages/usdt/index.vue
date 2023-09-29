<!-- USDT钱包 -->
<template>
    <view class="info-page-bg page-usdt">

        <view class="total-box">
            <view class="total-title">
                <text>钱包资产CNY</text>
                <u-image v-show="showMoney" @click="showMoney = false" class="icon" height="23rpx" width="33rpx"
                    src="/static/images/index/eye-open.png"></u-image>
                <u-image v-show="!showMoney" @click="showMoney = true" class="icon" height="23rpx" width="33rpx"
                    src="/static/images/index/eye-close.png"></u-image>
            </view>
            <view class="num">{{ showMoney ? '111.18' : '****' }}</view>
        </view>

        <view class="info-page-content content-box">

            <view class="list-title">
                <view class="btn" :class="{'hidden-btn': hiddenSmall}" @click="hiddenSmall = !hiddenSmall">
                    <view class="check">
                        <view class="in"></view>
                    </view>
                    <text>隐藏小额资产</text>
                </view>
                <view class="search-box">
                    <u-image class="icon" height="28rpx" width="28rpx"
                    src="/static/images/funds/search.png"></u-image>
                    <input type="text" placeholder="搜索" class="search-ipt">
                </view>
            </view>

            <scroll-view scroll-y="true" class="list-box">

                <view class="item" v-for="(item, i) in list" :key="i">
                    <u-image class="icon" height="50rpx" width="50rpx" src="/static/images/index/usdt.png"></u-image>
                    <view>{{ item.currency }}</view>
                    <view class="num">{{ item.balance }}</view>
                </view>

                <view class="nodata">暂无数据</view>

            </scroll-view>
        </view>
    </view>
</template>

<script>
import { memberWalletList } from '@/api/api'

export default {
    name: 'usdtPage',
    data() {
        return {
            showMoney: true, // 是否展示余额
            hiddenSmall: false, // 是否隐藏小额

            list: [], // 钱包列表
        }
    },
    onShow() {
        this.getWalletList()
    },
    methods: {
        // 获取钱包数据
        getWalletList() {
            memberWalletList().then(res => {
                if (res.code == 200) {
                    this.list = res.data || []

                    this.list = [
                        { currency: 'USDT', balance: '100.0000' },
                        { currency: 'USDT', balance: '100.0000' },
                        { currency: 'USDT', balance: '100.0000' },
                    ]
                }
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.page-usdt {
    padding-top: 320rpx;
    position: relative;

    .content-box {
        background-color: #f1f1f1;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .list-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 26rpx;
            font-size: 24rpx;
            color: #343635;

            .btn {
                display: flex;
                align-items: center;

                .check {
                    width: 41rpx;
                    height: 41rpx;
                    border-radius: 50%;
                    border: 1px solid #449367;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-right: 25rpx;
                    box-sizing: border-box;

                    .in {
                        background-color: #449367;
                        width: 24rpx;
                        height: 24rpx;
                        border-radius: 50%;
                        box-sizing: border-box;
                    }
                }
            }
            .hidden-btn {
                .check {
                    border: 1px solid #343635;
                    .in {
                        background-color: #fff;
                        border: 1px solid #343635;
                    }
                }
            }

            .search-box {
                width: 236rpx;
                height: 51rpx;
                display: flex;
                align-items: center;
                border-radius: 6rpx;
                background-color: #fff;
                box-sizing: border-box;
                padding: 0 20rpx 0 20rpx;
                .icon {
                    position: relative;
                    top: -1rpx;
                }
                .search-ipt {
                    flex: 1;
                    margin-left: 20rpx;
                    font-size: 24rpx;
                }
            }
        }

        .list-box {
            flex: 1;
            overflow: hidden;
            padding-top: 20rpx;
            .item {
                box-sizing: border-box;
                padding: 32rpx;
                background-color: #fff;
                border-radius: 6rpx;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-size: 32rpx;
                color: #484848;
                margin-bottom: 20rpx;
                .icon {
                    margin-right: 24rpx;
                }
                .num {
                    flex: 1;
                    text-align: right;
                }
            }
            .nodata {
                font-size: 24rpx;
                color: #999;
                text-align: center;
                padding-top: 100rpx;
            }
        }
    }

    .total-box {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 10rpx;
        width: 701rpx;
        height: 281rpx;
        background-image: url('../../static/images/mine/usdt-bg.png');
        background-size: 100% 100%;
        box-sizing: border-box;
        padding: 60rpx 47rpx 62rpx 55rpx;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        color: #fff;

        .total-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 28rpx;
        }

        .num {
            font-size: 72rpx;
        }
    }
}</style>