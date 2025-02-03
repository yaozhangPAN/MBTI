App({
  onLaunch: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res.code);
        // 这里可以调用后端接口进行用户登录
      }
    });
  }
}); 