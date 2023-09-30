<!-- 认证第一步-身份号码表单 -->
<template>
    <view class="info-page-bg page-iden-1">
        <view class="info-page-content content-box">
            <view class="title">姓名</view>
            <view class="box">
                <input v-model="form.realName" class="ipt" type="text" placeholder="请输入绑定的真实姓名">
            </view>
            <view class="title">身份证号</view>
            <view class="box">
                <input v-model="form.idCard" class="ipt" type="text" placeholder="请输入身份证号账号">
            </view>
        </view>

        <u-button :disabled="disabled" class="btn" :text="'提交'" @click="submit"></u-button>
    </view>
</template>

<script>

import { certificateAdd, certificateModify } from '@/api/api'
import storage from "@/utils/storage";

export default {
    name: 'iden-step1',
    data() {
        return {
            idenInfo: {},
            
            loading: false,
            form: {
                realName: '',
                idCard: '',
                type: 0,
            }
        }
    },
    computed: {
        disabled() {
            return this.loading || !(this.form.realName && this.form.idCard)
        }
    },
    onLoad() {
        this.idenInfo = storage.get('idenInfo') || {}
        this.form.realName = this.idenInfo.realName || ''
        this.form.idCard = this.idenInfo.idCard || ''
    },
    methods: {
        // 判断并提交
        submit() {
            const first = true // 首次提交
            const Req = first ? certificateAdd : certificateModify
            const params = this.form
            if (!first) {
                params.id = this.idenInfo.id
            }
            this.loading = true
            Req(params).then(res => {
                if (res.code == 200) {
                    uni.showToast({
                        title: '资料提交成功',
                        icon: 'none',
                        duration: 2000
                    })
                    setTimeout(() => {
                        uni.navigateBack()
                    }, 1000)
                }
            }).finally(() => {
                setTimeout(() => {
                    this.loading = false
                }, 1000)
            })
        },
    }
}
</script>

<style lang="scss" scoped>
.page-iden-1 {
    .content-box {
        .title {
            font-size: 26rpx;
            color: #7A7A7A;
            margin-bottom: 35rpx;
        }
        .box {
            height: 72rpx;
            background-color: #F1F1F1;
            border-radius: 6rpx;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            padding: 0 42rpx;
            margin-bottom: 41rpx;
            .ipt {
                flex: 1;
                font-size: 26rpx;
                color: #433F48;
            }
        }
    }
    .btn {
        width: 451rpx;
        height: 96rpx;
        background-color: #449367;
        display: flex;
        align-items: center;
        border-radius: 6rpx;
        position: fixed;
        left: 50%;
        bottom: 80rpx;
        transform: translateX(-50%);
        font-size: 30rpx;
        color: #fff;
    }
}
</style>