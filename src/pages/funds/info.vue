<!-- 交易详情 -->
<template>
    <view class="info-page-bg self-body page-fundsinfo">
        <u-navbar :safeAreaInsetTop="false" :title="'交易详情'" @leftClick="() => $routers.back()" />
        <view class="info-page-content content-box">

            <view class="info-box title">交易详情</view>
            <view class="info-box info-text">您已成功出售5USDT</view>

            <!-- 状态 -->
            <view class="status-box">
                <u-image class="status-icon" src="@/static/images/funds/status-1.png" width="80rpx"
                    height="80rpx"></u-image>
                <view class="status-content">
                    <view class="status-title">{{ info.status }}</view>
                    <view>-5 USDT</view>
                </view>
            </view>

            <!-- 详情 -->
            <view class="info-box details">
                <view class="detail">
                    <view class="name">确认数</view>
                    <view class="content">{{ info.confirmNum }}</view>
                </view>
                <view class="detail">
                    <view class="name">业务单号</view>
                    <view class="content">{{ info.businessId }}</view>
                </view>
                <view class="detail">
                    <view class="name">网络</view>
                    <view class="content">{{ info.coin }}</view>
                </view>
                <view class="detail">
                    <view class="name">类型</view>
                    <view class="content">{{ info.type }}</view>
                </view>
                <view class="detail">
                    <view class="name">状态</view>
                    <view class="content">{{ info.status }}</view>
                </view>
                <view class="detail">
                    <view class="name">充币地址</view>
                    <view class="content" @click="copy('复制的内容')">
                        <u-image class="copy-icon" src="@/static/images/funds/copy.png" width="26rpx"
                    height="31rpx"></u-image>
                        <text>{{ info.address }}</text>
                    </view>
                </view>
                <view class="detail">
                    <view class="name">区块链交易ID</view>
                    <view class="content" @click="copy('复制的内容')">
                        <u-image class="copy-icon" src="@/static/images/funds/copy.png" width="26rpx"
                    height="31rpx"></u-image>
                        <text>{{ info.transactionHash }}</text>
                    </view>
                </view>
                <view class="detail">
                    <view class="name">时间</view>
                    <view class="content">{{ info.createTime }}</view>
                </view>
            </view>

        </view>
    </view>
</template>

<script>

import { copyTxt } from '@/utils/utils'
import { businessDetail } from '@/api/api'

export default {
    name: 'fundsInfo',
    data() {
        return {
            info: {}, // 详情
        }
    },
    onLoad() {
        this.getInfoData()
    },
    methods: {
        // 获取详细数据
        getInfoData() {
            businessDetail(1, 1).then(res => {
                if (res.code == 200) {
                    this.info = res.data
                }
            })
        },
        // 复制
        copy(txt) {
            copyTxt(txt)
            uni.showToast({
                title: '已复制',
                icon: 'none',
                duration: 2000
            });
        }
    },
}

</script>

<style  lang="scss">
.page-fundsinfo {
    .content-box {
        .info-box {
            padding: 0 20rpx;
        }

        .title {
            color: #38363B;
            font-size: 40rpx;
            font-weight: bold;
            margin-bottom: 28rpx;
        }

        .info-text {
            color: #38363B;
            font-size: 28rpx;
            margin-bottom: 38rpx;
        }

        .status-box {
            background-color: #F0F0F0;
            border-radius: 10rpx;
            padding: 39rpx 36rpx;
            color: #343635;
            font-size: 24rpx;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            margin-bottom: 60rpx;

            .status-icon {
                margin-right: 30rpx;
            }

            .status-content {
                flex: 1;

                .status-title {
                    color: #1BA27A;
                    font-size: 28rpx;
                    margin-bottom: 8rpx;
                }
            }

        }
        .details {
            .detail {
                display: flex;
                align-items: flex-start;
                justify-content: space-between;
                min-height: 80rpx;
                margin-bottom: 20rpx;
                font-size: 26rpx;
                .name {
                    color: #7A7A7A;
                    margin-right: 90rpx;
                }
                .content {
                    flex: 1;
                    overflow: hidden;
                    word-break: break-all;
                    color: #3C3C3C;
                    display: flex;
                    align-items: flex-start;
                    justify-content: flex-end;
                    text-align: right;
                    .copy-icon {
                        position: relative;
                        top: 6rpx;
                        margin-right: 10rpx;
                    }
                }
            }
        }
    }
}</style>
