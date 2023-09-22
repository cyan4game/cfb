export default class UniSocket {
  constructor(config) {
    // 当前socket对象
    this.currSocket = null;
    // 心跳包时间索引
    this.timer = null;
    // 断线重连时间索引
    this.reConnectTimer = null;
    // 是否登录
    this.isLogin = false;
    // 当前网络状态
    this.netWork = true;
    // 是否是主动退出
    // let isClosed:boolean = false;
    // 消息队列
    this.socketMsgQueue = [];
    // 是否重连
    this.copyIsReconnection = !!config.isReconnection;
    // 配置参数
    this.config = {
      url: "ws://127.0.0.1",
      params: {},
      debug: true,
      isSendHeart: true,
      isReconnection: true,
      reConnectTime: 3000,
      timeout: 5 * 10 * 1000,
      heartData: "ping",
      onSocketMessage: null,
      onSocketClose: null,
      onSocketError: null,
      onSocketOpen: null,
      ...config,
    };
    this.initSocket();
  }

  // 连接socket
  initSocket(success, fail) {
    // isClosed = false;
    if (this.isLogin) {
      this.config.debug &&
        console.log(
          "%c [socket] %c 您已经登录了,请勿重新登录",
          "color:#0f0;",
          "color:#000;"
        );
      return typeof success === "function" && success(this);
    }
    // 检查网络状态
    this.config.debug &&
      console.log(
        "%c [socket] %c 检查网络状态...",
        "color:yellow;",
        "color:#000;"
      );
    // @ts-ignore
    uni.getNetworkType({
      fail: (err) => {
        this.config.debug &&
          console.log(
            "%c [socket] %c 检查网络状态失败:",
            "color:red;",
            "color:#000;",
            err
          );
        typeof fail === "function" && fail(err, this);
      },
      success: (res1) => {
        if (res1.networkType === "none") {
          this.config.debug &&
            console.log(
              "%c [socket] %c 网络已断开",
              "color:red;",
              "color:#000;"
            );
          this.isLogin = false;
          this.netWork = false;
          // @ts-ignore
          uni.showModal({
            title: "网络错误",
            content: "请打开网络服务",
            showCancel: false,
          });
          typeof fail === "function" && fail(res1, this);
        } else {
          this.netWork = true;
          this.config.debug &&
            console.log(
              "%c [socket] %c 网络正常,开始建立连接...",
              "color:yellow;",
              "color:#000;"
            );
          // @ts-ignore
          this.currSocket = uni.connectSocket({
            url: this.config.url,
            fail: (err) => {
              this.config.debug &&
                console.log(
                  "%c [socket] %c 接口API调用失败:",
                  "color:red;",
                  "color:#000;",
                  err
                );
              typeof fail === "function" && fail(err, this);
            },
            success: (res2) => {
              console.log(
                "%c [socket] %c 接口API调用成功",
                "color:blue;",
                "color:#000;",
                res2
              );
              typeof success === "function" && success(this);
            },
            complete: () => {},
          });
          // 监听socket是否打开成功
          // @ts-ignore
          this.currSocket.onOpen((header) => {
            this.config.debug &&
              console.log(
                "%c [socket] %c socket打开成功",
                "color:blue;",
                "color:#000;",
                header
              );
            this.isLogin = true;
            // 判断是否需要发送心跳包
            if (this.config.isSendHeart) {
              // this.config.debug &&
              //   console.log(
              //     "%c [socket] %c 检查到需要发送心跳包:",
              //     "color:#0f0;",
              //     "color:#000;",
              //     this.config.timeout
              //   );
              this._clearHeart();
              this._startHeart();
            }
            // 发送消息队列消息
            for (let i = 0; i < this.socketMsgQueue.length; i++) {
              this.config.debug &&
                console.log(
                  "%c [socket] %c 正在发送消息队列消息:",
                  "color:blue;",
                  "color:#000;",
                  i,
                  this.socketMsgQueue[i]
                );
              this.sendSocketMessage(this.socketMsgQueue[i]);
            }
            this.socketMsgQueue = [];
            typeof this.config.onSocketOpen === "function" &&
              this.config.onSocketOpen(this);
          });
          // @ts-ignore
          this.currSocket.onMessage((data) => {
            const message = this._isJson(data.data)
              ? JSON.parse(data.data)
              : data.data;
            this.config.debug &&
              console.log(
                "%c [socket] %c 接收到消息:",
                "color:blue;",
                "color:#000;",
                message
              );
            const dispatch = this.config.dispatch;
            if (dispatch && typeof dispatch === "function") {
              dispatch("ACCEPT_MESSAGE", message);
            }
            typeof this.config.onSocketMessage === "function" &&
              this.config.onSocketMessage(message);
          });
          // 监听网络状态
          // @ts-ignore
          uni.onNetworkStatusChange((res) => {
            this.config.debug &&
              console.log(
                "%c [socket] %c 监听到网络状态改变",
                "color:#0f0;",
                "color:#000;",
                JSON.stringify(res)
              );
            if (res.isConnected) {
              if (!this.isLogin /* && !isClosed */ && this.copyIsReconnection) {
                this.config.debug &&
                  console.log(
                    "%c [socket] %c 监听到有网络服务,重新连接socket",
                    "color:yellow;",
                    "color:#000;"
                  );
                this._reConnectSocket();
              }
            } else {
              this.isLogin = false;
              this.config.isSendHeart && this._clearHeart();
              // @ts-ignore
              uni.showModal({
                title: "网络错误",
                content: "请打开网络服务",
                showCancel: false,
              });
            }
          });
          // 监听socket被关闭
          // @ts-ignore
          this.currSocket.onClose((res) => {
            this.isLogin = false;
            typeof this.config.onSocketClose === "function" &&
              this.config.onSocketClose(res);
            this.config.debug &&
              console.log(
                "%c [socket] %c 监听到socket被关闭了:",
                "color:red;",
                "color:#000;",
                JSON.stringify(res)
              );
            // 停止心跳检查
            if (this.config.isSendHeart) {
              this._clearHeart();
            }
            if (/*! isClosed && */ this.copyIsReconnection) {
              // 断线重连
              this.config.debug &&
                console.log(
                  "%c [socket] %c 非主动断开socket,重新连接中...",
                  "color:yellow;",
                  "color:#000;"
                );
              this._reConnectSocket();
            }
          });
          // 监听socket错误
          // @ts-ignore
          this.currSocket.onError((res) => {
            this.isLogin = false;
            this.config.debug &&
              console.log(
                "%c [socket] %c 监听到socket错误",
                "color:red;",
                "color:#000;",
                res
              );
            // 关闭链接
            this.currSocket.close();
            // 由close监听发起重新链接
            // if (this.copyIsReconnection) {
            //   this._reConnectSocket();
            // }
            typeof this.config.onSocketError === "function" &&
              this.config.onSocketError(res);
          });
        }
      },
    });
  }

  // 发送socket消息
  sendSocketMessage(data, success, fail) {
    if (data === void 0) {
      data = "";
    }
    if (typeof data === "object") {
      // @ts-ignore
      data = { ...this.config.params, ...data };
      // this.config.debug &&
      //   console.log(
      //     "%c [socket] %c 发送消息",
      //     "color:blue;",
      //     "color:#000;",
      //     data,
      //     "id: ",
      //     this.config.id
      //   );
      data = JSON.stringify(data);
    } else {
      // this.config.debug &&
      //   console.log(
      //     "%c [socket] %c 发送消息",
      //     "color:blue;",
      //     "color:#000;",
      //     data,
      //     "id: ",
      //     this.config.id
      //   );
    }
    if (!this.isLogin) {
      // @ts-ignore
      this.socketMsgQueue.push(data);
    } else {
      // @ts-ignore
      this.currSocket.send({
        data,
        success,
        fail,
      });
    }
  }

  // 主动关闭socket
  closeSocket(options) {
    this.config.debug &&
      console.log("%c [socket] %c 主动关闭socket", "color:red;", "color:#000;");
    this.isLogin = false;
    this.copyIsReconnection = false;
    // 主动退出
    // isClosed = true;
    if (this.config.isSendHeart) {
      this._clearHeart();
    }
    // @ts-ignore
    this.currSocket.close(options);
  }

  // socket重连
  _reConnectSocket() {
    if (this.isLogin) {
      this.config.debug &&
        console.log(
          "%c [socket] %c 在登录状态,无法重连",
          "color:red;",
          "color:#000;"
        );
    } else {
      this.reConnectTimer = setInterval(() => {
        this.initSocket(
          (e) => {
            e.config.debug &&
              console.log(
                "%c [socket] %c 重新连接成功",
                "color:yellow;",
                "color:#000;"
              );
            if (e.config.isSendHeart) {
              // e._clearHeart();
              e._startHeart();
            }
            clearInterval(this.reConnectTimer);
            this.reConnectTimer = null;
          },
          (err, e) => {
            e.config.debug &&
              console.log(
                "%c [socket] %c 重新连接失败",
                "color:red;",
                "color:#000;"
              );
          }
        );
      }, this.config.reConnectTime);
    }
  }

  // 清除心跳
  _clearHeart() {
    this.config.debug &&
      // console.log("%c [socket] %c 已清除心跳", "color:#0f0;", "color:#000;");
      clearInterval(this.timer);
  }

  // 心跳开始
  _startHeart() {
    this.config.debug &&
      // console.log("%c [socket] %c 心跳开始", "color:#0f0;", "color:#000;");
      this.sendSocketMessage(this.config.heartData);
    this.timer = setInterval(() => {
      // console.info(
      //   "%c [socket] %c 登录状态",
      //   "color:#0f0;",
      //   "color:#000;",
      //   this.isLogin
      // );
      this.sendSocketMessage(this.config.heartData);
    }, this.config.timeout);
  }

  // 是否是json字符串
  _isJson(str) {
    try {
      const obj = JSON.parse(str);
      return !!(typeof obj === "object" && obj);
    } catch (e) {
      return false;
    }
  }
}
