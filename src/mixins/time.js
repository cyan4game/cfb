export default {
  data() {
    return {
      count: parseInt(new Date().valueOf() / 1000),
      timer: null,
    };
  },
  beforeDestroy() {
    this.closeTimer();
  },
  methods: {
    startTimer() {
      this.closeTimer();
      this.timer = setInterval(() => {
        this.count = parseInt(new Date().valueOf() / 1000);
        // console.log(this.count);
      }, 1000);
    },
    closeTimer() {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    },
  },
};
