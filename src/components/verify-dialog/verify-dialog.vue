<!-- 短信和邮箱验证弹框 -->
<template>
    <uni-popup ref="popup" type="bottom" :mask-click="false" :is-mask-click="false">
        <view class="msg-doalog">
            <view class="title">
                <text>安全验证</text>
                <view class="close" @click="close">×</view>
            </view>

            <u-form :model="checkForm" ref="form2" class="form2">
                <u-form-item class="item" prop="codeEmail">
                    <view class="item">
                        <u-text text="邮箱验证"></u-text>
                        <u-input class="ipt" :type="'text'" placeholder="请输入邮箱验证码" v-model="checkForm.codeEmail">
                            <template slot="suffix">
                                <view class="code-btn" :class="{ 'dis-btn': emailTimedown }" @click="sendCode('email')">{{
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
                                <view class="code-btn" :class="{ 'dis-btn': phoneTimedown }" @click="sendCode('phone')">{{
                                    phoneTimedown ? `${phoneTimedown}秒` : '发送验证码' }}</view>
                            </template>
                        </u-input>
                    </view>
                </u-form-item>
            </u-form>
            <u-button @click="goCheck" class="login-button2" type="primary" text="确认"></u-button>
        </view>
    </uni-popup>
</template>

<script>
export default {
    name: 'msgDialog',
    data() {
        return {
            checkForm: {
                codeEmail: '',
                codePhone: '',
            },
            emailTimedown: 0,
            emailInterval: null,
            phoneTimedown: 0,
            phoneInterval: null,
        }
    },
    beforeDestroy() {
        if (this.emailInterval) clearInterval(this.emailInterval)
        if (this.phoneInterval) clearInterval(this.phoneInterval)
    },
    methods: {
        open() {
            this.$refs.popup.open()
        },
        close() {
            this.$refs.popup.close()
        },
        // 验证
        goCheck() {
            this.$emit('success')
            this.close()
        },
        // 发送验证码
        sendCode(key) {
            if (key == 'email') {
                if (this.emailTimedown) return
                this.emailTimedown = 59
                this.emailInterval = setInterval(() => {
                    this.emailTimedown--
                    if (this.emailTimedown == 0) {
                        clearInterval(this.emailInterval)
                    }
                }, 1000);
            } else {
                if (this.phoneTimedown) return
                this.phoneTimedown = 59
                this.phoneInterval = setInterval(() => {
                    this.phoneTimedown--
                    if (this.phoneTimedown == 0) {
                        clearInterval(this.phoneInterval)
                    }
                }, 1000);
            }
        },
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
}
</style>