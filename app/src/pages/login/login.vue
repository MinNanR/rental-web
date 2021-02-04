<template>
  <view style="background-color: #ffffff; width: 100vw; height: 100vh">
    <view class="background-iamge">
      <image
        src="/static/login-bg.png"
        mode="aspectFit"
        style="width: 90vw; margin-top: 10px"
      ></image>
    </view>
    <view class="login-contianer">
      <view class="title-div"> 账号登录 </view>
      <view class="login-form">
        <form>
          <view class="form-group">
            <text
              class="lg text-gray cuIcon-people"
              style="font-size: 20px; margin-right: 10px"
            ></text>
            <input
              type="text"
              v-model="loginForm.username"
              placeholder="请输入账号"
            />
          </view>
          <view class="form-group">
            <text
              class="lg text-gray cuIcon-unlock"
              style="font-size: 20px; margin-right: 10px"
            ></text>
            <input
              type="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
            />
          </view>
        </form>
      </view>
      <button class="login-btn bg-blue" @click="login()">登录</button>
    </view>
    <view class="cu-load load-modal" v-if="loadModal">
      <!-- <view class="cuIcon-emojifill text-orange"></view> -->
      <image src="/static/logo.png" mode="aspectFit"></image>
      <view class="gray-text">登录中...</view>
    </view>
    <view class="cu-modal" :class="failModal ? 'show' : ''">
      <view class="cu-dialog">
        <view class="cu-bar bg-white justify-end">
          <view class="content">失败</view>
          <view class="action" @tap="hideModal">
            <text class="cuIcon-close text-red"></text>
          </view>
        </view>
        <view class="padding-xl"> 登录失败 </view>
        <view class="cu-bar bg-white justify-end">
          <view class="action">
            <button class="cu-btn bg-green margin-left" @tap="hideModal">
              确定
            </button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Schema from "async-validator";
import md5 from "js-md5";

export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      rules: {
        username: {
          type: "string",
          required: true,
          message: "用户名不能为空",
        },
        password: {
          type: "string",
          required: true,
          message: "密码不能为空",
        },
      },
      loadModal: false,
      failModal: false,
    };
  },
  methods: {
    login() {
      const validator = new Schema(this.rules);
      validator
        .validate(this.loginForm)
        .then(() => {
          let f = {
            username: this.loginForm.username,
            password: md5(this.loginForm.password),
          };
          this.loadModal = true;
          this.request
            .post("/auth/login/password", f)
            .then((response) => {
              let { data, message } = response;
              this.setStorageExpire(
                "token",
                `Bearer ${data.token}`,
                7 * 24 * 60 * 60 * 1000
              );
              this.setStorage("username", this.loginForm.username);
              this.loadModal = false;
              uni.switchTab({ url: "/pages/index/index" });
            })
            .catch((err) => {
              this.loadModal = false;
              this.failModal = true;
              console.error(err);
            });
        })
        .catch(({ errors, fields }) => {
          if (errors) {
            uni.showToast({
              title: fields[Object.keys(fields)[0]][0].message,
              image: "/static/cross.png",
              duration: 3000,
            });
          }
        });
    },
    hideModal() {
      this.failModal = false;
    },
  },
};
</script>

<style>
.login-contianer {
  position: absolute;
  left: 50%;
  top: 30%;
  transform: translate(-50%, -30%);
  box-shadow: 5px 5px 5px 5px #909090;
  width: 80vw;
  height: 600rpx;
  border-radius: 10px 10px;
  opacity: 0.5;
}

.login-form {
  margin-top: 10%;
  opacity: 0.8;
}

.title-div {
  margin-top: 30px;
  margin-left: 20px;
  font-size: 20px;
  font-weight: 600;
  opacity: 1;
}

.form-group {
  background-color: #ffffff;
  padding-top: 0.5px;
  padding-bottom: 0.5px;
  display: flex;
  align-items: center;
  min-height: 50px;
  -webkit-box-pack: justify;
  justify-content: left;
  border-bottom: solid 1px;
  margin-left: 10%;
  margin-right: 10%;
}

.login-btn {
  margin-top: 1rem;
  width: 8rem;
  height: 2rem;
  font-size: 14px;
  border-radius: 15px 15px 15px 15px;
  vertical-align: middle;
}

.background-iamge {
  position: absolute;
  text-align: center;
  z-index: 0;
}
</style>