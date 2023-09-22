<template>
  <view class="coin-list flex-box">
    <view class="coin-select flex-box">
      <view
        @click="changeCoin(item)"
        class="coin-item"
        :class="{ 'coin-item-active': value === item.key }"
        v-for="(item, index) in coinArray"
        :key="index"
      >
        {{ item.label }}
      </view>
    </view>
    <full-screen>
      <view class="view-list" v-show="bookList.length">
        <view class="item-list" v-for="(item, index) in bookList" :key="index">
          <view class="flex-box-between">
            <text class="coin-name">{{ item.name }}</text>
            <!--            <u-image-->
            <!--              @click="handleCopy(item.address)"-->
            <!--              width="24px"-->
            <!--              height="24px"-->
            <!--              src="@/static/icons/copy.svg"-->
            <!--            ></u-image>-->
          </view>
          <view class="value mt-10 mb-10">{{ item.remark }}</view>
          <view class="value">{{ item.address }}</view>
          <view class="flex-box edit-item">
            <text
              class="edit-item-button is-copy"
              @click="handleCopy(item.address)"
            >复制
            </text
            >
            <text class="edit-item-button is-delete" @click="toDelete(item)"
            >删除
            </text
            >
          </view>
        </view>
      </view>
      <unBind v-show="!bookList.length"/>
    </full-screen>
    <custom-modal
      :confirm="confirm"
      title="复制成功"
      cancelText="关闭"
      confirmText="前往转账"
      isCenter
      :show.sync="show"
      message="复制成功是否前往转账？"
    ></custom-modal>
    <custom-modal
      title="删除地址"
      confirmText="确定删除"
      isCenter
      :show.sync="showDelete"
      message="是否确定删除地址？"
      :confirm="confirmDelete"
    ></custom-modal>
  </view>
</template>

<script>
import fullScreen from "@/components/full-screen/full-screen"
import customModal from "@/components/custom-modal/index.vue"
import unBind from "./un-bind"
import {deleteAddressBook} from "../../../api/api"

export default {
  name: "coin-list",
  components: {fullScreen, customModal, unBind},
  props: {
    coinList: {
      type: Array,
    },
    value: {
      type: String,
    },
    bookList: {
      type: Array,
    },
    getBook: {
      type: Function,
    },
  },
  data () {
    return {
      show: false,
      showDelete: false,
      address: "",
      id: "",
    }
  },
  computed: {
    coinArray () {
      const list = this.coinList.map((item) => {
        return {label: item, key: item}
      })
      list.unshift({label: "全部", key: ""})
      return list
    },
  },
  methods: {
    changeCoin ({key}) {
      this.$emit("input", key)
      this.$emit("change", key)
    },
    handleCopy (value) {
      this.address = value
      uni.setClipboardData({
        data: value,
        showToast: false,
        success: () => {
          this.show = true
        },
      })
    },
    confirm (val) {
      this.router({
        url: "pages/transfer/index",
        params: {
          address: this.address,
        },
      })
      this.show = false
    },
    toDelete (item) {
      this.showDelete = true
      this.id = item.id
    },
    confirmDelete () {
      deleteAddressBook({id: this.id}).then((res) => {
        this.showDelete = false
        if (res.code.toString() === '0') {
          this.getBook()
          this.$refs.uNotify.show({
            type: "success",
            message: "删除成功",
            safeAreaInsetTop: true,
          })
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.coin-list {
  height: 100%;
  flex-direction: column;

  .coin-select {
    padding: 19px 16px;
    background: #fff;
    white-space: nowrap;
    overflow-x: scroll;
    width: 100%;
    box-sizing: border-box;

    .coin-item {
      padding: 3px 5px;
      border-radius: 3px;
      font-size: 14px;
      color: #999999;
      margin-right: 20px;

      &-active {
        background: #505bde;
        color: #fff;
      }
    }
  }

  .view-list {
    height: 100%;
    overflow-y: scroll;
    padding: 10px;
    box-sizing: border-box;

    .item-list {
      padding: 15px 16px;
      background: #fff;
      margin-bottom: 6px;

      .coin-name {
        font-size: 14px;
        color: #505bde;
      }

      .edit-item {
        margin-top: 16px;
        justify-content: flex-end;

        &-button {
          font-size: 14px;
        }

        .is-delete {
          color: #ef3c3c;
          margin-left: 20px;
        }

        .is-copy {
          color: #505bde;
        }
      }
    }
  }
}
</style>
