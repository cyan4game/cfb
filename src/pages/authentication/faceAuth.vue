<template>
  <view class="face-page">
    <web-view
      @message="handleMessage"
      class="web-view"
      :src="webSrc"
    ></web-view>
  </view>
</template>

<script>
export default {
  name: "faceAuth",
  data() {
    return {
      authUrl: "",
      webSrc: "https://bridge.azzbit.com/",
    };
  },
  onShow() {
    // this.submit();
  },
  onLoad(option) {
    const {
      path,
      webankAppId,
      userId,
      version,
      nonce,
      orderNo,
      h5faceId,
      sign,
      from,
      redirectType,
    } = option;
    this.webSrc = `${this.webSrc}?path=${path}&webankAppId=${webankAppId}&userId=${userId}&version=${version}&nonce=${nonce}&orderNo=${orderNo}&h5faceId=${h5faceId}&sign=${sign}&from=${from}&redirectType=${redirectType}`;
  },
  methods: {
    GetRequest(path) {
      const url = path; //获取url中"?"符后的字串
      let theRequest = new Object();
      // if (url.indexOf("?") != -1) {
      let str = url.substr(1),
        strs = str.split("&");
      for (let i = 0; i < strs.length; i++) {
        theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
      }
      // }
      // console.log(JSON.stringify(theRequest));
      return theRequest;
    },
    handleMessage(e) {
      const path = e.detail.data[0].data[1];
      const params = this.GetRequest(path);
      // console.log(JSON.stringify(params));
      if (params.hasOwnProperty("code")) {
        this.router({
          url: "/pages/authentication/advanced",
          params,
        });
      }
    },
    submit() {
      // let webankAppId = "IDAqeRq3",
      //   version = "1.0.0",
      //   nonce = "kHoSxvLZGxSoFsjxlbzEoUzh5PAnTU7T",
      //   orderNo = "a19959248596551",
      //   userId = "b19959248596551",
      //   h5faceId = "tx0a85901bdfba7275bf6e3ebfa49a6d",
      //   url = "https%3a%2f%2fcloud.tencent.com",
      //   sign = "13F5F2A1EC6248360AB4D19E62BE4007343C4565",
      //   from = "browser",
      //   redirectType = "1";
      // let push = `https://miniprogram-kyc.tencentcloudapi.com/api/web/login?webankAppId=${webankAppId}&userId=${userId}&version=${version}&nonce=${nonce}&orderNo=${orderNo}&h5faceId=${h5faceId}&url=${url}&sign=${sign}&from=${from}&redirectType=${redirectType}`;
      // this.webSrc = `${this.webSrc}?url=${encodeURIComponent(push)}`;
      // // window.open(push);
    },
  },
};
</script>

<style lang="scss" scoped>
.face-page {
  height: 100%;
  .web-view {
    width: 100%;
    height: 100%;
  }
}
</style>
