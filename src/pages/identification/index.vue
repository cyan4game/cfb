<!-- 身份认证-状态 -->
<template>
    <view class="info-page-bg page-iden">

        <view class="info-page-content content-box">
            <view class="info">用户名：{{ userInfo.nickname || '--' }}</view>

            <view class="info-box">
                <view class="item">
                    <!-- 状态 -->
                    <view class="title">
                        <view class="name">基础认证</view>
                        <view class="btn-box un" v-if="idenInfo.type == 0">未认证</view>
                        <view class="btn-box ed" v-if="idenInfo.type > 0">已认证</view>
                        <view style="flex:1"></view>
                        <view class="text ing" v-if="idenInfo.type == 0 && [2].includes(idenInfo.auditStatus)">审核中</view>
                        <view class="text fail" v-if="idenInfo.type == 0 && [3].includes(idenInfo.auditStatus)">审核失败:原因</view>
                        <view class="btn-box btn" v-if="idenInfo.type == 0 && [0, 3].includes(idenInfo.auditStatus)" @click="jump('/pages/identification/step1')">去认证</view>
                    </view>
                    <!-- 详情 -->
                    <view class="intro">
                        <view class="intro-item">证件姓名：{{ idenInfo.realName || '--' }}</view>
                        <view class="intro-item">身份证号：{{ idenInfo.realName || '--' }}</view>
                    </view>
                    <!-- 权限 -->
                    <view class="bottom-box">
                        <view class="bottom-title">OTC限额</view>
                        <view class="bottom-info">
                            <view class="bottom-item">
                                <view>单次</view>
                                <view class="num">{{ amounts[0].transactionSingleLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单日</view>
                                <view class="num">{{ amounts[0].transactionDayLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单月</view>
                                <view class="num">{{ amounts[0].transactionMonthLimit || '--' }}</view>
                            </view>
                        </view>
                        <view class="bottom-title">转账限额</view>
                        <view class="bottom-info">
                            <view class="bottom-item">
                                <view>单次</view>
                                <view class="num">{{ amounts[0].transferSingleLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单日</view>
                                <view class="num">{{ amounts[0].transferDayLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单月</view>
                                <view class="num">{{ amounts[0].transferMonthLimit || '--' }}</view>
                            </view>
                        </view>
                    </view>
                </view>

                <u-image class="next" src="/static/images/mine/down.png" width="48rpx" height="51rpx"></u-image>

                <view class="item">
                    <!-- 状态 -->
                    <view class="title">
                        <view class="name">标准认证</view>
                        <view class="btn-box un" v-if="idenInfo.type <= 1">未认证</view>
                        <view class="btn-box ed" v-if="idenInfo.type > 1">已认证</view>
                        <view style="flex:1"></view>
                        <view class="text ing" v-if="idenInfo.type == 1 && [2].includes(idenInfo.auditStatus)">审核中</view>
                        <view class="text fail" v-if="idenInfo.type == 1 && [3].includes(idenInfo.auditStatus)">审核失败:原因</view>
                        <view class="btn-box btn" v-if="idenInfo.type == 1 && [0, 3].includes(idenInfo.auditStatus)" @click="jump('/pages/identification/step2')">去认证</view>
                    </view>
                    <!-- 详情 -->
                    <view class="intro">
                        <view class="intro-item">完成标准认证(身分证正反面照片+手持身份证)</view>
                        <view class="intro-item">方可提高OTC及转帐交易额度</view>
                    </view>
                    <!-- 权限 -->
                    <view class="bottom-box">
                        <view class="bottom-title">OTC限额</view>
                        <view class="bottom-info">
                            <view class="bottom-item">
                                <view>单次</view>
                                <view class="num">{{ amounts[1].transactionSingleLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单日</view>
                                <view class="num">{{ amounts[1].transactionDayLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单月</view>
                                <view class="num">{{ amounts[1].transactionMonthLimit || '--' }}</view>
                            </view>
                        </view>
                        <view class="bottom-title">转账限额</view>
                        <view class="bottom-info">
                            <view class="bottom-item">
                                <view>单次</view>
                                <view class="num">{{ amounts[1].transferSingleLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单日</view>
                                <view class="num">{{ amounts[1].transferDayLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单月</view>
                                <view class="num">{{ amounts[1].transferMonthLimit || '--' }}</view>
                            </view>
                        </view>
                    </view>
                </view>

                <u-image class="next" src="/static/images/mine/down.png" width="48rpx" height="51rpx"></u-image>

                <view class="item">
                    <!-- 状态 -->
                    <view class="title">
                        <view class="name">高级认证</view>
                        <view class="btn-box un" v-if="!(idenInfo.type == 2 && [1].includes(idenInfo.auditStatus))">未认证</view>
                        <view class="btn-box ed" v-if="idenInfo.type == 2 && [1].includes(idenInfo.auditStatus)">已认证</view>
                        <view style="flex:1"></view>
                        <view class="text ing" v-if="idenInfo.type == 2 && [2].includes(idenInfo.auditStatus)">审核中</view>
                        <view class="text fail" v-if="idenInfo.type == 2 && [3].includes(idenInfo.auditStatus)">审核失败:原因</view>
                        <view class="btn-box btn" v-if="idenInfo.type == 2 && [0, 3].includes(idenInfo.auditStatus)">去认证</view>
                    </view>
                    <!-- 详情 -->
                    <view class="intro">
                        <view class="intro-item">完成高级认证(人脸辨识)</view>
                        <view class="intro-item">方可提高OTC及转帐交易额度 </view>
                    </view>
                    <!-- 权限 -->
                    <view class="bottom-box">
                        <view class="bottom-title">OTC限额</view>
                        <view class="bottom-info">
                            <view class="bottom-item">
                                <view>单次</view>
                                <view class="num">{{ amounts[2].transactionSingleLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单日</view>
                                <view class="num">{{ amounts[2].transactionDayLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单月</view>
                                <view class="num">{{ amounts[2].transactionMonthLimit || '--' }}</view>
                            </view>
                        </view>
                        <view class="bottom-title">转账限额</view>
                        <view class="bottom-info">
                            <view class="bottom-item">
                                <view>单次</view>
                                <view class="num">{{ amounts[2].transferSingleLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单日</view>
                                <view class="num">{{ amounts[2].transferDayLimit || '--' }}</view>
                            </view>
                            <view class="bottom-item">
                                <view>单月</view>
                                <view class="num">{{ amounts[2].transferMonthLimit || '--' }}</view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
import storage from "@/utils/storage";
import { certificateQuery, queryOtcLimit } from '@/api/api'

export default {
    name: 'iden',
    data() {
        return {
            userInfo: {},
            idenInfo: {
                type: 0, // 认证类型 0-基础认证，1-标准认证，2-高级认证	
                auditStatus: 0, // 认证审核状态 0未认证 1已认证 2 审核中 3认证失败
            },
            amounts: { // 不同级别的额度
                0: {},
                1: {},
                2: {}
            }
        }
    },
    onShow() {
        this.userInfo = storage.get('userInfo') || {}
        this.idenInfo = storage.get('idenInfo') || {}
        this.getIdenInfo()
    },
    onLoad() {
        
        this.getAmount()
    },
    methods: {
        // 获取认证信息
        getIdenInfo() {
            certificateQuery().then(res => {
                if (res.code == 200) {
                    this.idenInfo = res.data || {
                        type: 0,
                        auditStatus: 0,
                    }
                    storage.set('idenInfo', this.idenInfo)
                }
            })
        },
        // 查询额度
        getAmount() {
            this.amounts = storage.get('amounts') || {0:{},1:{},2:{}}
            queryOtcLimit().then(res => {
                console.error('--额度', res)
                if (res.code == 200) {
                    this.amounts = res.data
                    storage.set('amounts', this.amounts)
                }
            })
        },
        // 跳转
        jump(name) {
            uni.navigateTo({
                 url: name
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page-iden {
    .content-box {
        background-color: #F1F1F1;
        padding: 0;
        overflow: auto;
    }
    .info {
        height: 127rpx;
        padding-left: 60rpx;
        color: #449367;
        font-size: 30rpx;
        background-color: #fff;
        display: flex;
        align-items: center;
    }
    .info-box {
        padding: 43rpx 28rpx;
    }
    .item {
        padding: 0 50rpx;
        border-radius: 9rpx;
        background-color: #fff;
        margin: 0 auto;
        .title {
            height: 103rpx;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid #E5E5E5;
            color: #979797;
            font-size: 20rpx;
            font-weight: 400;
            line-height: 0;
            .name {
                color: #529B72;
                font-weight: 500;
                font-size: 28rpx;
                margin-right: 23rpx;
            }
            .btn-box {
                height: 46rpx;
                padding: 0 24rpx 2rpx 24rpx;
                border-radius: 6rpx;
                display: flex;
                align-items: center;
                box-sizing: border-box;
            }
            .un {
                border: 1px solid #7A7A7A;
            }
            .ed {
                color: #449367;
                border: 1px solid #449367;
            }
            .text {
                font-weight: 500;
                font-size: 24rpx;
            }
            .ing {
                color: #F09831;
            }
            .fail {
                color: #F84A4A;
            }
            .btn {
                color: #fff;
                background-color: #449367;
            }
        }
        .intro {
            border-bottom: 1px solid #E5E5E5;
            padding: 40rpx 0;
            color: #696969;
            font-size: 28rpx;
            .intro-item {
                line-height: 45rpx;
            }
        }
        .bottom-box {
            padding-top: 22rpx;
            padding-bottom: 2rpx;
            color: #7A7A7A;
            font-size: 26rpx;
            .bottom-title {
                color: #3C3C3C;
                font-weight: bold;
                margin-bottom: 31rpx;
            }
            .bottom-info {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 40rpx;
                .bottom-item {
                    text-align: left;
                    .num {
                        color: #3C3C3C;
                        font-weight: bold;
                        margin-top: 32rpx;
                    }
                }
            }
        }
    }
    .next {
        margin: 20rpx auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>