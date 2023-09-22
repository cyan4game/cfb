<template>
  <web-view src="/hybrid/html/loading/index.html"></web-view>
</template>

<script>
import {throttleFn} from "../../api/request"

export default {
  data () {
    return {}
  },
  onShow (options) {
    setTimeout(() => {
      // #ifdef APP-PLUS
      plus.navigator.closeSplashscreen()
      // #endif
      setTimeout(() => {
        if (uni.getStorageSync("token")) {
          uni.reLaunch({
            url: "/pages/index/index"
          })
        } else {
          throttleFn()
        }
      }, 3000)
    }, 500)
  }
}
</script>
