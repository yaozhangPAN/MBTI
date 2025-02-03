const callOpenAI = function(prompt) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://你的后端服务器地址/api/openai',
      method: 'POST',
      data: {
        prompt: prompt
      },
      success: (res) => resolve(res.data),
      fail: (err) => reject(err)
    });
  });
};

module.exports = {
  callOpenAI
}; 