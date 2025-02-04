const { sendMessage } = require('../../utils/chat');

Page({
  data: {
    messages: [],
    inputValue: '',
    mbtiType: '',
    aiName: 'AI助手',
    loading: false
  },

  onLoad() {
    this.updateAIPersonality();
  },

  onShow() {
    // 每次页面显示时检查 MBTI 类型是否变化
    const currentMbti = wx.getStorageSync('mbtiType');
    if (currentMbti !== this.data.mbtiType) {
      this.updateAIPersonality();
    }
  },

  // 更新 AI 助手个性
  updateAIPersonality() {
    const mbtiType = wx.getStorageSync('mbtiType');
    if (mbtiType) {
      const { aiPersonalities } = require('../../utils/chat');
      const personality = aiPersonalities[mbtiType];
      this.setData({ 
        mbtiType,
        aiName: personality ? `AI助手 - ${personality.name}` : 'AI助手',
        // 清空历史消息，因为切换了人格
        messages: []
      });
    }
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  async sendMessage() {
    const { inputValue, messages, mbtiType } = this.data;
    if (!inputValue.trim()) return;

    // 添加用户消息
    const newMessages = [...messages, {
      type: 'user',
      content: inputValue
    }];

    this.setData({
      messages: newMessages,
      inputValue: '',
      loading: true
    });

    // 发送消息到服务器
    const response = await sendMessage(
      inputValue,
      mbtiType,
      messages.map(m => ({
        role: m.type === 'user' ? 'user' : 'assistant',
        content: m.content
      }))
    );

    if (response.success) {
      // 添加AI回复
      this.setData({
        messages: [...newMessages, {
          type: 'ai',
          content: response.data.response
        }],
        aiName: `AI助手 - ${response.data.aiName}`,
        loading: false
      });
    } else {
      wx.showToast({
        title: response.error,
        icon: 'none'
      });
      this.setData({ loading: false });
    }
  }
});