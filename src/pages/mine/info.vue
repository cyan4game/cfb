<!-- 个人资料 -->
<template>
    <view class="mine-info">

        <!-- 背景色 -->
        <view class="top-bg"></view>

        <!-- 前景色 -->
        <view class="bottom-bg"></view>

        <!-- 信息面板 -->
        <view class="info-box">
            <view class="title">信息管理</view>
            <view class="item" @click="editAvatar">
                <text class="name">头像</text>
                <u-image v-if="!userInfo.avatar" class="avatar" src="/static/images/mine/avatar.png" width="60rpx"
                    height="60rpx"></u-image>
                <u-image v-if="userInfo.avatar" class="avatar" :src="userInfo.avatar" width="60rpx"
                    height="60rpx"></u-image>
            </view>
            <view class="item" @click="goNickname">
                <text class="name">昵称</text>
                <text class="value">{{ userInfo.nickname || '未设置昵称' }}</text>
            </view>
            <view class="item">
                <text class="name">账户ID</text>
                <view class="value copy-box">
                    <u-image @click="copy" class="copy" src="/static/images/mine/copy.png" width="26rpx"
                        height="31rpx"></u-image>
                    <text>{{ userInfo.id }}</text>
                </view>
            </view>
        </view>

    </view>
</template>

<script>
import storage from '@/utils/storage'
import { copyTxt, updatUserInfo } from '@/utils/utils'
import { _upload, avatarSettings } from '@/api/api'

export default {
    data() {
        return {
            userInfo: {}
        }
    },
    created() {
        this.userInfo = storage.get('userInfo') || {}
    },
    onShow() {
        this.userInfo = storage.get('userInfo') || {}
    },
    methods: {
        // 选择文件
        editAvatar() {
            // todo 次数验证
            uni.chooseImage({
                count: 1,
                success: (res) => {
                    this.uploadAvatar(res.tempFiles[0])
                }
            });
        },
        // 上传头像
        uploadAvatar(file) {
            uni.showLoading({
                title: ''
            });
            _upload(
                file,
                res => {
                    try {
                        const datas = JSON.parse(res.data)
                        if (datas.code == 200) {
                            // 设置头像
                            setTimeout(() => {
                                this.setAvatar(datas.data)
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
        },
        // 设置头像
        setAvatar(url) {
            uni.showLoading({
                title: ''
            });
            avatarSettings({
                avatar: url
            }).then(res => {
                if (res.code == 200) {
                    this.userInfo.avatar = url || ''
                    storage.set('userInfo', this.userInfo)
                    updatUserInfo()
                    uni.showToast({
                        title: '更新成功',
                        icon: false,
                        duration: 2000
                    });
                }
            }).finally(() => {
                uni.hideLoading();
            })
        },
        // 复制
        copy() {
            copyTxt(this.userInfo.id)
            uni.showToast({
                title: '已复制',
                icon: 'none',
                duration: 2000
            });
        },
        // 修改昵称
        goNickname() {
            uni.navigateTo({
                url: '/pages/mine/editName'
            })
        }
    }
}

</script>

<style lang="scss" scoped>
.mine-info {
    height: 100%;
    background-color: #F1F1F1;

    .top-bg {
        background-color: #0D1116;
        height: 100rpx;
    }

    .bottom-bg {
        width: 100%;
        border-radius: 22rpx;
        background-color: #F1F1F1;
        height: 100rpx;
        position: relative;
        top: -80rpx;
    }

    .info-box {
        position: relative;
        top: -180rpx;
        margin: 52rpx 28rpx;
        background-color: #fff;
        border-radius: 9rpx;
        padding: 44rpx 62rpx;

        .title {
            color: #484848;
            font-size: 32rpx;
            margin-bottom: 40rpx;
        }

        .item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 80rpx;
            color: #8C8C8C;
            font-size: 26rpx;

            .avatar {
                border-radius: 50%;
                overflow: hidden;
            }

            .value {
                color: #484848;
            }

            .copy-box {
                display: flex;
                align-items: center;

                .copy {
                    margin-right: 10rpx;
                }
            }
        }
    }
}
</style>