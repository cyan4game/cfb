<!-- 币种图标 -->
<template>
    <view class="coin-icon">
        <image v-if="map[coin] == 1" style="width:100%;height:100%" src="@/static/images/index/usdt.png"></image>
        <image v-if="map[coin] == 2" style="width:100%;height:100%" src="@/static/images/index/cfb.png"></image>
    </view>
</template>

<script>
export default {
    name: 'coinIcon',
    props: {
        coin: {
            type: String,
            default: 'USDT',
        }
    },
    data() {
        return {
            map: {
                'USDT': 1,
                'USDT_TRC20': 1,
                'CFB': 2,
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.coin-icon {
    width: 100%;
    height: 100%;
}
</style>