Page({
  data: {
    mbtiInput: ''
  },

  // 处理输入变化
  onInputChange(e) {
    let value = e.detail.value.toUpperCase();
    this.setData({
      mbtiInput: value
    });
  },

  // 保存 MBTI 类型
  saveMBTIType() {
    const mbtiInput = this.data.mbtiInput;
    const validMBTI = /^[EI][NS][TF][JP]$/;
    
    if (!validMBTI.test(mbtiInput)) {
      wx.showModal({
        title: '提示',
        content: '请输入有效的MBTI类型！\n第一位：E或I\n第二位：N或S\n第三位：T或F\n第四位：J或P',
        showCancel: false
      });
      return;
    }

    wx.setStorageSync('mbtiType', mbtiInput);
    wx.switchTab({
      url: '/pages/quote/quote'
    });
  },

  // 返回首页
  goBack() {
    wx.navigateBack();
  }
}); 