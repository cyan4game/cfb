<!-- 收款方式-支付宝 -->
<template>
    <view class="info-page-bg page-collection-alipay">
        
        <view class="info-page-content content-box">

            <view class="item">
                <text>真实姓名</text>
                <input class="item-ipt" placeholder="请输入真实姓名" type="text" v-model.trim="form.realName">
            </view>

            <view class="item">
                <text>银行名称</text>
                <input class="item-ipt" placeholder="请输入银行名称" type="text" v-model.trim="form.bankName">
            </view>

            <view class="item">
                <text>银行卡号</text>
                <input class="item-ipt" placeholder="请输入银行卡号" type="text" v-model.trim="form.accountName">
            </view>

            <view class="item">
                <text>支行名称</text>
                <input class="item-ipt" placeholder="请输入支行名称" type="text" v-model.trim="form.branchName">
            </view>


            <view style="height: 240rpx;"></view>

        </view>

        <u-button @click="submit" :disabled="!(form.realName && form.bankName && form.accountName && form.branchName)" class="btn" type="primary" text="确定"></u-button>

    </view>
</template>

<script>
import storage from "@/utils/storage";
import { _upload, memberPaymodelBind, queryByMemberAndPaytype } from '@/api/api'

export default {
    name: 'collectionBank',
    data() {
        return {
            userInfo: {},
            form: {
                payType: 3,
                realName: '', // 真实姓名
                bankName: '', // 银行名称
                accountName: '', // 账号 银行卡是卡号；微信是微信号；支付宝是支付宝账号；云闪付是
                branchName: '', // 支行名称
            }
        }
    },
    onShow() {
        this.userInfo = storage.get('userInfo') || {}
        this.getInfo()
    },
    methods: {
        // 获取绑定详情
        getInfo() {
            queryByMemberAndPaytype({
                memberId: this.userInfo.id,
                payType: this.form.payType,
            }).then(res => {
                console.error(res)
                if (res.code == 200) {
                    this.form.id = res.data.id
                    this.form.realName = res.data.realName
                    this.form.bankName = res.data.bankName
                    this.form.accountName = res.data.accountName
                    this.form.branchName = res.data.branchName
                }
            })
        },
        // 提交
        submit() {
            memberPaymodelBind({
                ...this.form,
                memberId: this.userInfo.id
            }).then(res => {
                console.error('绑定', res)
                if (res.code == 200) {
                    uni.showToast({
                        title: '绑定成功',
                        icon: 'none',
                        duration: 2000
                    });
                    setTimeout(() => {
                        uni.navigateBack();
                    }, 500)
                }
            })
        },
    }
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