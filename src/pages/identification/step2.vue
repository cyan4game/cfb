<!-- 认证第二步-身份证照片 -->
<template>
    <view class="info-page-bg self-body page-iden-2">
        <u-navbar :safeAreaInsetTop="false" :title="'实名认证'" @leftClick="() => $routers.back()" />
        <view class="info-page-content content-box">

            <view class="title">姓名</view>
            <view class="info">{{ idenInfo.idName }}</view>
            <view class="title">身份证号</view>
            <view class="info">{{ hiddenIden(idenInfo.idCard) }}</view>
            <view class="title">证件照片</view>

            <!-- 正面 -->
            <view class="item">
                <view class="img" @click="selectFile('idCardFrontImage')">
                    <u-image class="pic" v-if="!files.idCardFrontImage.path" src="/static/images/mine/iden-1.png"
                        width="100%" height="100%"></u-image>
                    <u-image mode="fit" class="pic" v-if="files.idCardFrontImage.path" :src="files.idCardFrontImage.path"
                        width="100%" height="100%"></u-image>
                </view>
                <view>身份证正面照</view>
            </view>

            <!--反面 -->
            <view class="item">
                <view class="img" @click="selectFile('idCardBackImage')">
                    <u-image class="pic" v-if="!files.idCardBackImage.path" src="/static/images/mine/iden-2.png"
                        width="100%" height="100%"></u-image>
                    <u-image mode="fit" class="pic" v-if="files.idCardBackImage.path" :src="files.idCardBackImage.path"
                        width="100%" height="100%"></u-image>
                </view>
                <view>身份证反面照</view>
            </view>

            <!-- 手持 -->
            <view class="item">
                <view class="img" @click="selectFile('idCardHand')">
                    <u-image class="pic" v-if="!files.idCardHand.path" src="/static/images/mine/iden-3.png" width="100%"
                        height="100%"></u-image>
                    <u-image mode="fit" class="pic" v-if="files.idCardHand.path" :src="files.idCardHand.path" width="100%"
                        height="100%"></u-image>
                </view>
                <view>手持身份证正面照</view>
            </view>

            <u-button type="primary" :disabled="disabled" class="btn" :text="'提交'" @click="submit"></u-button>
        </view>
    </view>
</template>

<script>

import { hiddenIden } from '@/utils/utils'
import storage from "@/utils/storage";
import { standardCertification, _upload } from '@/api/api'

export default {
    name: 'iden-step2',
    data() {
        return {
            loading: false,
            userInfo: {},
            form: {
                idCardFrontImage: '',
                idCardBackImage: '',
                idCardHand: '',
                type: 1
            },
            files: {
                idCardFrontImage: {
                    path: ''
                },
                idCardBackImage: {
                    path: ''
                },
                idCardHand: {
                    path: ''
                }
            }
        }
    },
    computed: {
        disabled() {
            return this.loading || !(this.files.idCardFrontImage.path && this.files.idCardBackImage.path && this.files.idCardHand.path)
        }
    },
    onShow() {
        this.userInfo = storage.get('userInfo') || {}
    },
    onLoad() {
        this.idenInfo = storage.get('idenInfo') || {}
        this.form.idCardFrontImage = this.idenInfo.idCardFrontImage || ''
        this.form.idCardBackImage = this.idenInfo.idCardBackImage || ''
        this.form.idCardHand = this.idenInfo.idCardHand || ''

        this.files.idCardFrontImage = {
            path: this.idenInfo.idCardFrontImage || ''
        }
        this.files.idCardBackImage = {
            path: this.idenInfo.idCardBackImage || ''
        }
        this.files.idCardHand = {
            path: this.idenInfo.idCardHand || ''
        }

    },
    methods: {
        hiddenIden,
        // 选择文件
        selectFile(key) {
            uni.chooseImage({
                count: 1,
                success: (res) => {
                    this.files[key] = res.tempFiles[0]
                }
            });
        },
        // 提交
        async submit() {
            if (!this.form.idCardFrontImage) {
                this.form.idCardFrontImage = await this.uploadItem(this.files.idCardFrontImage)
            }
            if (!this.form.idCardBackImage) {
                this.form.idCardBackImage = await this.uploadItem(this.files.idCardBackImage)
            }
            if (!this.form.idCardHand) {
                this.form.idCardHand = await this.uploadItem(this.files.idCardHand)
            }
            if (!this.form.idCardFrontImage || !this.form.idCardBackImage || !this.form.idCardHand) return uni.showToast({
                title: '上传失败，请重新提交',
                icon: 'none',
                duration: 2000
            })
            standardCertification({
                idCardBack: this.form.idCardBackImage,
                idCardFront: this.form.idCardFrontImage,
                idCardHold: this.form.idCardHand,
            }).then(res => {
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
        // 上传文件
        uploadItem(file) {
            return new Promise(resolve => {
                uni.showLoading({
                    title: '上传中'
                })
                _upload(
                    file,
                    res => {
                        try {
                            const datas = JSON.parse(res.data)
                            if (datas.code == 200) {
                                resolve(datas.data)
                            } else {
                                uni.showToast({
                                    title: '上传失败，请重试',
                                    icon: 'none',
                                    duration: 2000
                                });
                                resolve(false)
                            }
                        } catch {
                            uni.showToast({
                                title: '上传失败',
                                icon: 'none',
                                duration: 2000
                            });
                            resolve(false)
                        }
                    },
                    () => {
                        uni.showToast({
                            title: '网络异常，请重试',
                            icon: 'none',
                            duration: 2000
                        });
                        resolve(false)
                    },
                    () => {
                        uni.hideLoading();
                    }
                )
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.page-iden-2 {
    .content-box {
        overflow: auto;
        color: #454545;
        font-size: 32rpx;
        padding-bottom: 240rpx;

        .title {
            margin-bottom: 30rpx;
        }

        .info {
            padding-bottom: 46rpx;
            margin-bottom: 47rpx;
            font-size: 26rpx;
            border-bottom: 1px solid #CECECE;
        }

        .item {
            background-color: #F1F1F1;
            border-radius: 6rpx;
            height: 218rpx;
            margin-bottom: 24rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #000;
            font-size: 26rpx;

            .img {
                width: 166rpx;
                height: 113rpx;
                margin-right: 68rpx;
                border: 1px dashed #999;

                .pic {
                    width: 100%;
                    height: 100%;
                }
            }
        }

        .btn {
            width: 451rpx;
            height: 96rpx;
            background: #449367;
            border-radius: 6rpx;
            position: fixed;
            bottom: 80rpx;
            left: 50%;
            transform: translateX(-50%);
            color: #fff;
            font-size: 30rpx;
        }
    }
}
</style>