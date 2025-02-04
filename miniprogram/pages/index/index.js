Page({
  data: {},

  onLoad: function() {
    console.log('页面加载');
    const mbtiType = wx.getStorageSync('mbtiType');
    if (mbtiType) {
      wx.switchTab({
        url: '/pages/quote/quote'
      });
    }
  },

  goToInput: function() {
    console.log('点击了已知MBTI类型按钮');
    wx.navigateTo({
      url: '/pages/input/input'
    });
  },

  goToTest: function() {
    console.log('点击了开始MBTI测试按钮');
    wx.navigateTo({
      url: '/pages/test/test'
    });
  }
}); 