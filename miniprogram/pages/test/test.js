const { questions, calculateMBTI } = require('../../utils/mbti');

Page({
  data: {
    currentQuestion: 0,
    questions: questions,
    answers: new Array(questions.length).fill(''),
    progress: 0
  },

  // 选择答案
  selectAnswer(e) {
    console.log('选择答案:', e.currentTarget.dataset.value);
    const { value } = e.currentTarget.dataset;
    const { currentQuestion, answers } = this.data;
    
    // 保存答案
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    
    // 计算进度
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    this.setData({
      answers: newAnswers,
      progress
    });

    console.log('当前答案:', newAnswers);

    // 如果是最后一题，计算结果
    if (currentQuestion === questions.length - 1) {
      this.calculateResult();
    } else {
      // 否则显示下一题
      this.setData({
        currentQuestion: currentQuestion + 1
      });
    }
  },

  // 计算结果并跳转
  calculateResult() {
    const mbtiResult = calculateMBTI(this.data.answers);
    console.log('计算得到的MBTI结果:', mbtiResult);
    
    if (!mbtiResult) {
      wx.showToast({
        title: '计算结果出错',
        icon: 'none'
      });
      return;
    }

    // 先清除旧的数据
    wx.removeStorageSync('mbtiType');
    // 保存新的结果
    wx.setStorageSync('mbtiType', mbtiResult);

    // 确保数据保存成功后再跳转
    const savedType = wx.getStorageSync('mbtiType');
    console.log('保存的MBTI类型:', savedType);

    if (savedType === mbtiResult) {
      wx.switchTab({
        url: '/pages/quote/quote',
        success: () => {
          console.log('跳转到quote页面成功');
        },
        fail: (error) => {
          console.error('跳转失败:', error);
        }
      });
    } else {
      wx.showToast({
        title: '保存结果失败',
        icon: 'none'
      });
    }
  }
}); 