<template>
  <view style="background-color: #FFFFFF;width: 100vw;height: 100vh">
    <view style="text-align: center">
      <image
        src="/static/login-bg.png"
        mode="aspectFit"
        style="width: 90vw; margin-top: 10px"
      ></image>
    </view>
    <view class="loginContain">
      <form>
        <view class="cu-form-group margin-top">
          <view class="title"> 账号 </view>
          <input type="text" placeholder="请输入账号" />
        </view>
        <view class="cu-form-group">
          <view class="title"> 密码 </view>
        <input type="password" placeholder="请输入密码" />
        </view>
      </form>
    </view>
  </view>
</template>

<script>
export default {};
</script>

<style>
.loginContain {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 10px 10px 10px #909090;
}
</style>