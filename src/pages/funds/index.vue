<!-- 资金明细 -->
<template>
    <view class="info-page-bg page-funds">
        <view class="info-page-content content-box">

            <!-- 类型选择 -->
            <scroll-view class="tabs" scroll-x="true">
                <view class="tab" @click="changeTab(-1)" :class="{ 'active-tab': params.type == -1 }">全部</view>
                <view class="tab" @click="changeTab(key)" :class="{ 'active-tab': params.type == key }"
                    v-for="(val, key) in tabsMap" :key="key">{{ val }}</view>
            </scroll-view>

            <!-- 筛选框 -->
            <view class="search-box">
                <!-- 时间 -->
                <view class="search-item" @click="openDialog('timePopup')">
                    <text>{{ params.time.start.replace('-', '/') }}</text>
                    <u-image class="more-icon" src="@/static/images/index/more.png" width="15rpx" height="9rpx"></u-image>
                </view>
                <!-- 币种 -->
                <view class="search-item" @click="openDialog('coinPopup')">
                    <text>币种：不限</text>
                    <u-image class="more-icon" src="@/static/images/index/more.png" width="15rpx" height="9rpx"></u-image>
                </view>
                <!-- 金额 -->
                <view class="search-item" @click="openDialog('moneyPopup')">
                    <text>金额：{{ getMoneyStatus }}</text>
                    <u-image class="more-icon" src="@/static/images/index/more.png" width="15rpx" height="9rpx"></u-image>
                </view>
            </view>

            <!-- 统计 -->
            <view class="total">
                <!-- 这里展示开始的月份，不管年份 chris -->
                <view class="date"><text class="num">{{ params.time.start ? params.time.start.split('-')[1] : '--' }}</text>月</view>
                <view class="income">收入：<text class="up">--</text></view>
                <view class="out">支出：<text class="down">--</text></view>
            </view>


            <scroll-view class="list" scroll-y="true" @scrolltolower="loadMore">
                <view class="item" v-for="(item, i) in list" :key="i" @click="goInfo(item)">
                    <u-image class="item-icon" src="@/static/images/funds/icon-1.png" width="90rpx"
                        height="90rpx"></u-image>
                    <view class="info">
                        <view class="title">
                            <text>{{ item.remark }}</text>
                            <!-- <u-image class="item-dir" src="@/static/images/funds/left.png" width="30rpx" height="16rpx"></u-image>
                            <text class="name">捕鱼</text> -->
                        </view>
                        <view>{{ item.createTime }}</view>
                    </view>
                    <view class="info2">
                        <view class="num">{{ item.amount }} {{ item.coin.split('_')[0] }}</view>
                        <view>--</view>
                    </view>
                </view>

                <!-- 状态 -->
                <view class="more">{{ finish ? '没有更多了' : (loading ? '加载中' : '加载更多') }}</view>
            </scroll-view>

        </view>


        <!-- 时间选择 -->
        <uni-popup :key="'timePopup'" ref="timePopup" type="bottom">
            <view class="params-dialog">
                <view class="title">
                    <view class="time-tabs">
                        <view class="time-tab" @click="params.time.tab = 1" :class="{ 'active-time-tab': params.time.tab == 1 }">
                            月份选择</view>
                        <view class="time-tab" @click="params.time.tab = 2" :class="{ 'active-time-tab': params.time.tab == 2 }">
                            自定义时间</view>
                    </view>
                    <view class="close" @click="() => $refs['timePopup'].close()">×</view>
                </view>

                <view class="dialog-content">
                    <!-- 月份选择 -->
                    <picker-view :key="1" v-if="params.time.tab == 1" class="picker-view" @change="changeDate"
                        :value="params.time.value1">
                        <picker-view-column>
                            <view class="item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view class="item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
                        </picker-view-column>
                    </picker-view>
                    <!-- 自定义时间 -->
                    <view class="faster-box" v-if="params.time.tab == 2">
                        <view class="faster-item" :class="{ 'faster-item-active': params.time.fasterActive == 1 }"
                            @click="changeFasterActive(1)">近三个月</view>
                        <view class="faster-item" :class="{ 'faster-item-active': params.time.fasterActive == 2 }"
                            @click="changeFasterActive(2)">近六个月</view>
                        <view class="faster-item" :class="{ 'faster-item-active': params.time.fasterActive == 3 }"
                            @click="changeFasterActive(3)">全部</view>
                    </view>
                    <view class="show-box" v-if="params.time.tab == 2">
                        <view class="show-item" @click="params.time.showActive = 1"
                            :class="{ 'show-item-active': params.time.showActive == 1 }">{{ params.time.showStart }}</view>
                        <text class="to">至</text>
                        <view class="show-item" @click="params.time.showActive = 2"
                            :class="{ 'show-item-active': params.time.showActive == 2 }">{{ params.time.showEnd }}</view>
                    </view>
                    <picker-view :key="2" v-if="params.time.tab == 2" class="picker-view" @change="changeDate"
                        :value="params.time.value2">
                        <picker-view-column v-show="params.time.showActive == 1">
                            <view class="item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
                        </picker-view-column>
                        <picker-view-column v-show="params.time.showActive == 1">
                            <view class="item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
                        </picker-view-column>

                        <picker-view-column v-show="params.time.showActive == 2">
                            <view class="item" v-for="(item, index) in years" :key="index">{{ item }}年</view>
                        </picker-view-column>
                        <picker-view-column v-show="params.time.showActive == 2">
                            <view class="item" v-for="(item, index) in months" :key="index">{{ item }}月</view>
                        </picker-view-column>
                    </picker-view>
                </view>

                <view class="submit-box">
                    <view class="btn" @click="sureTime">确认</view>
                </view>
            </view>
        </uni-popup>

        <!-- 币种 -->
        <uni-popup :key="'coinPopup'" ref="coinPopup" type="bottom">
            <view class="params-dialog">
                <view class="title">
                    <text>币种选择</text>
                    <view class="close" @click="() => $refs['coinPopup'].close()">×</view>
                </view>
                <view class="dialog-content">
                    <view class="coin-search">
                        <u-image class="search-icon" src="@/static/images/funds/search.png" width="32rpx" height="32rpx"></u-image>
                        <input class="search-ipt" type="text" placeholder="搜索币种">
                    </view>
                    <scroll-view scroll-y="true" style="flex:1;overflow: hidden;">
                        <view class="coin-item" v-for="i in 10" :key="i">
                            <u-image class="coin-icon" src="@/static/images/index/usdt.png" width="50rpx" height="50rpx"></u-image>
                            <view class="coin-name">USDT</view>
                            <view class="coin-ed">
                                <view class="coin-edin"></view>
                            </view>
                        </view>
                    </scroll-view>
                </view>
                <view class="submit-box">
                    <view class="btn" @click="sureCoin">确认</view>
                </view>
            </view>
        </uni-popup>

        <!-- 金额范围 -->
        <uni-popup :key="'moneyPopup'" ref="moneyPopup" type="bottom">
            <view class="params-dialog" style="height:500rpx">
                <view class="title">
                    <text>金额范围</text>
                    <view class="close" @click="() => $refs['moneyPopup'].close()">×</view>
                </view>
                <view class="dialog-content">
                    <view class="range-box">
                        <input class="range-item" placeholder="输入金额" type="number" v-model="params.range.min">
                        <text class="to">至</text>
                        <input class="range-item" placeholder="输入金额" type="number" v-model="params.range.max">
                    </view>
                </view>
                <view class="submit-box">
                    <view class="btn" @click="sureRange">确认</view>
                </view>
            </view>
        </uni-popup>
    </view>
</template>


<script>
import storage from "@/utils/storage";
import { financeQuery } from '@/api/api'

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
            tabsMap, // 分类Map
            userInfo: {}, // 用户数据
            params: { // 绑定参数
                type: -1,
                time: { // 时间
                    tab: 1, // 1-月份 2-自定义
                    value1: [], // 月份选择器的值 [Yi, Mi]
                    value2: [], // 自定义选择器的值 [Yi, Mi, Yi, Mi]
                    start: '', // 开始时间 yyyy-mm
                    end: '', // 结束时间 yyyy-mm

                    // 自定义选择时的状态
                    fasterActive: '', // 1-三个月 2-六个月 3-全部
                    showActive: 1, // 1-开始时间 2-结束时间
                    showStart: '', // 自定义时展示的开始时间
                    showEnd: '', // 自定义时展示的结束时间
                },
                range: { // 金额范围
                    min: '',
                    max: '',
                }
            },
            list: [], // 列表数据

            page: 0, // 当前页
            loading: false, // 加载状态
            finish: false, // 完成状态

            years: [],
            months: [],
        }
    },
    computed: {
        getMoneyStatus() { // 筛选金额展示的文本
            const range = this.params.range
            if (range.min === '' && range.max === '') return '不限'
            if (range.min === '') return '不限-' + range.max
            if (range.max === '') return range.min + '-不限'
            return range.min + '-' + range.max
        }
    },
    onShow() {
        this.userInfo = storage.get('userInfo') || {}
    },
    onLoad() {
        this.initDate()

        this.loadMore()
    },
    methods: {
        // 查看详情
        goInfo() {
            uni.navigateTo({
                url: '/pages/funds/info'
            })
        },
        // 更改类型
        changeTab(val) {
            this.params.type = val
        },
        // 重置搜索
        reset() {
            this.page = 0
            this.list = []
            this.loading = false
            this.finish = false
            this.loadMore()
        },
        // 获取参数
        getParams() {
            return {
                num: this.page,
                size: 10,
                type: null,
                coin: null,
                minTotalAmount: this.params.range.min,
                maxTotalAmount: this.params.range.max,
                queryStartDateStr: this.params.time.start,
                queryEndDateStr: this.params.time.end,
                // memberId: this.userInfo.id,
            }
        },
        // 加载更多
        loadMore() {
            console.error('加载更多')
            if (this.loading || this.finish) return
            this.loading = true
            this.page++
            financeQuery(this.getParams()).then(res => {
                console.error(res)
                if (res.code == 200) {
                    const datas = res.data
                    if (!datas.data) return
                    this.list.push(...datas.data)

                    // 完成状态
                    if (!this.list.length || this.list.length >= datas.total) {
                        this.finish = true
                    }
                }
            }).finally(() => {
                setTimeout(() => { // 防抖一下
                    this.loading = false
                }, 500)
            })
        },
        // 打开弹窗
        openDialog(name) {
            this.$refs[name].open()
            if (name == 'timePopup') { // 重置选择器状态
                const y = this.years.findIndex(item => item == this.params.time.start.split('-')[0])
                const m = this.params.time.start.split('-')[1] - 1
                this.params.time.value1 = [y, m]

                const y2 = this.years.findIndex(item => item == this.params.time.end.split('-')[0])
                const m2 = this.params.time.end.split('-')[1] - 1
                this.params.time.value2 = [y, m, y2, m2]
                setTimeout(() => {
                    this.updateShowTime()
                }, 0)
            }
        },
        // 初始化时间
        initDate() {
            // 当前时间
            const date = new Date()
            const year = date.getFullYear()
            const month = date.getMonth() + 1
            this.params.time.showStart = this.params.time.start = year + '-' + month
            this.params.time.showEnd = this.params.time.end = year + '-' + month

            // 所有年份
            for (let i = 2000; i <= date.getFullYear(); i++) {
                this.years.push(i)
            }

            // 所有月份
            for (let i = 1; i <= 12; i++) {
                this.months.push(i)
            }

            // 当前选择器
            this.params.time.value1 = [this.years.length - 1, month - 1]
            this.params.time.value2 = [this.years.length - 1, month - 1, this.years.length - 1, month - 1]
        },
        // 月份选择器变化
        changeDate(e) {
            if (this.params.time.tab == 1) { // 月份选择
                this.params.time.value1 = e.detail.value
            } else { // 自定义选择
                const arr = e.detail.value
                this.params.time.value2 = arr
                // todo 开始日期不能大于截至日期
                setTimeout(() => {
                    this.params.time.fasterActive = '' // 滚动选择是清除快捷选项
                    this.updateShowTime()
                }, 100)
            }
        },
        // 更新选择器展示的日期
        updateShowTime() {
            const arr = this.params.time.value2
            this.params.time.showStart = this.years[arr[0]] + '-' + this.months[arr[1]]
            this.params.time.showEnd = this.years[arr[2]] + '-' + this.months[arr[3]]
        },
        // 快捷选择
        changeFasterActive(key) {
            this.params.time.fasterActive = key

            this.initDate()
            let arr = JSON.parse(JSON.stringify(this.params.time.value2))
            switch (key) {
                case 1: // 三个月
                    if (arr[3] >= 2) { // 月份足够
                        arr[1] = arr[3] - 2
                    } else {
                        arr[0] = arr[1] - 1
                        arr[1] = 11 + (arr[3] - 2)
                    }
                    break
                case 2: // 六个月
                    if (arr[3] >= 5) { // 月份足够
                        arr[1] = arr[3] - 5
                    } else {
                        arr[0] = arr[1] - 1
                        arr[1] = 11 + (arr[3] - 5)
                    }
                    break
                case 3: // 全部
                    arr = [0, 0, this.years.length - 1, this.months.length - 1]
                    break
            }
            this.$set(this.params.time, 'value2', arr)
            this.updateShowTime()
        },
        // 确认时间
        sureTime() {
            if (this.params.time.tab == 1) { // 月份选择
                const curr = this.years[this.params.time.value1[0]] + '-' + this.months[this.params.time.value1[1]]
                this.params.time.start = curr
                this.params.time.end = curr
            } else { // 自定义选择
                const start = this.years[this.params.time.value2[0]] + '-' + this.months[this.params.time.value2[1]]
                const end = this.years[this.params.time.value2[2]] + '-' + this.months[this.params.time.value2[3]]
                this.params.time.start = start
                this.params.time.end = end
            }
            this.$refs['timePopup'].close()
            this.reset()
        },
        // 确认金额
        sureRange() {
            this.$refs['moneyPopup'].close()
            this.reset()
        },
        // 确认币种
        sureCoin() {
            this.$refs['coinPopup'].close()
            this.reset()
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

            .more {
                text-align: center;
                font-size: 24rpx;
                color: #999;
                padding: 50rpx 0;
            }

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

.params-dialog {
    width: 100%;
    height: 1000rpx;
    border-radius: 6px 6px 0px 0px;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .title {
        height: 120rpx;
        padding: 0 37rpx 0 63rpx;
        color: #38363B;
        font-size: 36rpx;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #DFDFDF;

        .close {
            width: 40rpx;
            height: 40rpx;
            border-radius: 50%;
            background-color: #EEEEEE;
            text-align: center;
            line-height: 36rpx;
            color: #888;
        }

        .time-tabs {
            display: flex;
            align-items: center;
            color: #8C8C8C;
            font-size: 26rpx;

            .time-tab {
                margin-right: 90rpx;
            }

            .active-time-tab {
                color: #38363B;
                font-size: 36rpx;
            }
        }
    }

    .dialog-content {
        flex: 1;
        box-sizing: border-box;
        padding: 42rpx;
        text-align: center;
        color: #8C8C8C;
        font-size: 32rpx;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .picker-view {
            flex: 1;
        }

        .faster-box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 10rpx;

            .faster-item {
                width: 188rpx;
                height: 76rpx;
                border: 1px solid #8C8C8C;
                border-radius: 6rpx;
                font-size: 28rpx;
                color: #8C8C8C;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .faster-item-active {
                color: #fff;
                background-color: #449367;
            }
        }

        .show-box {
            margin-top: 40rpx;
            color: #38363B;
            font-size: 32rpx;
            display: flex;
            align-items: center;
            height: 80rpx;

            .show-item {
                flex: 1;
                height: 100%;
                border-bottom: 1px solid #8C8C8C;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .show-item-active {
                border-bottom: 2px solid #3C8760;
            }

            .to {
                margin: 0 60rpx;
            }
        }

        .range-box {
            display: flex;
            align-items: center;
            color: #38363B;
            font-size: 32rpx;
            .range-item {
                flex: 1;
                height: 73rpx;
                background-color: #F1F1F1;
                border-radius: 6rpx;
            }
            .to {
                margin: 0 60rpx;
            }
        }
        .coin-search {
            height: 88rpx;
            background-color: #F1F1F1;
            border-radius: 6rpx;
            display: flex;
            align-items: center;
            .search-icon {
                margin: 0 42rpx 0 47rpx;
            }
            .search-ipt {
                flex: 1;
                margin-right: 40rpx;
                text-align: left;
            }
        }
        .coin-item {
            height: 110rpx;
            border-bottom: 1px solid #C4BFCB;
            display: flex;
            align-items: center;
            padding-left: 32rpx;
            box-sizing: border-box;
            color: #38363B;
            font-size: 26rpx;
            .coin-icon {
                margin-right: 28rpx;
            }
            .coin-name {
                flex: 1;
                margin-right: 40rpx;
            }
            .coin-ed {
                box-sizing: border-box;
                width: 41rpx;
                height: 41rpx;
                border-radius: 50%;
                border: 1px solid #449367;
                display: flex;
                align-items: center;
                justify-content: center;
                .coin-edin {
                    width: 25rpx;
                    height: 25rpx;
                    border-radius: 50%;
                    background-color: #449367;
                }
            }
        }
    }

    .submit-box {
        height: 200rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        .btn {
            width: 451rpx;
            height: 96rpx;
            background-color: #449367;
            border-radius: 6rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 30rpx;
        }
    }
}</style>