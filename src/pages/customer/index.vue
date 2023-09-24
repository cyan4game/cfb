<!-- 客服 -->
<template>
    <view class="page-customer">
        <view class="content-box">
            
            <view class="top">您好，很抱歉我们暂时无法为您提供服务，如需帮助， 请留言，我们将尽快联系并解决您的问题 </view>
            <view class="title">
                电话<text class="red">*</text>
            </view>
            <input type="text" class="ipt" placeholder="请输入">
            <view class="title">
                留言内容<text class="red">*</text>
            </view>
            <textarea class="ipt textarea" auto-height placeholder="请输入" />

            <view class="upload-box">
                <view class="upload-item upload">
                    <view class="icon">+</view>
                    <text>上传图片</text>
                </view>
            </view>
            <view class="top">支持jpg 、png、gif、bmp格式的图片，可上传5张， 单张最大5M </view>

        </view>

        <view class="btn">提交</view>
    </view>
</template>


<script>

export default {
  name: "pageCustomer",
  data() {
    return {

    }
  }
};
</script>

<style lang="scss" scoped>
.page-customer {
    background-color: #0e1216;
    padding-top: 20rpx;
    height: 100%;
    box-sizing: border-box;
    .content-box {
        box-sizing: border-box;
        border-top-left-radius: 22rpx;
        border-top-right-radius: 22rpx;
        background-color: #fff;
        padding: 100rpx 28rpx 180rpx 28rpx;
        font-size: 26rpx;
        color: #433F48;
        min-height: 100vh;
        .top {
            padding: 0 44rpx 80rpx 44rpx;
        }
        .title {
            color: #7A7A7A ;
            font-size: 28rpx;
            margin-bottom: 34rpx;
            .red {
                color: #EB3131;
            }
        }
        .ipt {
            border-radius: 6rpx;
            min-height: 72rpx;
            background-color: #F1F1F1;
            padding: 0 40rpx;
            margin-bottom: 40rpx;
        }
        .textarea {
            padding: 20rpx 40rpx;
            min-height: 200rpx;
        }
        .upload-box {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            justify-content: flex-start;
            margin-bottom: 40rpx;
            .upload-item {
                width: 236rpx;
                height: 236rpx;
                margin: 0 20rpx 20rpx 0;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
            }
            .upload {
                background-color: #F1F1F1;
                border: 1px dashed #999;
                font-size: 28rpx;
                color: #433F48;
                .icon {
                    font-size: 100rpx;
                    line-height: 90rpx;
                    font-weight: 200;
                }
            }
        }
    }
    .btn {
        width: 451rpx;
        height: 96rpx;
        background-color: #449367;
        border-radius: 6rpx;
        color: #fff;
        font-size: 30rpx;
        position: fixed;
        bottom: 80rpx;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
</style>