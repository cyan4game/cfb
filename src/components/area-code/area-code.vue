<!-- 区号选择 -->
<template>
    <uni-popup ref="popup" type="bottom">
        <view class="area-code-box">

        </view>
    </uni-popup>
</template>

<script>
export default {
    methods: {
        // 打开
        open() {
            this.$refs.popup.open()
        },
        // 关闭
        close() {
            this.$refs.popup.close()
        },

    }
}
</script>

<style lang="scss" scoped>
.area-code-box {

}
</style>

