<!-- 资金明细 -->
<template>
    <view class="info-page-bg page-funds">
        <view class="info-page-content content-box">
            
            <!-- 类型选择 -->
            <scroll-view class="tabs" scroll-x="true">
                <view class="tab" @click="changeTab(-1)" :class="{ 'active-tab': params.type == -1 }">全部</view>
                <view class="tab" @click="changeTab(key)" :class="{ 'active-tab': params.type == key }" v-for="(val, key) in tabsMap" :key="key">{{ val }}</view>
            </scroll-view>

            <!-- 筛选框 -->
            <view class="search-box">
                <!-- 时间 -->
                <view class="search-item">
                    <text>2023/09</text>
                    <u-image class="more-icon" src="@/static/images/index/more.png" width="15rpx" height="9rpx"></u-image>
                </view>
                <!-- 币种 -->
                <view class="search-item">
                    <text>币种：不限</text>
                    <u-image class="more-icon" src="@/static/images/index/more.png" width="15rpx" height="9rpx"></u-image>
                </view>
                <!-- 金额 -->
                <view class="search-item">
                    <text>金额：不限</text>
                    <u-image class="more-icon" src="@/static/images/index/more.png" width="15rpx" height="9rpx"></u-image>
                </view>
            </view>

            <!-- 统计 -->
            <view class="total">
                <!-- 这里展示开始的月份，不管年份 chris -->
                <view class="date"><text class="num">9</text>月</view>
                <view class="income">收入：<text class="up">--</text></view>
                <view class="out">支出: <text class="down">--</text></view>
            </view>


            <scroll-view class="list" scroll-y="true" @scrolltolower="loadMore">
                <view class="item" v-for="i in 20" :key="i">
                    <u-image class="item-icon" src="@/static/images/funds/icon-1.png" width="90rpx" height="90rpx"></u-image>
                    <view class="info">
                        <view class="title">
                            <text>转入</text>
                            <u-image class="item-dir" src="@/static/images/funds/left.png" width="30rpx" height="16rpx"></u-image>
                            <text class="name">天天捕鱼</text>
                        </view>
                        <view>2023/09/12  12:23:03 </view>
                    </view>
                    <view class="info2">
                        <view class="num">-9.08 USD</view>
                        <view>已付款</view>
                    </view>
                </view>
            </scroll-view>

        </view>
    </view>
</template>


<script>
import storage from "@/utils/storage";

// 类型:0-转出（公链）1-转出失败（公链）2-收款（公链）3-公链gas 4-转出（内部）5-转出失败（内部）6-收款（内部）7-系统gas 
// 8-网银充值 9-OTC买入（派单）10-交易奖励 11-OTC买入（普通）12-OTC卖出 13-挂单出售 14-人工锁定 15-解锁 19-虚拟币下发
// 前端定义 -1  全部
const tabsMap = {
    0: '转出（公链）',
    1: '转出失败（公链）',
    2: '收款（公链）',
    3: '公链gas',
    4: '转出（内部）',
    5: '转出失败（内部）',
    6: '收款（内部）',
    7: '系统gas',
    8: '网银充值',
    9: 'OTC买入（派单）',
    10: '交易奖励',
    11: 'OTC买入（普通）',
    12: 'OTC卖出',
    13: '挂单出售',
    14: '人工锁定',
    15: '解锁',
    19: '虚拟币下发',
}

export default {
    name: 'funds',
    data() {
        return {
            tabsMap,
            userInfo: {},
            params: {
                type: -1,
            }
        }
    },
    onShow() {
        this.userInfo = storage.get('userInfo') || {}
    },
    methods: {
        // 更改类型
        changeTab(val) {
            this.params.type = val
        },
        // 加载更多
        loadMore() {
            console.error('加载更多')
        }
    }
}

</script>

<style scoped lang="scss">
.page-funds {
    .up {
        color: #3C8760;
    }
    .down {
        color: #DC2727;
    }
    .content-box {
        display: flex;
        flex-direction: column;
        padding: 0;
        .tabs {
            height: 108rpx;
            white-space: nowrap;
            border-bottom: 1px solid #CECECE;
            padding-top: 35rpx;
            box-sizing: border-box;
            margin: 0 40rpx;
            width: 670rpx;
            .tab {
                height: 38rpx;
                line-height: 38rpx;
                padding: 0 40rpx;
                border-right: 1px solid #BEBEBE;
                display: inline-block;
                color: #868686;
                font-weight: 400;
                font-size: 30rpx;
            }
            .active-tab {
                color: #454545;
                font-size: 34rpx;
                font-weight: 500;
            }
        }
        .search-box {
            height: 108rpx;
            border-bottom: 1px solid #CECECE;
            display: flex;
            color: #7A7A7A;
            font-size: 26rpx;
            margin: 0 40rpx;
            .search-item {
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: center;
                .more-icon {
                    margin-left: 17rpx;
                }
            }
        }
        .total {
            height: 124rpx;
            display: flex;
            align-items: flex-end;
            justify-content: flex-start;
            font-size: 24rpx;
            color: #8C8C8C;
            box-sizing: border-box;
            padding-bottom: 50rpx;
            padding-left: 60rpx;
            line-height: 24rpx;
            .date {
                margin-right: 47rpx;
                color: #484848;
                font-weight: 30rpx;
                .num {
                    font-size: 50rpx;
                }
            }
            .income {
                margin-right: 47rpx;
            }
        }
        .list {
            background-color: #F1F1F1;
            flex: 1;
            overflow: hidden;
            padding: 49rpx 29rpx;
            box-sizing: border-box;
            .item {
                width: 100%;
                height: 163rpx;
                border-radius: 9rpx;
                background-color: #fff;
                margin-bottom: 21rpx;
                padding: 0 36rpx;
                color: #8C8C8C;
                font-weight: 400;
                font-size: 24rpx;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                .item-icon {
                    margin-right: 33rpx;
                }
                .info {
                    flex: 1;
                    .title {
                        display: flex;
                        align-items: center;
                        font-size: 32rpx;
                        color: #484848;
                        margin-bottom: 8rpx;
                        .item-dir {
                            margin: 0 16rpx;
                        }
                        .name {
                            color: #8C8C8C;
                            font-size: 24rpx;
                        }
                    }
                }
                .info2 {
                    text-align: right;
                }
                .num {
                    font-size: 32rpx;
                    color: #484848;
                    font-weight: 500;
                    margin-bottom: 8rpx;
                }
            }
        }
    }
}
</style>