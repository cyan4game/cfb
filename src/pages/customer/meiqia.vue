<template>
  <view class="web">
    <web-view v-if="src" :webview-styles="webviewStyles" :src="src"></web-view>
  </view>
</template>

<script>
import {mapGetters} from "vuex"

export default {
  data () {
    const appBaseInfo = uni.getAppBaseInfo()
    return {
      appid: appBaseInfo.appId,
      eid: "070fd279148125c1796c0bbb30697df1",
      pagePath: "https://chatlink.mstatik.com/widget/standalone.html",
      webviewStyles: {
        progress: {
          color: "#FF3333"
        }
      }
    }
  },
  computed: {
    ...mapGetters("user", ["userInfo"]),
    src () {
      const token = uni.getStorageSync("token")
      const metadata = {}
      if (token) {
        metadata.name = {
          id: this.userInfo.userInfo.id || '',
          昵称: this.userInfo.userInfo.nickname || '',
          用户名: this.userInfo.userInfo.username || '',
          手机号码: `+${this.userInfo.userInfo.areaCode || ''} ${this.userInfo.userInfo.mobilePhone || ''}`,
          邮箱: this.userInfo.userInfo.email || ''
        }
      }

      const path = encodeURI(`${this.pagePath}?eid=${this.eid}&clientid=${this.appid}${this.userInfo.userInfo.id || ''}&metadata=${JSON.stringify(metadata)}`)
      console.error(path)
      return path
    }
  }
}
</script>
