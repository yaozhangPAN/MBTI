Page({
  data: {
    currentQuestionIndex: 0,
    questions: [
      {
        id: 1,
        text: "在社交场合中，你通常会：",
        options: [
          { value: "E", text: "主动与他人交谈，感到能量充沛" },
          { value: "I", text: "倾向于安静观察，觉得社交消耗能量" }
        ]
      },
      {
        id: 2,
        text: "在获取信息时，你更倾向于：",
        options: [
          { value: "S", text: "关注具体的细节和事实" },
          { value: "N", text: "关注概念和可能性" }
        ]
      },
      {
        id: 3,
        text: "做决定时，你通常会：",
        options: [
          { value: "T", text: "依据逻辑和客观分析" },
          { value: "F", text: "考虑他人感受和价值观" }
        ]
      },
      {
        id: 4,
        text: "在日常生活中，你更喜欢：",
        options: [
          { value: "J", text: "按计划行事，喜欢确定性" },
          { value: "P", text: "保持灵活，随机应变" }
        ]
      }
    ],
    answers: []
  },
  onLoad: function () {
    // 初始化答案数组
    this.setData({
      answers: new Array(this.data.questions.length).fill('')
    });
  },
  onAnswer: function(e) {
    const answer = e.currentTarget.dataset.value;
    const answers = [...this.data.answers];
    answers[this.data.currentQuestionIndex] = answer;
    
    this.setData({
      answers,
      currentQuestionIndex: this.data.currentQuestionIndex + 1
    });

    if (this.data.currentQuestionIndex >= this.data.questions.length) {
      this.calculateResult();
    }
  },
  calculateResult: function() {
    // 先在本地进行初步计算
    const answers = this.data.answers;
    let mbtiResult = '';
    
    // E/I
    const eCount = answers.filter(a => a === 'E').length;
    mbtiResult += eCount > answers.length/8 ? 'E' : 'I';
    
    // S/N
    const sCount = answers.filter(a => a === 'S').length;
    mbtiResult += sCount > answers.length/8 ? 'S' : 'N';
    
    // T/F
    const tCount = answers.filter(a => a === 'T').length;
    mbtiResult += tCount > answers.length/8 ? 'T' : 'F';
    
    // J/P
    const jCount = answers.filter(a => a === 'J').length;
    mbtiResult += jCount > answers.length/8 ? 'J' : 'P';

    // 调用OpenAI API进行深入分析
    this.callOpenAI(answers, mbtiResult);
  },
  callOpenAI: function (answers, initialResult) {
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
          { 
            role: "user", 
            content: `基于以下MBTI测试答案：${answers.join(', ')}，初步计算结果为${initialResult}，请分析这个结果是否准确，并给出详细解释。` 
          }
        ]
      },
      success: (res) => {
        console.log('OpenAI分析结果:', res.data.choices[0].message.content);
        // 这里可以调用后端接口保存用户的 MBTI 类型
        wx.showModal({
          title: '测试结果',
          content: `您的MBTI类型可能是: ${initialResult}\n\n${res.data.choices[0].message.content}`,
          showCancel: false
        });
      },
      fail: (err) => {
        console.error('API 调用失败:', err);
        wx.showModal({
          title: '测试结果',
          content: `您的MBTI类型是: ${initialResult}`,
          showCancel: false
        });
      }
    });
  }
}); 