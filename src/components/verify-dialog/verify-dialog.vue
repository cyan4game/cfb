<!-- 短信和邮箱验证弹框 -->
<template>
    <uni-popup ref="popup" type="bottom" :mask-click="false" :is-mask-click="false">
        <view class="msg-doalog" :style="{height:password?'900rpx':'750rpx'}">
            <view class="title">
                <text>安全验证</text>
                <view class="close" @click="close">×</view>
            </view>

            <!-- 已绑定了邮箱和手机 -->
            <template v-if="userInfo.phoneNumber && userInfo.email">
                <u-form :model="checkForm" ref="form2" class="form2">
                    <u-form-item class="item" prop="codeEmail">
                        <view class="item">
                            <u-text text="邮箱验证"></u-text>
                            <u-input class="ipt" :type="'text'" placeholder="请输入邮箱验证码" v-model="checkForm.codeEmail">
                                <template slot="suffix">
                                    <view class="code-btn" :class="{ 'dis-btn': emailTimedown }" @click="sendCode('email')">
                                        {{
                                            emailTimedown ? `${emailTimedown}秒` : '发送验证码' }}</view>
                                </template>
                            </u-input>
                        </view>
                    </u-form-item>
                    <u-form-item class="item" prop="codePhone">
                        <view class="item">
                            <u-text text="手机验证"></u-text>
                            <u-input class="ipt" :type="'text'" placeholder="请输入手机验证码" v-model="checkForm.codePhone">
                                <template slot="suffix">
                                    <view class="code-btn" :class="{ 'dis-btn': phoneTimedown }" @click="sendCode('phone')">
                                        {{
                                            phoneTimedown ? `${phoneTimedown}秒` : '发送验证码' }}</view>
                                </template>
                            </u-input>
                        </view>
                    </u-form-item>
                    <u-form-item class="item" prop="payPass" v-if="password">
                        <view class="item">
                            <u-text text="支付密码"></u-text>
                            <u-input class="ipt" :type="'password'" placeholder="请输入支付密码" v-model="checkForm.payPass"></u-input>
                        </view>
                    </u-form-item>
                </u-form>
                <u-button @click="goCheck" :disabled="!(checkForm.codeEmail && checkForm.codePhone) || (password && !checkForm.payPass)" class="login-button2"
                    type="primary" text="确认"></u-button>
            </template>

            <!-- 邮箱未绑定 -->
            <template v-if="!userInfo.email">
                <view class="untip">
                    <text>未绑定邮箱</text>
                    <text class="link" @click="jump('/pages/safety/email')">去绑定</text>
                </view>
            </template>

            <!-- 手机未绑定 -->
            <template v-if="!userInfo.phoneNumber">
                <view class="untip">
                    <text>未绑定手机</text>
                    <text class="link" @click="jump('/pages/safety/mobile')">去绑定</text>
                </view>
            </template>

            <!-- 提现密码未绑定 -->
            <template v-if="password && !userInfo.payPasswordStatus">
                <view class="untip">
                    <text>未绑定提现密码</text>
                    <text class="link" @click="jump('/pages/setPayPassword/index')">去绑定</text>
                </view>
            </template>
        </view>
    </uni-popup>
</template>

<script>

import { mailSecurity, smsSecurity } from '@/api/api'
import storage from "@/utils/storage";

export default {
    name: 'msgDialog',
    props: {
        password: { // 是否展示提现密码
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            userInfo: {},
            checkForm: {
                codeEmail: '',
                codePhone: '',
                payPass: '',
            },
            emailTimedown: 0,
            emailInterval: null,
            emailLoading: false,
            phoneTimedown: 0,
            phoneInterval: null,
            phoneLoading: false,
        }
    },
    beforeDestroy() {
        if (this.emailInterval) clearInterval(this.emailInterval)
        if (this.phoneInterval) clearInterval(this.phoneInterval)
    },
    methods: {
        open() {
            this.userInfo = storage.get('userInfo') || {}
            this.$refs.popup.open()
        },
        close() {
            this.$refs.popup.close()
        },
        // 验证
        goCheck() {
            this.$emit('success', {
                emailCode: this.checkForm.codeEmail,
                phoneCode: this.checkForm.codePhone,
            })
            this.close()
        },
        // 发送验证码
        sendCode(key) {
            if (key == 'email') {
                if (this.emailLoading) return
                if (this.emailTimedown) return
                this.emailLoading = true
                mailSecurity().then(res => {
                    if (res.code == 200) {
                        uni.showToast({
                            title: '邮件已发送',
                            icon: 'none',
                            duration: 2000
                        });
                        this.emailTimedown = 59
                        this.emailInterval = setInterval(() => {
                            this.emailTimedown--
                            if (this.emailTimedown == 0) {
                                clearInterval(this.emailInterval)
                            }
                        }, 1000);
                    }
                }).finally(() => {
                    this.emailLoading = false
                })

            } else {
                if (this.phoneLoading) return
                if (this.phoneTimedown) return
                this.phoneLoading = true
                smsSecurity().then(res => {
                    if (res.code == 200) {
                        uni.showToast({
                            title: '短信已发送',
                            icon: 'none',
                            duration: 2000
                        });
                        this.phoneTimedown = 59
                        this.phoneInterval = setInterval(() => {
                            this.phoneTimedown--
                            if (this.phoneTimedown == 0) {
                                clearInterval(this.phoneInterval)
                            }
                        }, 1000);
                    }
                }).finally(() => {
                    this.phoneLoading = false
                })
            }
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
.msg-doalog {
    width: 100%;
    height: 750rpx;
    background-color: #fff;

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

    .form2 {
        padding: 30rpx 50rpx;

        .ipt {
            margin-top: 20rpx;
        }

        .code-btn {
            color: #449367;
            font-size: 28rpx;
        }

        .dis-btn {
            color: #7A7A7A;
        }
    }

    .login-button2 {
        background: #449367;
        border-color: #449367;
        width: 451rpx;
        height: 96rpx;
        margin-top: 40rpx;
    }

    .item {
        width: 100%;
    }

    .untip {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 120rpx;
        font-size: 26rpx;
        .link {
            color: #449367;
            margin-left: 10rpx;
        }
    }
}</style>