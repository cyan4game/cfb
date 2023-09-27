<!-- 收款方式-微信 -->
<template>
    <view class="info-page-bg page-collection-alipay">
        
        <view class="info-page-content content-box">

            <view class="item">
                <text>微信姓名</text>
                <input class="item-ipt" placeholder="请输入微信姓名" type="text" v-model.trim="form.realName">
            </view>

            <view class="item">
                <text>微信账号</text>
                <input class="item-ipt" placeholder="请输入微信账号" type="text" v-model.trim="form.accountName">
            </view>


            <!-- 上传 -->
            <view class="upload" @click="chooseFile" v-if="!form.qrCode">
                <u-image class="right" src="@/static/images/mine/pic.png" width="84rpx" height="84rpx"></u-image>
                <view class="upload-info">
                    <view style="color: #757575;font-size: 28rpx;">上传图片</view>
                    <view>请上传收款二维码</view>
                </view>
            </view>

            <view class="qrcode" v-if="form.qrCode" @click="chooseFile">
                <u-image :src="form.qrCode" width="670rpx" height="670rpx"></u-image>
            </view>

            <view style="height: 240rpx;"></view>

        </view>

        <u-button @click="submit" :disabled="!(form.realName && form.accountName && form.qrCode)" class="btn" type="primary" text="确定"></u-button>

    </view>
</template>

<script>
import storage from "@/utils/storage";
import { _upload, memberPaymodelBind, queryByMemberAndPaytype } from '@/api/api'

export default {
    name: 'collectionWechat',
    data() {
        return {
            userInfo: {},
            form: {
                payType: 2,
                realName: '', // 真实姓名
                accountName: '', // 账号 银行卡是卡号；微信是微信号；微信是微信账号；云闪付是
                qrCode: '', // 支付二维码地址或者银行卡号，默认为空
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
                    this.form.accountName = res.data.accountName
                    this.form.qrCode = res.data.qrCode
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
        // 选择文件
        chooseFile() {
            uni.chooseImage({
                count: 1,
                success: (res) => {
                    this.uploadImg(res.tempFiles[0])
                }
            });
        },
        // 上传文件
        uploadImg(file) {
            uni.showLoading({
                title: ''
            });
            _upload(
                file,
                res => {
                    try {
                        const datas = JSON.parse(res.data)
                        if (datas.code == 200) {
                            // 上传成功
                            setTimeout(() => {
                                this.form.qrCode = datas.data
                            }, 200);
                        } else {
                            uni.showToast({
                                title: '上传失败，请重试',
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    } catch {
                        uni.showToast({
                            title: '上传失败',
                            icon: 'none',
                            duration: 2000
                        });
                    }
                },
                () => {
                    uni.showToast({
                        title: '网络异常，请重试',
                        icon: 'none',
                        duration: 2000
                    });
                },
                () => {
                    uni.hideLoading();
                }
            )
        }
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