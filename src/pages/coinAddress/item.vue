<!-- 添加和编辑地址 -->
<template>
    <view class="info-page-bg page-address-list">

        <!-- 表单 -->
        <view class="info-page-content content-box">

            <view class="form">

                <!-- 币种 -->
                <view class="form-item">
                    <view class="item-title">币种</view>
                    <view class="item-content" @click="openCurrency">
                        <view class="ipt">{{ form.currency || '请选择币种' }}</view>
                        <u-image class="content-icon" src="@/static/images/mine/right.png" width="15rpx"
                            height="29rpx"></u-image>
                    </view>
                </view>

                <!-- 提现网络 -->
                <view class="form-item">
                    <view class="item-title">提现网络</view>
                    <view class="item-content" @click="openChain">
                        <view class="ipt">{{ form.chain || '请选择提现网络' }}</view>
                        <u-image class="content-icon" src="@/static/images/index/more.png" width="15rpx"
                            height="9rpx"></u-image>
                    </view>
                </view>

                <!-- 提现地址 -->
                <view class="form-item">
                    <view class="item-title">提现地址</view>
                    <view class="item-content">
                        <input @input="checkAddress" v-model.trim="form.address" type="text" class="ipt">
                        <u-image @click="scan" class="content-icon" src="@/static/images/index/nav-1.png" width="36rpx"
                            height="33rpx"></u-image>
                    </view>
                    <view class="item-tip" v-if="form.address && !passAddress">无效的地址</view>
                </view>

                <!-- 备注(选填) -->
                <view class="form-item">
                    <view class="item-title">备注(选填)</view>
                    <view class="item-content">
                        <input v-model="form.name" type="text" class="ipt" maxlength="20">
                        <view>{{ form.name.length }}/20</view>
                    </view>
                </view>

            </view>

        </view>

        <!-- 按钮 -->
        <view class="btn" @click="submit" :class="{ 'disabled-btn': disabled }">提交</view>

        <!-- 验证弹窗 -->
        <verify-dialog ref="vd" @success="successHandle" />

        <!-- 币种选择 -->
        <uni-popup ref="currencyPopup" type="bottom" :mask-click="false" :is-mask-click="false">
            <view class="select-doalog">
                <view class="title">
                    <text>选择币种</text>
                    <view class="close" @click="() => $refs.currencyPopup.close()">×</view>
                </view>
                <scroll-view scroll-y="true" class="scroll-Y">
                    <view class="tip">
                        <u-image class="icon" src="/static/images/mine/warning.png" width="32rpx" height="32rpx"></u-image>
                        <view>确保充币平台与提币平台选择的网络一致， 否则可能造成资产损失</view>
                    </view>

                    <view class="select-item" v-for="i in 10" :key="i" @click="clickCurrency(i)">
                        <u-image class="icon" src="/static/images/index/usdt.png" width="50rpx" height="50rpx"></u-image>
                        <view>USDT</view>
                    </view>
                </scroll-view>
            </view>
        </uni-popup>
        <!-- 网络选择 -->
        <uni-popup ref="chainPopup" type="bottom" :mask-click="false" :is-mask-click="false">
            <view class="select-doalog">
                <view class="title">
                    <text>选择网络</text>
                    <view class="close" @click="() => $refs.chainPopup.close()">×</view>
                </view>
                <scroll-view scroll-y="true" class="scroll-Y">
                    <view class="tip">
                        <u-image class="icon" src="/static/images/mine/warning.png" width="32rpx" height="32rpx"></u-image>
                        <view>确保充币平台与提币平台选择的网络一致， 否则可能造成资产损失</view>
                    </view>

                    <view class="select-item" v-for="i in 10" :key="i" @click="clickChain(i)">
                        <u-image class="icon" src="/static/images/index/usdt.png" width="50rpx" height="50rpx"></u-image>
                        <view>TRC20</view>
                    </view>
                </scroll-view>
            </view>
        </uni-popup>
    </view>
</template>

<script>

import { addAddress, modifyAddress } from '@/api/api'
import storage from "@/utils/storage";
import { isValidTRONAddress } from '@/utils/utils'

export default {
    name: 'addressList',
    data() {
        return {
            type: 1, // 页面类型 1-添加  2-修改
            form: {
                address: '', // 地址
                currency: 'USDT', // 币种
                chain: 'TRC20', // 链
                name: '', // 备注
            },
            loading: false,
            userInfo: {},
            passAddress: false, // 是否通过地址格式校验
        }
    },
    computed: {
        disabled() {
            return !(this.form.address && this.form.currency && this.form.chain && this.passAddress) || this.loading
        }
    },
    onLoad(data) {
        this.userInfo = storage.get('userInfo') || {}
        this.type = data.type || 1
        uni.setNavigationBarTitle({
            title: this.type == 1 ? '添加地址' : '修改地址'
        })
        if (this.type == 2) { // 编辑时初始化数据
            Object.assign(this.form, data)
        }
    },
    methods: {
        // 校验地址是否合法
        checkAddress() {
            let pass = this.form.address && this.form.chain
            if (pass) {
                switch(this.form.chain) {
                    case 'TRC20':
                        pass = isValidTRONAddress(this.form.address)
                        break
                }
            }
            this.passAddress = pass
            return pass
        },
        // 提交
        submit() {
            if (this.disabled) return
            // 同一条链同一币种只能有一个地址的校验
            const list = storage.get('coin_address_list') || []
            const stop = list.some(item => item.coin == `${this.form.currency}_${this.form.chain}`)
            if (stop) return uni.showToast({
                icon: 'none',
                title: `${this.form.currency}_${this.form.chain} 地址已存在`,
                duration: 2000
            });
            this.$refs.vd.open()
        },
        successHandle() {
            const req = {
                1: addAddress,
                2: modifyAddress,
            }[this.type]
            if (!req) return
            this.loading = true
            req({
                ...this.form,
                memberId: this.userInfo.id
            }).then(res => {
                if (res.code == 200) {
                    uni.showToast({
                        title: this.type == 1 ? '添加成功' : '编辑成功',
                        icon: 'none',
                        duration: 2000
                    })
                    uni.navigateBack()
                }
            }).finally(() => {
                this.loading = false
            })
        },
        // 打开币种选择
        openCurrency() {
            this.$refs.currencyPopup.open()
        },
        // 选择币种
        clickCurrency() {
            this.$refs.currencyPopup.close()
        },
        // 打开网络选择
        openChain() {
            this.$refs.chainPopup.open()
        },
        // 选择网络
        clickChain() {
            this.$refs.chainPopup.close()
            this.checkAddress()
        },
        // 扫码
        scan() {
            uni.scanCode({
                success: res => {
                    this.form.address = res.result
                }
            })
        }
    }
}

</script>

<style scoped lang="scss">
.page-address-list {
    .content-box {
        color: #757575;
        font-size: 28rpx;
        padding-bottom: 100rpx;

        .form {
            .form-item {
                margin-bottom: 41rpx;

                .item-title {
                    color: #7A7A7A;
                    font-size: 26rpx;
                    margin-bottom: 34rpx;
                }

                .item-content {
                    background-color: #F1F1F1;
                    border-radius: 6rpx;
                    height: 72rpx;
                    position: relative;
                    display: flex;
                    align-items: center;
                    padding: 0 40rpx;
                    font-size: 26rpx;
                    color: #7A7A7A;

                    .ipt {
                        flex: 1;
                        margin-right: 20rpx;
                    }
                }
                .item-tip {
                    color: #DC2727;
                    font-size: 24rpx;
                    margin-top: 20rpx;
                }
            }
        }
    }

    .btn {
        width: 451rpx;
        height: 96rpx;
        background-color: #449367;
        color: #fff;
        border-radius: 6rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30rpx;
        position: fixed;
        left: 50%;
        transform: translateX(-50%);
        bottom: 60rpx;
    }

    .disabled-btn {
        background-color: #F1F1F1;
        color: #757575;
    }
}

.select-doalog {
    width: 100%;
    height: 900rpx;
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
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 0;
            color: #888;
        }
    }
    .scroll-Y {
        flex: 1;
        box-sizing: border-box;
        padding: 24rpx 54rpx;
        overflow: hidden;
        .select-item {
            margin-bottom: 28rpx;
            border-radius: 6rpx;
            border: 1px solid #959299;
            padding: 40rpx;
            display: flex;
            align-items: center;
            .icon {
                margin-right: 28rpx;
            }
        }
    }
    .tip {
        background-color: #F0F0F0;
        border-radius: 6rpx;
        padding: 30rpx 80rpx 30rpx 30rpx;
        display: flex;
        align-items: flex-start;
        font-size: 26rpx;
        color: #3B3B3B;
        margin-bottom: 40rpx;
        .icon {
            margin-right: 30rpx;
            position: relative;
            top: 1px;
        }
    }
}</style>