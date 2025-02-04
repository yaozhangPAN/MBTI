const { getRandomQuote, getTimeMessage } = require('../../utils/quotes');

Page({
  data: {
    mbtiType: '',
    quote: '',
    timeMessage: ''
  },

  onLoad() {
    console.log('quote页面加载');
    this.loadMBTIData();
  },

  onShow() {
    console.log('quote页面显示');
    // 每次显示页面时都重新加载数据
    this.loadMBTIData();
  },

  loadMBTIData() {
    const mbtiType = wx.getStorageSync('mbtiType');
    console.log('当前获取到的MBTI类型:', mbtiType);
    
    if (!mbtiType) {
      console.log('未找到MBTI类型，返回首页');
      wx.switchTab({
        url: '/pages/index/index'
      });
      return;
    }

    // 无论是否变化都更新数据，确保显示正确
    this.setData({ 
      mbtiType: mbtiType 
    }, () => {
      console.log('更新后的MBTI类型:', this.data.mbtiType);
      this.updateQuote();
    });
  },

  updateQuote() {
    const mbtiType = this.data.mbtiType; // 使用最新的mbtiType
    console.log('获取激励语句的MBTI类型:', mbtiType);
    
    const quote = getRandomQuote(mbtiType);
    const timeMessage = getTimeMessage();

    this.setData({
      quote,
      timeMessage
    });
  },

  refreshQuote() {
    this.updateQuote();
  },

  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
}); 