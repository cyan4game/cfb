module.exports = {
  transpileDependencies: ["uview-ui", "z-paging"],
  devServer: {
    port: 10002,
    // https: true,
    host: "0.0.0.0",
    open: true,
    // host: '192.168.0.97',
    inline: true, // 实时刷新
    disableHostCheck: process.env.NODE_ENV === "development", // 关闭 host check，方便使用 ngrok 之类的内网转发工具
    proxy: {
      "/": {
        target: "http://dev-app.cfbaopay.com/app/", // gogo
        bypass: function (req, res, proxyOptions) {
          if (req.url.startsWith('/pages')) {
            // 如果请求的路径以/pages开头，则不进行代理，保持原样
            return req.url;
          }
        },
        changeOrigin: true, // api对应域名
        secure: true, // 支持Https协议
      },
    },
    // {
    //   "/market": {
    //     target: "https://test-marketmaker-api.zhbtest.com", // gogo
    //     changeOrigin: true, // api对应域名
    //     secure: true, // 支持Https协议
    //   },
    //   "/uploadFile": {
    //     target: "https://test-marketmaker-api.zhbtest.com", // gogo
    //     changeOrigin: true, // api对应域名
    //     secure: true, // 支持Https协议
    //   },
    // },
    historyApiFallback: true,
  },
  configureWebpack: {
    // >>>>>>>>>>>>>>>>>>> 添加下面的配置 <<<<<<<<<<<<<<<<<<<<<
    performance: {
      hints: "warning",
      //入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      //生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 500000000,
      //只给出 js 文件的性能提示
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith(".js");
      },
    },
  },
};
