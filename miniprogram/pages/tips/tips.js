Page({
  data: {
    tips: [] // 存储每日提示
  },
  onLoad: function () {
    // 获取用户的 MBTI 类型并加载相应的提示
    this.loadTips();
  },
  loadTips: function () {
    const mbtiType = 'INTJ'; // 示例，实际应从用户数据中获取
    this.callOpenAI(mbtiType);
  },
  callOpenAI: function (mbtiType) {
    const apiKey = 'YOUR_OPENAI_API_KEY'; // 替换为您的 API 密钥
    wx.request({
      url: 'https://api.openai.com/v1/chat/completions',
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "user", content: `为 MBTI 类型 ${mbtiType} 生成每日小段子` }
        ]
      },
      success: (res) => {
        this.setData({
          tips: [res.data.choices[0].message.content]
        });
      },
      fail: (err) => {
        console.error('API 调用失败:', err);
      }
    });
  }
}); 